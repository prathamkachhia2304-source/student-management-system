
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: { type: String, required: true },
    course: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
