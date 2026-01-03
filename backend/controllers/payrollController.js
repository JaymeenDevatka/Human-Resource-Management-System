const Payroll = require("../models/Payroll");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// @desc      Generate payroll
// @route     POST /api/payroll/generate
// @access    Private/Admin
exports.generatePayroll = async (req, res) => {
  try {
    const { userId, month, year } = req.body;

    if (!userId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId, month, and year",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if payroll already exists
    const existingPayroll = await Payroll.findOne({
      user: userId,
      month: `${month}/${year}`,
    });

    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        message: "Payroll already generated for this month",
      });
    }

    // Calculate attendance data for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await Attendance.find({
      user: userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const presentDays = attendanceRecords.filter(
      (a) => a.status === "present"
    ).length;
    const absentDays = attendanceRecords.filter(
      (a) => a.status === "absent"
    ).length;
    const halfDays = attendanceRecords.filter(
      (a) => a.status === "half-day"
    ).length;
    const leaveDays = attendanceRecords.filter(
      (a) => a.status === "leave"
    ).length;

    // Get working days (excluding weekends)
    const workingDays = getWorkingDays(startDate, endDate);

    // Calculate salary
    const baseSalary = user.salaryStructure.baseSalary || 0;
    const allowances = user.salaryStructure.allowances || 0;
    const deductions = user.salaryStructure.deductions || 0;
    const taxDeduction = baseSalary * 0.1; // 10% tax
    const providentFund = baseSalary * 0.05; // 5% PF

    const grossSalary = baseSalary + allowances;
    const totalDeductions = deductions + taxDeduction + providentFund;
    const netSalary = grossSalary - totalDeductions;

    // Create payroll
    const payroll = new Payroll({
      user: userId,
      month: `${month}/${year}`,
      year,
      baseSalary,
      allowances,
      deductions,
      grossSalary,
      netSalary,
      workingDays,
      presentDays,
      absentDays,
      halfDays,
      taxDeduction,
      providentFund,
      status: "pending",
    });

    await payroll.save();

    res.status(201).json({
      success: true,
      message: "Payroll generated successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get payroll by ID
// @route     GET /api/payroll/:id
// @access    Private
exports.getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate("user", "firstName lastName email employeeId")
      .populate("approvedBy", "firstName lastName");

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    // Check authorization
    if (
      req.user.id !== payroll.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this payroll",
      });
    }

    res.status(200).json({
      success: true,
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get my payroll
// @route     GET /api/payroll/my-payroll
// @access    Private/Employee
exports.getMyPayroll = async (req, res) => {
  try {
    const { month, year, status } = req.query;
    const filter = { user: req.user.id };

    if (month && year) {
      filter.month = `${month}/${year}`;
    }
    if (status) filter.status = status;

    const payroll = await Payroll.find(filter)
      .populate("user", "firstName lastName email employeeId")
      .sort({ month: -1 });

    res.status(200).json({
      success: true,
      count: payroll.length,
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get all payroll (Admin)
// @route     GET /api/payroll
// @access    Private/Admin
exports.getAllPayroll = async (req, res) => {
  try {
    const { userId, month, year, status } = req.query;
    const filter = {};

    if (userId) filter.user = userId;
    if (month && year) filter.month = `${month}/${year}`;
    if (status) filter.status = status;

    const payroll = await Payroll.find(filter)
      .populate("user", "firstName lastName email employeeId")
      .populate("approvedBy", "firstName lastName")
      .sort({ month: -1 });

    res.status(200).json({
      success: true,
      count: payroll.length,
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Approve payroll (Admin)
// @route     PUT /api/payroll/:id/approve
// @access    Private/Admin
exports.approvePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    if (payroll.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot approve a ${payroll.status} payroll`,
      });
    }

    payroll.status = "approved";
    payroll.approvedBy = req.user.id;

    await payroll.save();

    res.status(200).json({
      success: true,
      message: "Payroll approved successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Mark payroll as paid (Admin)
// @route     PUT /api/payroll/:id/mark-paid
// @access    Private/Admin
exports.markPayrollAsPaid = async (req, res) => {
  try {
    const { paymentDate, paymentMethod, bankDetails } = req.body;

    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    if (payroll.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payroll already marked as paid",
      });
    }

    payroll.status = "paid";
    payroll.paymentDate = paymentDate || new Date();
    payroll.paymentMethod = paymentMethod;
    if (bankDetails) payroll.bankDetails = bankDetails;

    await payroll.save();

    res.status(200).json({
      success: true,
      message: "Payroll marked as paid",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Update payroll salary structure
// @route     PUT /api/payroll/:id
// @access    Private/Admin
exports.updatePayroll = async (req, res) => {
  try {
    const {
      baseSalary,
      allowances,
      deductions,
      taxDeduction,
      providentFund,
      notes,
    } = req.body;

    let payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    if (payroll.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a paid payroll",
      });
    }

    if (baseSalary) payroll.baseSalary = baseSalary;
    if (allowances) payroll.allowances = allowances;
    if (deductions) payroll.deductions = deductions;
    if (taxDeduction) payroll.taxDeduction = taxDeduction;
    if (providentFund) payroll.providentFund = providentFund;
    if (notes) payroll.notes = notes;

    // Recalculate gross and net salary
    payroll.grossSalary = (payroll.baseSalary || 0) + (payroll.allowances || 0);
    const totalDed =
      (payroll.deductions || 0) +
      (payroll.taxDeduction || 0) +
      (payroll.providentFund || 0);
    payroll.netSalary = payroll.grossSalary - totalDed;

    await payroll.save();

    res.status(200).json({
      success: true,
      message: "Payroll updated successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get payroll report
// @route     GET /api/payroll/report
// @access    Private/Admin
exports.getPayrollReport = async (req, res) => {
  try {
    const { month, year, status } = req.query;
    const filter = {};

    if (month && year) {
      filter.month = `${month}/${year}`;
    }
    if (status) filter.status = status;

    const payrolls = await Payroll.find(filter)
      .populate("user", "firstName lastName email employeeId")
      .populate("approvedBy", "firstName lastName")
      .sort({ month: -1 });

    // Calculate summary statistics
    const summary = {
      totalPayrolls: payrolls.length,
      totalGrossSalary: payrolls.reduce(
        (sum, p) => sum + (p.grossSalary || 0),
        0
      ),
      totalNetSalary: payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0),
      totalDeductions: payrolls.reduce(
        (sum, p) => sum + (p.deductions || 0),
        0
      ),
      totalTaxDeduction: payrolls.reduce(
        (sum, p) => sum + (p.taxDeduction || 0),
        0
      ),
      totalProvidentFund: payrolls.reduce(
        (sum, p) => sum + (p.providentFund || 0),
        0
      ),
      paidPayrolls: payrolls.filter((p) => p.status === "paid").length,
      pendingPayrolls: payrolls.filter((p) => p.status === "pending").length,
      approvedPayrolls: payrolls.filter((p) => p.status === "approved").length,
    };

    res.status(200).json({
      success: true,
      summary,
      payrolls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Delete payroll
// @route     DELETE /api/payroll/:id
// @access    Private/Admin
exports.deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to calculate working days (excluding weekends)
function getWorkingDays(startDate, endDate) {
  let count = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
}
