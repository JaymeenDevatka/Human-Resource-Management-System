const Leave = require("../models/Leave");
const User = require("../models/User");

// @desc      Apply for leave
// @route     POST /api/leave/apply
// @access    Private/Employee
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, attachments } = req.body;

    // Validation
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date must be before end date",
      });
    }

    // Calculate number of days
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Get user to check leave balance
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check leave balance (for paid and sick leave)
    if (leaveType === "paid" && user.leaveBalance.paidLeave < numberOfDays) {
      return res.status(400).json({
        success: false,
        message: `Insufficient paid leave balance. Available: ${user.leaveBalance.paidLeave} days`,
      });
    }

    if (leaveType === "sick" && user.leaveBalance.sickLeave < numberOfDays) {
      return res.status(400).json({
        success: false,
        message: `Insufficient sick leave balance. Available: ${user.leaveBalance.sickLeave} days`,
      });
    }

    // Create leave request
    const leave = new Leave({
      user: req.user.id,
      leaveType,
      startDate: start,
      endDate: end,
      numberOfDays,
      reason,
      attachments: attachments || [],
      status: "pending",
    });

    await leave.save();

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get my leave requests
// @route     GET /api/leave/my-requests
// @access    Private/Employee
exports.getMyLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user.id };

    if (status) filter.status = status;

    const leaves = await Leave.find(filter)
      .populate("user", "firstName lastName email employeeId")
      .populate("approvedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get all leave requests (Admin)
// @route     GET /api/leave
// @access    Private/Admin
exports.getAllLeaves = async (req, res) => {
  try {
    const { status, userId, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (userId) filter.user = userId;

    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.startDate.$lte = end;
      }
    }

    const leaves = await Leave.find(filter)
      .populate("user", "firstName lastName email employeeId")
      .populate("approvedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get leave by ID
// @route     GET /api/leave/:id
// @access    Private
exports.getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate("user", "firstName lastName email employeeId")
      .populate("approvedBy", "firstName lastName");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    // Check authorization
    if (
      req.user.id !== leave.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this request",
      });
    }

    res.status(200).json({
      success: true,
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Approve leave request (Admin)
// @route     PUT /api/leave/:id/approve
// @access    Private/Admin
exports.approveLeave = async (req, res) => {
  try {
    const { comments } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot approve a ${leave.status} request`,
      });
    }

    // Update leave status
    leave.status = "approved";
    leave.approvedBy = req.user.id;
    leave.approvalDate = new Date();
    if (comments) leave.comments = comments;

    // Update user leave balance
    const user = await User.findById(leave.user);
    if (leave.leaveType === "paid") {
      user.leaveBalance.paidLeave -= leave.numberOfDays;
    } else if (leave.leaveType === "sick") {
      user.leaveBalance.sickLeave -= leave.numberOfDays;
    } else if (leave.leaveType === "unpaid") {
      user.leaveBalance.unpaidLeave -= leave.numberOfDays;
    }

    await user.save();
    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Reject leave request (Admin)
// @route     PUT /api/leave/:id/reject
// @access    Private/Admin
exports.rejectLeave = async (req, res) => {
  try {
    const { comments } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a ${leave.status} request`,
      });
    }

    // Update leave status
    leave.status = "rejected";
    leave.approvedBy = req.user.id;
    leave.approvalDate = new Date();
    if (comments) leave.comments = comments;

    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Cancel leave request (Employee)
// @route     PUT /api/leave/:id/cancel
// @access    Private
exports.cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (req.user.id !== leave.user.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this request",
      });
    }

    if (leave.status === "rejected" || leave.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this request",
      });
    }

    // If approved, refund leave balance
    if (leave.status === "approved") {
      const user = await User.findById(leave.user);
      if (leave.leaveType === "paid") {
        user.leaveBalance.paidLeave += leave.numberOfDays;
      } else if (leave.leaveType === "sick") {
        user.leaveBalance.sickLeave += leave.numberOfDays;
      } else if (leave.leaveType === "unpaid") {
        user.leaveBalance.unpaidLeave += leave.numberOfDays;
      }
      await user.save();
    }

    leave.status = "cancelled";
    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave cancelled successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get leave balance
// @route     GET /api/leave/balance/:userId
// @access    Private
exports.getLeaveBalance = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      leaveBalance: user.leaveBalance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
