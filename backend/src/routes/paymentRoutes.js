// backend/src/routes/paymentRoutes.js
// ✅ UPDATED - Added payment provider, wallet, and method routes

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
  getProviderEarnings,
  getAllPayments,
  processRefund
} from "../controllers/paymentController.js";
import { protect, providerOnly, adminOnly } from "../middleware/authMiddleware.js";
import paymentService from "../services/paymentService.js";
import walletService from "../services/walletService.js";
import { getEnabledProviders } from "../config/payment.config.js";

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

// Create checkout session (with provider selection)
router.post("/checkout", createCheckoutSession);
console.log('✅ POST /checkout registered');

// Get available payment providers
router.get("/providers", (req, res) => {
  try {
    const providers = getEnabledProviders();
    const providerList = providers.map(p => ({
      id: p.id,
      name: p.name,
      icon: p.icon,
      description: p.description,
      supportedCurrencies: p.supportedCurrencies,
      isTestMode: p.isTestMode,
    }));
    res.json({
      success: true,
      providers: providerList,
    });
  } catch (error) {
    console.error('❌ Get providers error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log('✅ GET /providers registered');

// Get payment methods for a provider
router.get("/providers/:providerId/methods", (req, res) => {
  try {
    const { providerId } = req.params;
    const provider = paymentService.getProvider(providerId);
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `Provider "${providerId}" not found`,
      });
    }

    res.json({
      success: true,
      providerId: provider.providerId,
      providerName: provider.providerName,
      methods: provider.supportedPaymentMethods || ['card', 'mobile_money'],
      supportedCurrencies: provider.supportedCurrencies,
    });
  } catch (error) {
    console.error('❌ Get provider methods error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log('✅ GET /providers/:providerId/methods registered');

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
// ✅ WALLET ROUTES
// =========================

// Get my wallet balance
router.get("/wallet/balance", async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await walletService.getUserWallets(userId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      wallets: result.wallets,
      summary: result.summary,
    });
  } catch (error) {
    console.error('❌ Get wallet balance error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log('✅ GET /wallet/balance registered');

// Get provider wallet summary
router.get("/wallet/provider-summary", providerOnly, async (req, res) => {
  try {
    const providerId = req.user._id;
    const result = await walletService.getProviderBalanceSummary(providerId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      summary: result.summary,
      recentTransactions: result.recentTransactions,
    });
  } catch (error) {
    console.error('❌ Get provider wallet summary error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log('✅ GET /wallet/provider-summary registered');

// Request withdrawal
router.post("/wallet/withdraw", providerOnly, async (req, res) => {
  try {
    const { amount, currency = "USD", paymentMethod = "bank_transfer", metadata = {} } = req.body;
    const providerId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const result = await walletService.requestWithdrawal(
      providerId,
      amount,
      currency,
      paymentMethod,
      metadata
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      withdrawal: {
        id: result.withdrawalId,
        amount: amount,
        currency: currency,
        status: result.transaction.status,
        newBalance: result.newBalance,
      },
    });
  } catch (error) {
    console.error('❌ Request withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log('✅ POST /wallet/withdraw registered');

// Get withdrawal history
router.get("/wallet/withdrawals", providerOnly, async (req, res) => {
  try {
    const providerId = req.user._id;
    const { page = 1, limit = 20, status } = req.query;

    const filter = {
      provider: providerId,
      type: "withdrawal",
    };
    if (status) filter.status = status;

    const result = await walletService.getTransactionHistory(filter, {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      withdrawals: result.transactions,
      total: result.total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(result.total / parseInt(limit)),
    });
  } catch (error) {
    console.error('❌ Get withdrawal history error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log('✅ GET /wallet/withdrawals registered');

// =========================
// ✅ TRANSACTION ROUTES
// =========================

// Get my transaction history
router.get("/transactions", async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, type, status } = req.query;

    const filter = {
      $or: [
        { initiator: userId },
        { recipient: userId },
        { provider: userId },
        { customer: userId },
      ],
    };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const result = await walletService.getTransactionHistory(filter, {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      transactions: result.transactions,
      total: result.total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(result.total / parseInt(limit)),
    });
  } catch (error) {
    console.error('❌ Get transaction history error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log('✅ GET /transactions registered');

// Get transaction by reference
router.get("/transactions/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    const result = await walletService.getTransactionByReference(reference);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.error,
      });
    }

    // ✅ Authorization check
    const transaction = result.transaction;
    const userId = req.user._id.toString();
    const isAuthorized = 
      transaction.initiator?._id?.toString() === userId ||
      transaction.recipient?._id?.toString() === userId ||
      transaction.provider?._id?.toString() === userId ||
      transaction.customer?._id?.toString() === userId ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this transaction",
      });
    }

    res.json({
      success: true,
      transaction: result.transaction,
    });
  } catch (error) {
    console.error('❌ Get transaction by reference error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log('✅ GET /transactions/:reference registered');

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

// Admin: Process withdrawal
router.put("/admin/withdrawals/:transactionId", adminOnly, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status, adminNotes } = req.body;

    if (!status || !['completed', 'failed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required (completed, failed, cancelled)",
      });
    }

    const result = await walletService.processWithdrawal(transactionId, status, adminNotes);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      transaction: result.transaction,
    });
  } catch (error) {
    console.error('❌ Admin process withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log('✅ PUT /admin/withdrawals/:transactionId registered');

// Admin: Get platform wallet summary
router.get("/admin/platform-wallet", adminOnly, async (req, res) => {
  try {
    const result = await walletService.getPlatformWalletSummary();

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      summary: result.summary,
    });
  } catch (error) {
    console.error('❌ Get platform wallet error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log('✅ GET /admin/platform-wallet registered');

console.log('✅ All payment routes registered');

export default router;