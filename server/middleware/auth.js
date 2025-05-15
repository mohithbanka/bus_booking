const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    // logger.warn("No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // logger.info(`Token verified for user ${decoded.email}`);
    next();
  } catch (error) {
    // logger.error("Token verification failed", { error });
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};