const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLogin = (req, res, next) => {
  const token = getTokenFromHeader(req);
  const decodedUser = verifyToken(token);
  if (!decodedUser) {
    throw new Error("Invalid/Expired token!, please login again.");
  } else {
    // save the user into the request object
    req.userAuthId = decodedUser?.id;
    next();
  }
};

module.exports = isLogin;
