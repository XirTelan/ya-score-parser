import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema(
  {
    contest: String,
    date: Date,
    status: String,
    step: String,
  },
  {
    timestamps: true,
  }
);
const Contest =
  mongoose.models.Contest || mongoose.model("Contest", ContestSchema);

export default Contest;
