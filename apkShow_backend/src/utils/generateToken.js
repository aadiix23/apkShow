const crypto = require("crypto");

const generateUniqueToken = () => {
  return crypto.randomBytes(16).toString("hex"); // 32 character random string
};

module.exports = generateUniqueToken;