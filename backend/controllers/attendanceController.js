const Attendance = require("../models/Attendance");
const User = require("../models/User");

// @desc      Check in
// @route     POST /api/attendance/check-in
// @access    Private/Employee
exports.checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingRecord = await Attendance.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingRecord && existingRecord.checkInTime) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today",
      });
    }

    let attendance = existingRecord;

    if (!attendance) {
      attendance = new Attendance({
        user: req.user.id,
        date: today,
        checkInTime: new Date(),
        status: "present",
      });
    } else {
      attendance.checkInTime = new Date();
      attendance.status = "present";
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Checked in successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Check out
// @route     POST /api/attendance/check-out
// @access    Private/Employee
exports.checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No check-in record found for today",
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "Already checked out today",
      });
    }

    attendance.checkOutTime = new Date();

    // Calculate working hours
    if (attendance.checkInTime) {
      const workingMilliseconds =
        attendance.checkOutTime - attendance.checkInTime;
      attendance.workingHours =
        Math.round((workingMilliseconds / (1000 * 60 * 60)) * 2) / 2;
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Checked out successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get my attendance
// @route     GET /api/attendance/my-attendance
// @access    Private/Employee
exports.getMyAttendance = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const filter = { user: req.user.id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    if (status) filter.status = status;

    const attendance = await Attendance.find(filter)
      .populate("user", "firstName lastName email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get all attendance (Admin)
// @route     GET /api/attendance
// @access    Private/Admin
exports.getAllAttendance = async (req, res) => {
  try {
    const { userId, startDate, endDate, status } = req.query;
    const filter = {};

    if (userId) filter.user = userId;
    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const attendance = await Attendance.find(filter)
      .populate("user", "firstName lastName email employeeId")
      .populate("approvedBy", "firstName lastName")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get attendance by ID
// @route     GET /api/attendance/:id
// @access    Private
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("user", "firstName lastName email employeeId")
      .populate("approvedBy", "firstName lastName");

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    // Check authorization
    if (
      req.user.id !== attendance.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this record",
      });
    }

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Manually add/update attendance (Admin)
// @route     POST /api/attendance/add
// @access    Private/Admin
exports.addAttendance = async (req, res) => {
  try {
    const { userId, date, status, checkInTime, checkOutTime, remarks } =
      req.body;

    if (!userId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId, date, and status",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: userId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!attendance) {
      attendance = new Attendance({
        user: userId,
        date: attendanceDate,
        status,
      });
    } else {
      attendance.status = status;
    }

    if (checkInTime) attendance.checkInTime = new Date(checkInTime);
    if (checkOutTime) attendance.checkOutTime = new Date(checkOutTime);
    if (remarks) attendance.remarks = remarks;
    attendance.approvedBy = req.user.id;
    attendance.approvalDate = new Date();

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance added successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get attendance report (Weekly/Monthly)
// @route     GET /api/attendance/report
// @access    Private
exports.getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide startDate and endDate",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filter = {
      date: {
        $gte: start,
        $lte: end,
      },
    };

    if (userId) {
      filter.user = userId;
    } else if (req.user.role === "employee") {
      filter.user = req.user.id;
    }

    const attendance = await Attendance.find(filter)
      .populate("user", "firstName lastName email employeeId")
      .sort({ date: 1 });

    // Calculate statistics
    const stats = {
      totalDays: attendance.length,
      presentDays: attendance.filter((a) => a.status === "present").length,
      absentDays: attendance.filter((a) => a.status === "absent").length,
      halfDays: attendance.filter((a) => a.status === "half-day").length,
      leaveDays: attendance.filter((a) => a.status === "leave").length,
      totalWorkingHours: attendance.reduce(
        (sum, a) => sum + (a.workingHours || 0),
        0
      ),
    };

    res.status(200).json({
      success: true,
      stats,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
