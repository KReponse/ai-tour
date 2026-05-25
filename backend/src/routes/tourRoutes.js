const express =
  require('express');

const router =
  express.Router();

const {
  createTour,
  getTours,
} = require(
  '../controllers/tourController'
);

const {
  protect,
} = require(
  '../middleware/authMiddleware'
);

const {
  authorizeRoles,
} = require(
  '../middleware/roleMiddleware'
);

/* ================= CREATE TOUR ================= */

router.post(
  '/',
  protect,
  authorizeRoles(
    'provider',
    'admin'
  ),
  createTour
);

/* ================= GET TOURS ================= */

router.get(
  '/',
  getTours
);

module.exports = router;