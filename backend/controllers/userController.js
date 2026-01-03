const User = require("../models/User");

// @desc      Get all users
// @route     GET /api/users
// @access    Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, department } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (department) filter["jobDetails.department"] = department;

    const users = await User.find(filter).select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get user by ID
// @route     GET /api/users/:id
// @access    Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is accessing their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this profile",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Get current user profile
// @route     GET /api/users/profile/me
// @access    Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Update user profile
// @route     PUT /api/users/:id
// @access    Private
exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check authorization
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
    }

    const {
      firstName,
      lastName,
      phone,
      address,
      profilePicture,
      jobDetails,
      salaryStructure,
    } = req.body;

    // Employees can only update certain fields
    if (req.user.role === "employee" && req.user.id === req.params.id) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      user.profilePicture = profilePicture || user.profilePicture;
    } else if (req.user.role === "admin") {
      // Admins can update all fields
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      user.profilePicture = profilePicture || user.profilePicture;

      if (jobDetails) {
        user.jobDetails = { ...user.jobDetails, ...jobDetails };
      }

      if (salaryStructure) {
        user.salaryStructure = { ...user.salaryStructure, ...salaryStructure };
      }
    }

    user = await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: user.toObject({ getters: true, virtuals: false }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Update password
// @route     PUT /api/users/:id/password
// @access    Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to change this password",
      });
    }

    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Deactivate user account
// @route     PUT /api/users/:id/deactivate
// @access    Private/Admin
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Reactivate user account
// @route     PUT /api/users/:id/activate
// @access    Private/Admin
exports.activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User activated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Delete user
// @route     DELETE /api/users/:id
// @access    Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Add document to user
// @route     POST /api/users/:id/documents
// @access    Private
exports.addDocument = async (req, res) => {
  try {
    const { documentName, documentUrl } = req.body;

    if (!documentName || !documentUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide document name and URL",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.documents.push({
      documentName,
      documentUrl,
      uploadDate: new Date(),
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Document added successfully",
      documents: user.documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc      Delete document from user
// @route     DELETE /api/users/:id/documents/:docId
// @access    Private
exports.deleteDocument = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.documents = user.documents.filter(
      (doc) => doc._id.toString() !== req.params.docId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      documents: user.documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
