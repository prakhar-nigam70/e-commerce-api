const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY, (err, decodedData) => {
    if (err) {
      return false;
    }
    return decodedData;
  });
};

module.exports = verifyToken;
