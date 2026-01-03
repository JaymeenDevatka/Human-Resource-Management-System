const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Protect all routes with auth middleware
router.use(authMiddleware);

// Get current user profile
router.get("/profile/me", userController.getProfile);

// User management (Admin only)
router.get("/", roleMiddleware("admin"), userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.put("/:id/password", userController.updatePassword);
router.put(
  "/:id/deactivate",
  roleMiddleware("admin"),
  userController.deactivateUser
);
router.put(
  "/:id/activate",
  roleMiddleware("admin"),
  userController.activateUser
);
router.delete("/:id", roleMiddleware("admin"), userController.deleteUser);

// Document management
router.post("/:id/documents", userController.addDocument);
router.delete("/:id/documents/:docId", userController.deleteDocument);

module.exports = router;
