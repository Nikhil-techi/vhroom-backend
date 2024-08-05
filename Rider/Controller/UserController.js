const pool = require("../../config/DBConfig");
const jwt = require("jsonwebtoken");

class InsertController {
  // Create & Update User
  static async AddAndUpdateUser(req, res) {
    try {
      const {
        Mobile,
        Name,
        Email,
        Gender,
        DOB,
        Photo,
        IsVerified,
        ServiceType,
        // UserType,
      } = req.body;
      console.log("req.", req.user);
      const UserType = req.user._UserType;

      if (!Mobile || !Email) {
        return res
          .status(400)
          .json({ message: "Mobile and Email are required" });
      }

      // Check if the email is already in use by another user with a different mobile number
      const checkEmailQuery = `
        SELECT * FROM public."${UserType}User" WHERE "Email" = $1 AND "Mobile" != $2;
      `;
      const { rows: emailRows } = await pool.query(checkEmailQuery, [
        Email,
        Mobile,
      ]);

      if (emailRows.length > 0) {
        return res
          .status(400)
          .json({ message: "Email is already in use by another user" });
      }

      // Check if a user with the given mobile number already exists
      const checkUserQuery = `
        SELECT * FROM public."${UserType}User" WHERE "Mobile" = $1;
      `;
      const { rows: userRows } = await pool.query(checkUserQuery, [Mobile]);
      if (userRows.length > 0) {
        const user = userRows[0];

        if (user.IsActive) {
          // User exists and is active; update user details
          const updateUserQuery = `
            UPDATE public."${UserType}User"
            SET "Name" = $1, "Email" = $2, "Gender" = $3, "DOB" = $4, "Photo" = $5, "IsVerified" = $6, "ServiceType" = $7, "UpdatedOn" = CURRENT_TIMESTAMP
            WHERE "Mobile" = $8 RETURNING *;
          `;
          const { rows: updatedData, rowCount } = await pool.query(
            updateUserQuery,
            [Name, Email, Gender, DOB, Photo, IsVerified, ServiceType, Mobile]
          );

          if (rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
          }

          return res.status(200).json({
            message: "User data updated successfully",
            data: updatedData[0],
          });
        } else {
          // User exists but is not active; complete the sign-up process
          const getLastUserQuery = `
            SELECT "Code" FROM public."${UserType}User" WHERE "IsActive" = true ORDER BY "CreatedOn" DESC LIMIT 1;
          `;
          const { rows: lastUserRows } = await pool.query(getLastUserQuery);

          let Code;
          if (lastUserRows.length > 0) {
            const lastCode = lastUserRows[0].Code;
            const codeNumber = parseInt(lastCode.substring(2), 10) + 1;
            Code = `RD${codeNumber.toString().padStart(6, "0")}`;
          } else {
            Code = "RD000001";
          }

          const updateUserQuery = `
            UPDATE public."${UserType}User"
            SET "Name" = $1, "Email" = $2, "Gender" = $3, "DOB" = $4, "Photo" = $5, "Code" = $6, "IsActive" = true, "IsVerified" = false, "UpdatedOn" = CURRENT_TIMESTAMP
            WHERE "Mobile" = $7 RETURNING *;
          `;
          const { rows, rowCount } = await pool.query(updateUserQuery, [
            Name,
            Email,
            Gender,
            DOB,
            Photo,
            Code,
            Mobile,
          ]);

          if (rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
          }

          return res.status(200).json({
            message: "Sign-up completed successfully",
            data: rows[0],
          });
        }
      } else {
        // If the user does not exist, you may want to handle this case.
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error adding or updating user data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get  User By Id
  static async GetUserById(req, res) {
    const { Id } = req.params; // Get the Id from request parameters
    const UserType = req.user._UserType;
    // Validate Id
    if (!Id) {
      return res.status(400).send("User Id is required");
    }

    try {
      const result = await pool.query(
        `SELECT * FROM "${UserType}User" WHERE "Id" = $1`,
        [Id]
      );

      if (result.rowCount === 0) {
        return res.status(404).send("User not found");
      }

      res.json({ data: result.rows[0], message: "User data" });
    } catch (err) {
      console.error("Query error:", err.stack);
      res.status(500).send("Internal Server Error");
    }
  }

  // Generate OTP For Registration & Login
  static async GenerateOtp(req, res) {
    try {
      const { Mobile, UserType } = req.body;

      if (!Mobile || `${Mobile}`.length !== 10) {
        return res.status(400).json({ message: "Invalid Mobile Number" });
      }

      if (!UserType) {
        return res.status(400).json({ message: "UserType is required" });
      }

      const OTP = Math.trunc(Math.random() * (99999 - 10000) + 10000);
      const ExpiredAt = new Date(Date.now() + 10 * 60 * 1000);

      const query = `
      INSERT INTO public."PreRegistration" ("Mobile", "OTP", "UserType", "ExpiredAt")
      VALUES ($1, $2, $3, $4)
      ON CONFLICT ("Mobile", "UserType") 
      DO UPDATE SET 
          "OTP" = EXCLUDED."OTP", 
          "ExpiredAt" = EXCLUDED."ExpiredAt", 
          "IsActive" = true, 
          "UpdatedOn" = CURRENT_TIMESTAMP;
    `;

      await pool.query(query, [Mobile, OTP, UserType, ExpiredAt]);

      res.status(200).json({ message: "OTP generated successfully", OTP }); // Send OTP back for testing
    } catch (error) {
      console.error("Error generating OTP:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Verfiy Generated OTP
  static async VerifyOTP(req, res) {
    try {
      const { Mobile, OTP, UserType } = req.body;

      if (!Mobile || !OTP || !UserType) {
        return res
          .status(400)
          .json({ message: "Mobile number and OTP are required" });
      }

      const Query = `
            SELECT * FROM public."PreRegistration"
            WHERE "Mobile" = $1 AND "OTP" = $2 AND "UserType"=$3 AND "IsActive" = true AND "ExpiredAt" > CURRENT_TIMESTAMP;
        `;

      const { rows } = await pool.query(Query, [Mobile, OTP, UserType]);

      if (rows.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid OTP or OTP has expired" });
      }

      // Delete the verified OTP entry
      const DeleteOTPQuery = `
            DELETE FROM public."PreRegistration"
            WHERE "Mobile" = $1;
        `;

      await pool.query(DeleteOTPQuery, [Mobile]);

      // Check if the mobile number is already registered
      const checkUserQuery = `
       SELECT * FROM public."${UserType}User" WHERE "Mobile" = $1 AND "IsActive" = true;
     `;

      const { rows: userRows } = await pool.query(checkUserQuery, [Mobile]);

      if (userRows.length > 0) {
        // User already registered

        const token = jwt.sign(
          {
            _Id: userRows.Id,
            _UserType: UserType,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 Day
          }
        );

        if (!!userRows[0].ServiceType && !userRows[0].IsVerified) {
          return res.status(200).json({
            message: "Successfully Logged in, please complete Onboarding",
            redirect: "DrivingLicence",
            data: userRows[0],
            token,
          });
        }

        if (!userRows[0].IsVerified) {
          return res.status(200).json({
            message: "Successfully Logged in, please complete Onboarding",
            redirect: "ImageUpload",
            data: userRows[0],
            token,
          });
        }

        return res.status(200).json({
          message: "Successfully Logged in",
          redirect: "tabs",
          data: userRows[0],
          token,
        });
      } else {
        // User not registered, create a new user entry

        const addUserQuery = `
         INSERT INTO public."${UserType}User" ("Mobile", "IsActive")
         VALUES ($1, false)
         ON CONFLICT ("Mobile") DO UPDATE SET 
           "IsActive" = false, 
           "UpdatedOn" = CURRENT_TIMESTAMP;
       `;

        await pool.query(addUserQuery, [Mobile]);

        const letData = `
       SELECT * FROM public."${UserType}User" WHERE "Mobile" = $1;
     `;

        const { rows: data } = await pool.query(letData, [Mobile]);

        const token = jwt.sign(
          {
            _Id: data[0].Id,
            _UserType: UserType,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 Day
          }
        );

        // Respond to frontend to direct user to sign up page
        return res.status(200).json({
          message: "OTP verified successfully, please sign up",
          redirect: "location",
          data: Mobile,
          token,
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = InsertController;
