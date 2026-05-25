const bcrypt =
  require('bcryptjs');

const jwt =
  require('jsonwebtoken');

const User =
  require('../models/User');

/* ================= REGISTER USER ================= */

const registerUser =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
        role,
      } = req.body;

      /* VALIDATION */

      if (
        !name ||
        !email ||
        !password
      ) {

        return res.status(400).json({
          success: false,
          message:
            'All fields are required',
        });

      }

      /* CHECK USER */

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({
          success: false,
          message:
            'User already exists',
        });

      }

      /* HASH PASSWORD */

      const salt =
        await bcrypt.genSalt(10);

      const hashedPassword =
        await bcrypt.hash(
          password,
          salt
        );

      /* CREATE USER */

      const user =
        await User.create({
          name,
          email,
          password:
            hashedPassword,
          role:
            role || 'user',
        });

      /* TOKEN */

      const token =
        jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d',
          }
        );

      res.status(201).json({
        success: true,

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

/* ================= LOGIN USER ================= */

const loginUser =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      /* CHECK USER */

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(400).json({
          success: false,
          message:
            'Invalid credentials',
        });

      }

      /* CHECK PASSWORD */

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          success: false,
          message:
            'Invalid credentials',
        });

      }

      /* TOKEN */

      const token =
        jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d',
          }
        );

      res.status(200).json({
        success: true,

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

module.exports = {
  registerUser,
  loginUser,
};