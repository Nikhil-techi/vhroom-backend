const AWS = require("aws-sdk");

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const AddS3Media = async (req, res) => {
    try {
        const { filename, foldername } = req.body;
        const file = req.file; // Change this to req.files if using multiple files

        if (!file || !filename || !foldername) {
            return res.status(400).json({ message: "Filename, foldername, and file are required" });
        }

        // Extract file extension
        const extension = `${file.originalname}`.split(".").pop();

        // Set S3 upload parameters
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${foldername}/${filename}.${extension}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            CacheControl: "no-cache",
            // ACL: "public-read", // Make file publicly accessible
        };

        // Upload file to S3
        const data = await s3.upload(params).promise();
        let location = data.Location;
        if (process.env.AWS_BUCKET_FILE_PATH) {
            location = location.replace(process.env.AWS_BUCKET_FILE_PATH, "");
        }
        // Return the file URL
        res.status(200).json({
            message: "File uploaded successfully",
            data: location
        });
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        res.status(500).json({ message: "Failed to upload file to S3" });
    }
};

module.exports = AddS3Media;
