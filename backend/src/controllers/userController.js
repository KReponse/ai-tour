import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

// ================= GET CURRENT USER =================

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    res.json({
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



// ================= UPDATE PROFILE =================

const updateMe = async (req, res) => {
  try {
    console.log("📝 Updating profile for user:", req.user.id);
    console.log("📝 Request body:", req.body);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Update all fields that exist in the schema
    const allowedFields = ['name', 'email', 'phone', 'country', 'bio', 'location', 'avatar'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        user[field] = req.body[field];
      }
    });

    // ✅ Update social links if provided
    if (req.body.socialLinks && typeof req.body.socialLinks === 'object') {
      const socialFields = ['instagram', 'facebook', 'linkedin', 'tiktok', 'twitter', 'youtube'];
      if (!user.socialLinks) user.socialLinks = {};
      
      socialFields.forEach(field => {
        if (req.body.socialLinks[field] !== undefined) {
          user.socialLinks[field] = req.body.socialLinks[field];
        }
      });
    }

    await user.save();

    console.log("✅ User updated:", user._id);

    // ✅ Return updated user (without password)
    const updatedUser = await User.findById(user._id).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= USER STATS =================

const getMyStats = async (req, res) => {
  try {

    const userId = req.user.id;

    const bookings =
      await Booking.countDocuments({
        user: userId,
      });

    const reviews =
      await Review.countDocuments({
        user: userId,
      });

    res.json({
      success: true,
      stats: {
        bookings,
        reviews,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export {
  getMe,
  updateMe,
  getMyStats,
};

// backend/src/controllers/userController.js (add these functions)

/* ================= ADMIN: GET ALL USERS ================= */

export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= ADMIN: GET USER BY ID ================= */

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= ADMIN: UPDATE USER ROLE ================= */

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    const validRoles = ['USER', 'PROVIDER', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${validRoles.join(', ')}`
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= ADMIN: TOGGLE USER STATUS ================= */

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= ADMIN: DELETE USER ================= */

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};