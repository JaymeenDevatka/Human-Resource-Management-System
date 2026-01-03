const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["present", "absent", "half-day", "leave", "on-leave"],
      default: "absent",
    },
    workingHours: {
      type: Number,
      default: 0,
    },
    remarks: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvalDate: Date,
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
attendanceSchema.index({ user: 1, date: 1 });
attendanceSchema.index({ date: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
