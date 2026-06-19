const generateSlug = (username,appName)=>{
    const cleanUsername = username
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
     const cleanAppName = appName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")       // multiple dashes ek mein convert
    .replace(/^-|-$/g, "");    // start/end ke dashes hatao

  return `${cleanUsername}-${cleanAppName}`;
};
module.exports = generateSlug;