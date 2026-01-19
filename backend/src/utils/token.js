  import jwt from "jsonwebtoken";
  import dotenv from "dotenv";
  dotenv.config();


  export const verifyToken = (token, res) => {
    const secret = process.env.JWT_SECRET;
    try {
      const verified = jwt.verify(token, secret);
      return verified;
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
      return null;
    }
  };

 export const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    }
  );
};




  export const generateTokenPair = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    return { accessToken, refreshToken };
  };

  export default { generateToken, verifyToken };
