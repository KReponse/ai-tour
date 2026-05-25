const Tour =
  require('../models/Tour');

/* ================= CREATE TOUR ================= */

exports.createTour =
  async (req, res) => {

    try {

      const {
        title,
        location,
        price,
        duration,
        travelers,
        category,
        description,
        images,
        video,
      } = req.body;

      const tour =
        await Tour.create({
          title,
          location,
          price,
          duration,
          travelers,
          category,
          description,
          images,
          video,
          provider:
            req.user._id,
        });

      res.status(201).json({
        success: true,
        tour,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

/* ================= GET TOURS ================= */

exports.getTours =
  async (req, res) => {

    try {

      const tours =
        await Tour.find()
          .populate(
            'provider',
            'name email'
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        tours,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };