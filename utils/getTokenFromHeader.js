const getTokenFromHeader = (req) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    return "Token not found";
  }
  return token;
};

module.exports = getTokenFromHeader;
