const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Protect all routes with auth middleware
router.use(authMiddleware);

// Employee routes
router.post("/check-in", attendanceController.checkIn);
router.post("/check-out", attendanceController.checkOut);
router.get("/my-attendance", attendanceController.getMyAttendance);

// Admin routes
router.get(
  "/",
  roleMiddleware("admin", "hr"),
  attendanceController.getAllAttendance
);
router.get("/:id", attendanceController.getAttendanceById);
router.post(
  "/add",
  roleMiddleware("admin", "hr"),
  attendanceController.addAttendance
);
router.get("/report", attendanceController.getAttendanceReport);

module.exports = router;
