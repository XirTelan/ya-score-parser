import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 60,
    },
    contest1: {
      tasks: Number,
      fine: Number,
    },
    contest2: {
      tasks: Number,
      fine: Number,
    },
    contest3: {
      tasks: Number,
      fine: Number,
    },
    contest4: {
      tasks: Number,
      fine: Number,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
