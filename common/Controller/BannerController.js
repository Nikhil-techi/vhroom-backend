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
    Key: `${folderName}/${fileName}_${Date.now()}.${extension}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: "no-cache",
  };

  // Upload file to S3
  return await s3.upload(params).promise();
};
class InsertController {
  static async GetAllBanner(req, res) {
    const { Name } = req.params;

    try {
      // Query to get the AppBanner by AppName where IsActive is 1, limited to 3 records
      const result = await pool.query(
        `SELECT * FROM "AppBanner" WHERE "AppName" = $1 AND "IsActive" = true ORDER BY "Id" desc LIMIT 3`,
        [Name]
      );
  
      // Check if any record is found
      if (result.rowCount === 0) {
        return res.status(200).json({message:"Banner List",data:[]})
      }
      // Return the found record
      res.status(200).json({message:"Banner List",data:result.rows});
    } catch (err) {
      console.error("Query error:", err.stack);
      res.status(500).send("Internal Server Error");
    }
  }


  static async AddBanner(req, res) {
    const { AppName, ExpireDate } = req.body;
    const file= req.file

    try {

      const { Location } = await UploadHandler(AppName, "Banner", file);
      const newFileLocation = Location.replace(
        process.env.AWS_BUCKET_FILE_PATH,
        ""
      );

      const result = await pool.query(
        `INSERT INTO "AppBanner" ("SliderUrl", "AppName", "ExpireDate") 
         VALUES ($1, $2, $3) RETURNING *`,
        [newFileLocation, AppName, ExpireDate]
      );
      
      // Return the found record
      res.status(200).json({message:"Banner Add",data:result.rows[0]});
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).send("Internal Server Error");
    }
  }


  // Banner Image



  // APP Version
  static async GetAppVersion(req, res) {
  
    const { Name } = req.params; // Get the Id from request parameters

    // Validate Id
    if (!Name) {
      return res.status(400).send("Applcation Name is required");
    }

    try {
      const result = await pool.query(`SELECT * FROM "AppVersionInfo" WHERE "AppName" = $1 AND "IsActive"=true ORDER BY Id DESC`, [
        Name,
      ]);

      if(result.rows.length===0){
        return res.status(200).json({message:"APK Version",data:[]});
      }
  

      res.status(200).json({message:"APK Version",data:result.rows[0].APKVersion});
    } catch (err) {
      console.error("Query error:", err.stack);
      res.status(500).send("Internal Server Error");
    }
  }
  
}

module.exports = InsertController;


