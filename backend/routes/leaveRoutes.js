const express = require("express");
const leaveController = require("../controllers/leaveController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Protect all routes with auth middleware
router.use(authMiddleware);

// Employee routes
router.post("/apply", leaveController.applyLeave);
router.get("/my-requests", leaveController.getMyLeaves);
router.put("/:id/cancel", leaveController.cancelLeave);
router.get("/balance/:userId", leaveController.getLeaveBalance);

// Admin routes
router.get("/", roleMiddleware("admin", "hr"), leaveController.getAllLeaves);
router.get("/:id", leaveController.getLeaveById);
router.put(
  "/:id/approve",
  roleMiddleware("admin", "hr"),
  leaveController.approveLeave
);
router.put(
  "/:id/reject",
  roleMiddleware("admin", "hr"),
  leaveController.rejectLeave
);

module.exports = router;
