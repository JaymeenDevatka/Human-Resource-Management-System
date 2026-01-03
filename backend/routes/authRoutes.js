const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.put("/reset-password/:resetToken", authController.resetPassword);

// Protected routes
router.get("/me", authMiddleware, authController.getMe);
router.get("/logout", authMiddleware, authController.logout);

module.exports = router;
