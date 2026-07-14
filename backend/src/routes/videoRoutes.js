// backend/src/routes/videoRoutes.js
// ✅ No changes needed - already uses updated controller

import express from "express";

import {
  uploadVideo,
  getVideos,
  getFeaturedVideos,
  getMyVideos,
  likeVideo,
  addView,
  deleteVideo,
} from "../controllers/videoController.js";

import { protect } from "../middleware/authMiddleware.js";

import uploadVideoMiddleware from "../middleware/uploadVideo.js";

const router = express.Router();

/*
=====================================
Public
=====================================
*/

router.get("/", getVideos);

router.get("/featured", getFeaturedVideos);

/*
=====================================
Provider
=====================================
*/

router.get("/my", protect, getMyVideos);

router.post(
  "/",
  protect,
  uploadVideoMiddleware.single("video"),
  uploadVideo
);

router.delete(
  "/:id",
  protect,
  deleteVideo
);

/*
=====================================
Interactions
=====================================
*/

router.patch("/:id/like", protect, likeVideo);

router.patch("/:id/view", addView);

export default router;