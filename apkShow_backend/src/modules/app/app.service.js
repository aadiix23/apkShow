const {pool} = require("../../config/db")
const cloudinary = require("../../config/cloudinary")

const uploadApkToCloudinary = (fileBuffer,originalFilename)=>{
return new Promise((resolve,reject)=>{
    const uploadStream = cloudinary.uploader.upload_stream(
        {
            resource_type:"raw",
            folder:"apks",
            public_id: `${Date.now()}_${originalFilename.replace(".apk", "")}`,
        },
        (error,result)=>{
            if (error) return reject(error);
        resolve(result);
        }
    )
    uploadStream.end(fileBuffer);
});
}
const createAppRecord = async ({ userId, originalFilename, cloudinaryUrl, fileSizeBytes, appName }) => {
  const { rows } = await pool.query(
    `INSERT INTO apps (user_id, original_filename, cloudinary_url, app_name, file_size_bytes, status)
     VALUES ($1, $2, $3, $4, $5, 'uploaded')
     RETURNING *;`,
    [userId, originalFilename, cloudinaryUrl, appName, fileSizeBytes]
  );
  return rows[0];
};

module.exports = { uploadApkToCloudinary, createAppRecord };