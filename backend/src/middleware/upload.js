// backend/src/middleware/upload.js

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// STORAGE CONFIGURATION
// ===============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Upload to src/uploads/ directory
    const uploadPath = path.join(__dirname, "..", "uploads");
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// ===============================
// FILE FILTER
// ===============================

const fileFilter = (req, file, cb) => {
  console.log("UPLOAD FILE:", file.originalname, file.mimetype);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/heic",
    "image/heif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

// ===============================
// MULTER CONFIGURATION
// ===============================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // ✅ 500MB max (for videos)
    files: 20, // Max 20 files at once
  },
});

export default upload;