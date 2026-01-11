import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin", "company_admin"],
      default: "user"
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company"
    },
    profilePicture: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
