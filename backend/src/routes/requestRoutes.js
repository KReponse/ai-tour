import express from 'express';
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest
} from '../controllers/requestController.js';
import {
  createProviderRequest,
  getMyProviderRequest,
  getProviderRequests,
  getProviderRequestById,
  updateProviderRequestStatus,
  approveProviderRequest,
  rejectProviderRequest
} from '../controllers/providerController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// =========================
// ALL ROUTES ARE PROTECTED
// =========================

router.use(protect);

// =========================
// USER REQUEST ROUTES
// =========================

// Create request (User/Provider)
router.post('/', createRequest);

// Get my requests (User)
router.get('/my', getMyRequests);

// =========================
// PROVIDER REQUEST ROUTES
// =========================

// Create provider request
router.post(
  '/provider',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'nationalId', maxCount: 1 },
    { name: 'passport', maxCount: 1 },
    { name: 'rdbCertificate', maxCount: 1 },
    { name: 'tinCertificate', maxCount: 1 },
    { name: 'tourismLicense', maxCount: 1 },
    { name: 'businessRegistration', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
  ]),
  createProviderRequest
);

// Get my provider request status
router.get('/provider/me', getMyProviderRequest);

// =========================
// ⚠️ CRITICAL: ADMIN PROVIDER REQUEST ROUTES
// MUST come BEFORE the dynamic /:id route
// =========================

// ✅ Get all provider requests (Admin only)
router.get('/provider-requests', adminOnly, getProviderRequests);

// ✅ Get single provider request by ID (Admin only)
router.get('/provider-requests/:id', adminOnly, getProviderRequestById);

// ✅ Update provider request status (Admin only)
router.put('/provider-requests/:id', adminOnly, updateProviderRequestStatus);

// ✅ Approve provider request (Admin only)
router.put('/provider-requests/:id/approve', adminOnly, approveProviderRequest);

// ✅ Reject provider request (Admin only)
router.put('/provider-requests/:id/reject', adminOnly, rejectProviderRequest);

// =========================
// ⚠️ DYNAMIC ROUTE — MUST come AFTER static routes
// =========================

// Get specific request (User) - THIS MUST BE LAST
router.get('/:id', getRequestById);

// =========================
// ADMIN REQUEST ROUTES
// =========================

// Get all requests (Admin only)
router.get('/', adminOnly, getAllRequests);

// Update request status (Admin only)
router.put('/:id/status', adminOnly, updateRequestStatus);

// Delete request (Admin only)
router.delete('/:id', adminOnly, deleteRequest);

export default router;