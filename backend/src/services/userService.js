import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * CREATE USER
 */


export const saveFcmTokenService = async (userId, fcmToken) => {
  await User.findByIdAndUpdate(userId, { fcmToken });
};


export const createUserService = async (payload, loggedInUser) => {
  const exists = await User.findOne({
    $or: [{ email: payload.email }, { mobile: payload.mobile }]
  });

  if (exists) {
    return {
      success: false,
      statusCode: 409,
      message: "User already exists"
    };
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    ...payload,
    password: hashedPassword,
    createdBy: loggedInUser.id
  });

  return {
    statusCode: 201,
    message: "User created successfully",
    data: user
  };
};

/**
 * LIST USERS
 */
export const listUsersService = async () => {
  const users = await User.find()
    .select("-password")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  return {
    statusCode: 200,
    message: "Users fetched successfully",
    data: users
  };
};

/**
 * GET USER BY ID
 */
export const getUserByIdService = async (id) => {
  const user = await User.findById(id)
    .select("-password")
    .populate("createdBy", "name email role");

  if (!user) {
    return {
      statusCode: 404,
      message: "User not found"
    };
  }

  return {
    statusCode: 200,
    message: "User fetched successfully",
    data: user
  };
};

/**
 * UPDATE USER
 */
export const updateUserService = async (id, payload) => {
  delete payload.password;

  const user = await User.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return {
      statusCode: 404,
      message: "User not found"
    };
  }

  return {
    statusCode: 200,
    message: "User updated successfully",
    data: user
  };
};
