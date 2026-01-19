import { verifyToken } from "../utils/token.js";
import { logger } from "../utils/looger.js";

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.error("Access denied: No token provided");
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    req.user = decoded; // { id, role, email }

    logger.info(`Token verified for user ${decoded.id}`);
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      logger.error("Token expired");
      return res.status(401).json({ message: "Token expired" });
    }

    logger.error("Invalid token: " + err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authenticateToken;
