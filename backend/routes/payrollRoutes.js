const express = require("express");
const payrollController = require("../controllers/payrollController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Protect all routes with auth middleware
router.use(authMiddleware);

// Employee routes
router.get("/my-payroll", payrollController.getMyPayroll);
router.get("/:id", payrollController.getPayrollById);

// Admin routes
router.post(
  "/generate",
  roleMiddleware("admin"),
  payrollController.generatePayroll
);
router.get("/", roleMiddleware("admin"), payrollController.getAllPayroll);
router.put("/:id", roleMiddleware("admin"), payrollController.updatePayroll);
router.put(
  "/:id/approve",
  roleMiddleware("admin"),
  payrollController.approvePayroll
);
router.put(
  "/:id/mark-paid",
  roleMiddleware("admin"),
  payrollController.markPayrollAsPaid
);
router.delete("/:id", roleMiddleware("admin"), payrollController.deletePayroll);
router.get(
  "/report",
  roleMiddleware("admin"),
  payrollController.getPayrollReport
);

module.exports = router;
