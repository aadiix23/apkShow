const {pool} = require("../../config/db")
const cloudinary = require("../../config/cloudinary")
const generateUniqueToken = require("../../utils/generateToken");

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
const generateSlug = require("../../utils/generateSlug");
const createDemoLink = async({appId,userId})=>{
      const appCheck = await pool.query(
    `SELECT id, app_name FROM apps WHERE id = $1 AND user_id = $2`,
    [appId, userId]
  );
  if (appCheck.rows.length === 0) {
    throw new Error("App not found or you don't have access to it");
  }
  const app = appCheck.rows[0];
   const userResult = await pool.query(
    `SELECT name FROM users WHERE id = $1`,
    [userId]
  );
  const username = userResult.rows[0].name;
  const token = generateUniqueToken();
   const slug = generateSlug(username, app.app_name);
   const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
   const { rows } = await pool.query(
    `INSERT INTO demo_links (app_id, token, slug, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    [appId, token, slug, expiresAt]
  );

  return rows[0];
}
const getDemoLinkByToken = async (token) => {
  const { rows } = await pool.query(
    `SELECT demo_links.*, apps.app_name, apps.cloudinary_url, apps.package_name
     FROM demo_links
     JOIN apps ON apps.id = demo_links.app_id
     WHERE demo_links.token = $1`,
    [token]
  );

  if (rows.length === 0) {
    throw new Error("Demo link not found");
  }

  return rows[0];
};
module.exports = { uploadApkToCloudinary, createAppRecord,createDemoLink,getDemoLinkByToken};