const AWS = require("aws-sdk");
const pool = require("../../config/DBConfig");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const UploadHandler = async (fileName, folderName, file) => {
  // Set S3 upload parameters
  const extension = `${file.originalname}`.split(".")[1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folderName}/${fileName}.${extension}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: "no-cache",
  };

  // Upload file to S3
  return await s3.upload(params).promise();
};

// Configure PostgreSQL pool

class DocumentController {
  // Add or update document
  static async AddAndUpdateDocument(req, res) {
    // Handle file upload

    const {
      Id,
      DocNumber,
      IssueDate,
      ExpiredDate,
      RefRiderUser,
      IsActive = true,
      DocType,
    } = req.body;

    const file = req.file; // Uploaded file info

    // Validate required fields
    if (!IssueDate || !RefRiderUser) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    try {
      const fileName = `${DocType}-${DocNumber}-${RefRiderUser}`;

      const checkFileExist = `SELECT * FROM public."RiderDocuments" WHERE "RefRiderUser" = $1 AND "DocLocation" LIKE '%' || $2 || '%'`;

      const { rows: existRows } = await pool.query(checkFileExist, [
        RefRiderUser,
        fileName,
      ]);

      if (existRows.length > 0) {
        return res.status(200).json({
          message: "Data already exist",
        });
      }

      const { Location } = await UploadHandler(fileName, "Rider", file);

      const newFileLocation = Location.replace(
        process.env.AWS_BUCKET_FILE_PATH,
        ""
      );

      console.log("location", Location);

      if (Id) {
        // Update existing document
        await pool.query(
          `UPDATE "RiderDocuments"
             SET "DocNumber" = $1, "IssueDate" = $2, "ExpiredDate" = $3, "DocLocation" = $4, "RefRiderUser" = $5, "IsActive" = $6, "DocType" = $7, "UpdatedOn" = CURRENT_TIMESTAMP
             WHERE "Id" = $8
             RETURNING *`,
          [
            DocNumber,
            IssueDate,
            ExpiredDate,
            newFileLocation,
            RefRiderUser,
            IsActive,
            DocType,
            Id,
          ]
        );
      } else {
        // Add new document
        await pool.query(
          `INSERT INTO "RiderDocuments" ("DocNumber", "IssueDate", "ExpiredDate", "DocLocation", "RefRiderUser", "IsActive", "DocType")
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
          [
            DocNumber,
            IssueDate,
            ExpiredDate,
            newFileLocation,
            RefRiderUser,
            IsActive,
            DocType,
          ]
        );
      }

      res.status(200).json({ message: "Successfully Uploaded" });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).send("Internal Server Error");
    }
  }

  static async GetUploadedDocumentById(req, res) {
    try {
      const { Id, DocType } = req.params;

      const getUploadedDoc = `SELECT * FROM public."RiderDocuments" WHERE "RefRiderUser" = $1 AND "DocType" = $2`;

      const { rows: existRows } = await pool.query(getUploadedDoc, [
        Id,
        DocType,
      ]);

      console.log(existRows);

      if (existRows.length > 0) {
        return res.status(200).json({
          message: "Successfully fetched",
          data: existRows[0],
        });
      }

      res.status(200).json({
        message: "Successfully fetched",
        data: null,
      });
    } catch (err) {
      console.error("Database error:", err.stack);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = DocumentController;
