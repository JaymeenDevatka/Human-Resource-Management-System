const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      match: /^(0?[1-9]|1[0-2])\/\d{4}$/,
    },
    year: Number,
    baseSalary: {
      type: Number,
      required: true,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    grossSalary: Number,
    netSalary: {
      type: Number,
      required: true,
    },
    workingDays: {
      type: Number,
      default: 26,
    },
    presentDays: Number,
    absentDays: Number,
    halfDays: Number,
    overtimeHours: {
      type: Number,
      default: 0,
    },
    overtimePay: {
      type: Number,
      default: 0,
    },
    taxDeduction: {
      type: Number,
      default: 0,
    },
    providentFund: {
      type: Number,
      default: 0,
    },
    insuranceDeduction: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "cancelled"],
      default: "pending",
    },
    paymentDate: Date,
    paymentMethod: {
      type: String,
      enum: ["bank-transfer", "check", "cash"],
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    salarySlipUrl: String,
    generatedOn: {
      type: Date,
      default: Date.now,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
payrollSchema.index({ user: 1, month: 1 });
payrollSchema.index({ month: 1 });
payrollSchema.index({ status: 1 });

module.exports = mongoose.model("Payroll", payrollSchema);
