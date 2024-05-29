// external import
const mongoose = require("mongoose");

// user schema structure
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "Name cannot exceed 20 characters"],
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "User Name cannot exceed 20 characters"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// user model
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
