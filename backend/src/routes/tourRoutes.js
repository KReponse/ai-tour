// backend/src/routes/tourRoutes.js

import express from 'express';
import upload from '../middleware/upload.js';
import {
  createTour,
  getTours,
  getSingleTour,
  getProviderTours,
  getAllTours,
  getPendingTours,
  approveTour,
  rejectTour,
  deleteTour,
  toggleLike,
  getLikes,
  checkLike,
  getToursByLocation,
  updateTour,
  getPopularTours,
} from '../controllers/tourController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// =========================
// PUBLIC ROUTES
// =========================

router.get('/', getTours);
router.get('/popular', getPopularTours);
router.get('/location/:location', getToursByLocation);

router.get('/my', protect, getProviderTours);



// =========================
// LIKES ROUTES (Protected)
// =========================

router.post('/:id/like', protect, toggleLike);
router.get('/:id/likes', getLikes);
router.get('/:id/likes/check', protect, checkLike);

// =========================
// PROVIDER ROUTES (Protected)
// =========================

// ✅ id route LAST
router.get('/:id', getSingleTour);

router.post(
  '/',
  protect,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 15 },
    { name: 'videos', maxCount: 3 }
  ]),
  createTour
);

router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 15 },
    { name: 'videos', maxCount: 3 }
  ]),
  updateTour
);
// =========================
// ADMIN ROUTES (Protected + Admin Only)
// =========================

router.get('/admin/all', protect, adminOnly, getAllTours);
router.get('/admin/pending', protect, adminOnly, getPendingTours);
router.put('/admin/:id/approve', protect, adminOnly, approveTour);
router.put('/admin/:id/reject', protect, adminOnly, rejectTour);
router.delete('/admin/:id', protect, adminOnly, deleteTour);

export default router;