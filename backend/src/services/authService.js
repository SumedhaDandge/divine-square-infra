import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";


export const loginService = async ({ mobile, password }) => {
  const user = await User.findOne({ mobile }).select("+password");

  if (!user) {
    return {
      success: false,
      statusCode: 401,
      message: "Invalid mobile or password"
    };
  }

  if (user.status !== "active") {
    return {
      success: false,
      statusCode: 403,
      message: "User account is not active"
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      success: false,
      statusCode: 401,
      message: "Invalid mobile or password"
    };
  }

  const token = generateToken(user);

  user.lastLogin = new Date();
  await user.save();

  return {
    success: true,
    statusCode: 200,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role
      }
    }
  };
};
