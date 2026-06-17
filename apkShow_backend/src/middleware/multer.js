const multer = require("multer");
const storage =multer.memoryStorage();
const upload = multer({
    storage,
    limits:{
        fileSize:100*1024*1024,
    },
    fileFilter:(req,file,cb)=>{
        if(file.originalname.endsWith(".apk")){
            cb(null,true);
        }
        else{
            cb(new Error("Only .apk Files Are Allowed"))
        }
    }
});
module.exports = upload;