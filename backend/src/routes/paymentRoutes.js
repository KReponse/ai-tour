// backend/src/routes/paymentRoutes.js

import express from "express";
import {
  createCheckoutSession,
  stripeWebhook,
  getPaymentById,
  getMyPayments,
  getProviderPayments,
  verifyPayment,
  testPayment,
  requestRefund,
  getProviderEarnings,      // ✅ Added
  getAllPayments,           // ✅ Added
  processRefund             // ✅ Added
} from "../controllers/paymentController.js";
import { protect, providerOnly, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

console.log('✅ Payment routes loading...');

// =========================
// ✅ STRIPE WEBHOOK (Raw body - NO AUTH)
// =========================
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// =========================
// ✅ LOCAL WEBHOOK TEST (Development only)
// =========================
if (process.env.NODE_ENV === 'development') {
  router.post(
    "/webhook-test",
    express.json(),
    (req, res) => {
      console.log('🧪 Test webhook received:', req.body);
      res.json({ received: true, body: req.body });
    }
  );
}

// =========================
// ✅ PROTECTED ROUTES (All require auth)
// =========================

// All routes below this need authentication
router.use(protect);

console.log('✅ Payment routes protected');

// =========================
// ✅ VERIFICATION ROUTES (Must be BEFORE /:id)
// =========================

// Verify payment - MUST be before /:id to avoid conflict
router.get("/verify/:sessionId", verifyPayment);
console.log('✅ GET /verify/:sessionId registered');

// =========================
// ✅ PAYMENT ROUTES
// =========================

// Create checkout session
router.post("/checkout", createCheckoutSession);
console.log('✅ POST /checkout registered');

// Test payment (bypass Stripe) - Development only
if (process.env.NODE_ENV === 'development') {
  router.post("/test/:bookingId", testPayment);
  console.log('✅ POST /test/:bookingId registered (development only)');
}

// Get my payments
router.get("/my", getMyPayments);
console.log('✅ GET /my registered');

// Get payment by ID - MUST be AFTER /verify/:sessionId
router.get("/:id", getPaymentById);
console.log('✅ GET /:id registered');

// =========================
// ✅ REFUND ROUTES
// =========================

// Request refund for a booking
router.post("/:bookingId/refund", requestRefund);
console.log('✅ POST /:bookingId/refund registered');

// =========================
// ✅ PROVIDER ROUTES
// =========================

// Provider payments (requires provider role)
router.get("/provider", providerOnly, getProviderPayments);
console.log('✅ GET /provider registered');

// Provider earnings summary
router.get("/provider/earnings", providerOnly, getProviderEarnings);
console.log('✅ GET /provider/earnings registered');

// =========================
// ✅ ADMIN ROUTES
// =========================

// Admin: Get all payments
router.get("/admin/all", adminOnly, getAllPayments);
console.log('✅ GET /admin/all registered');

// Admin: Get payment by ID
router.get("/admin/:id", adminOnly, getPaymentById);
console.log('✅ GET /admin/:id registered');

// Admin: Process refund
router.post("/admin/:paymentId/refund", adminOnly, processRefund);
console.log('✅ POST /admin/:paymentId/refund registered');

console.log('✅ All payment routes registered');

export default router;