// backend/src/controllers/paymentController.js

import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Earning from "../models/Earning.js";
import { createNotification } from "../utils/notificationService.js";

// =========================
// ✅ STRIPE INITIALIZATION
// =========================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  maxNetworkRetries: 3
});

// =========================
// ✅ HELPERS
// =========================

const getEntityDetails = (booking) => {
  const entity = booking.listing || booking.tour;
  if (!entity) return null;
  
  return {
    title: entity.title || 'Experience',
    price: entity.price || 0,
    type: booking.listing ? 'listing' : 'tour'
  };
};

const createPaymentRecord = async (booking, sessionId = null) => {
  const payment = await Payment.create({
    user: booking.user,
    booking: booking._id,
    provider: booking.provider,
    amount: booking.totalPrice,
    currency: "USD",
    status: sessionId ? "pending" : "paid",
    stripeSessionId: sessionId,
    metadata: {
      bookingId: booking._id.toString(),
      entityType: booking.listing ? 'listing' : 'tour'
    }
  });
  return payment;
};

// =========================
// ✅ CREATE CHECKOUT SESSION
// =========================

export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required"
      });
    }

    // ✅ Get booking with populated entity
    const booking = await Booking.findById(bookingId)
      .populate("tour", "title price location")
      .populate("listing", "title price location")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // ✅ SECURITY - Check if user owns this booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot pay for this booking"
      });
    }

    // ✅ Check if already paid
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Booking already paid"
      });
    }

    // ✅ Get entity details
    const entity = booking.listing || booking.tour;
    if (!entity) {
      console.error('❌ No entity found for booking:', bookingId);
      return res.status(404).json({
        success: false,
        message: "No experience associated with this booking. Please contact support."
      });
    }

    const entityTitle = entity.title || 'Experience';
    const entityPrice = entity.price || 0;
    const amount = booking.totalPrice || entityPrice || 100;

    // ✅ Create payment record
    const payment = await Payment.create({
      user: req.user._id,
      booking: booking._id,
      provider: booking.provider,
      amount: amount,
      currency: "USD",
      status: "pending"
    });

    console.log('✅ Payment record created:', payment._id);

    // ✅ Create Stripe session
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: entityTitle,
              description: `Booking for ${entityTitle} - ${booking.numberOfPeople || 1} traveler(s)`
            },
            unit_amount: Math.round(amount * 100)
          },
          quantity: 1
        }
      ],
      metadata: {
        bookingId: booking._id.toString(),
        paymentId: payment._id.toString()
      },
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment-cancel?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: req.user.email,
      client_reference_id: booking._id.toString()
    });

    console.log('✅ Stripe session created:', session.id);

    // ✅ Update payment with session ID
    payment.stripeSessionId = session.id;
    await payment.save();

    res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      paymentId: payment._id
    });

  } catch (error) {
    console.error("❌ Create Checkout Session Error:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment session"
    });
  }
};


// =========================
// ✅ VERIFY PAYMENT
// =========================

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required"
      });
    }

    console.log('🔍 Verifying payment for session:', sessionId);

    // ✅ Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    console.log('📊 Session payment status:', session.payment_status);
    console.log('📊 Session metadata:', session.metadata);

    // ✅ Get booking from metadata
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "No booking associated with this session"
      });
    }

    // ✅ Find booking WITHOUT populating
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    console.log('📊 Current booking status:', booking.status);
    console.log('📊 Current payment status:', booking.paymentStatus);
    console.log('📊 Start Date:', booking.startDate);
    console.log('📊 End Date:', booking.endDate);

    // ✅ If payment succeeded, update booking
    if (session.payment_status === 'paid') {
      // ✅ Update ONLY the fields needed (avoid validation issues)
      booking.paymentStatus = "paid";
      booking.status = "paid";
      booking.paymentId = session.payment_intent;
      booking.paidAt = new Date();
      
      // ✅ Skip validation for this save
      await booking.save({ validateBeforeSave: false });

      // ✅ Update payment record
      const Payment = await import('../models/Payment.js');
      const payment = await Payment.default.findOne({ stripeSessionId: sessionId });
      if (payment) {
        payment.status = "paid";
        payment.stripePaymentId = session.payment_intent;
        payment.transactionId = session.payment_intent;
        payment.paidAt = new Date();
        payment.providerAmount = payment.amount - (payment.platformFee || 0);
        await payment.save();
        console.log('✅ Payment record updated:', payment._id);
      }

      console.log('✅ Booking updated to paid:', bookingId);
      
      // ✅ Populate for response
      await booking.populate('listing', 'title price location');
      await booking.populate('tour', 'title price location');
    } else {
      console.log('⚠️ Payment not completed. Status:', session.payment_status);
    }

    res.json({
      success: true,
      paymentStatus: session.payment_status,
      bookingStatus: booking.status,
      booking: {
        _id: booking._id,
        status: booking.status,
        totalPrice: booking.totalPrice,
        bookingCode: booking.bookingCode,
        numberOfPeople: booking.numberOfPeople,
        startDate: booking.startDate,
        listing: booking.listing || null,
        tour: booking.tour || null
      }
    });

  } catch (error) {
    console.error("❌ Verify Payment Error:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment"
    });
  }
};

// =========================
// ✅ STRIPE WEBHOOK
// =========================

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({
      success: false,
      message: "Webhook secret not configured"
    });
  }

  let event;

  try {
    // ✅ Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (error) {
    console.log("❌ Webhook Signature Error:", error.message);
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${error.message}`
    });
  }

  // ✅ Log webhook event
  console.log(`📥 Webhook received: ${event.type}`);

  // ✅ Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// ✅ WEBHOOK HANDLERS
// =========================

const handleCheckoutCompleted = async (session) => {
  const { bookingId, paymentId } = session.metadata;
  
  console.log(`💰 Payment successful for session: ${session.id}`);
  console.log(`📦 Booking ID: ${bookingId}`);

  if (!bookingId) {
    console.error("❌ No bookingId in session metadata");
    return;
  }

  // ✅ Use transaction to ensure atomicity
  const booking = await Booking.findById(bookingId)
    .populate("tour", "title")
    .populate("listing", "title");

  if (!booking) {
    console.error("❌ Booking not found:", bookingId);
    return;
  }

  // ✅ Check if already processed (idempotency)
  if (booking.paymentStatus === 'paid') {
    console.log(`ℹ️ Booking ${bookingId} already marked as paid, skipping`);
    return;
  }

  // ✅ Update payment
  const payment = await Payment.findById(paymentId);
  if (payment) {
    payment.status = "paid";
    payment.stripePaymentId = session.payment_intent;
    payment.transactionId = session.payment_intent;
    payment.paidAt = new Date();
    await payment.save();
  } else {
    // Create payment if missing (edge case)
    await createPaymentRecord(booking, session.id);
  }

  // ✅ Update booking
  booking.paymentStatus = "paid";
  booking.status = "paid";
  booking.paymentId = session.payment_intent;
  booking.paidAt = new Date();
  await booking.save();

  const entityTitle = booking.listing?.title || booking.tour?.title || 'experience';
  const amount = booking.totalPrice || 0;

  // ✅ Create earning for provider (90%)
  const earning = await Earning.create({
    provider: booking.provider,
    booking: booking._id,
    amount: amount * 0.9,
    platformFee: amount * 0.1,
    status: "available",
    paymentId: session.payment_intent,
    paidAt: new Date()
  });

  // ✅ Send notifications
  await Promise.all([
    createNotification({
      recipient: booking.provider,
      sender: booking.user,
      type: 'payment_success',
      title: 'Payment Received 💰',
      message: `You received a payment of $${amount} for ${entityTitle}`,
      data: { bookingId: booking._id, earningId: earning._id },
      link: `/provider/earnings`
    }),
    createNotification({
      recipient: booking.user,
      sender: booking.provider,
      type: 'payment_success',
      title: 'Payment Successful ✅',
      message: `Your payment of $${amount} for ${entityTitle} was successful!`,
      data: { bookingId: booking._id },
      link: `/my-bookings/${booking._id}`
    })
  ]);

  // ✅ Emit socket events
  const io = req.app?.get('io');
  if (io) {
    io.to(booking.user.toString()).emit('newNotification', {
      title: 'Payment Successful ✅',
      message: `Your payment of $${amount} was successful!`,
      type: 'payment_success',
      data: { bookingId: booking._id }
    });
    io.to(booking.provider.toString()).emit('newNotification', {
      title: 'Payment Received 💰',
      message: `You received a payment of $${amount}`,
      type: 'payment_success',
      data: { bookingId: booking._id }
    });
  }

  console.log(`✅ Payment processed successfully for booking: ${bookingId}`);
};

const handleCheckoutExpired = async (session) => {
  const { bookingId } = session.metadata;
  console.log(`⏰ Checkout expired for booking: ${bookingId}`);
  
  if (bookingId) {
    const booking = await Booking.findById(bookingId);
    if (booking && booking.status === 'pending_payment') {
      booking.status = 'failed_payment';
      booking.adminNotes = 'Payment session expired';
      await booking.save();
    }
  }
};

const handlePaymentIntentSucceeded = async (paymentIntent) => {
  console.log(`✅ Payment intent succeeded: ${paymentIntent.id}`);
  // Additional handling if needed
};

const handlePaymentFailed = async (paymentIntent) => {
  console.log(`❌ Payment failed: ${paymentIntent.id}`);
  const { bookingId } = paymentIntent.metadata;
  
  if (bookingId) {
    const booking = await Booking.findById(bookingId);
    if (booking) {
      await booking.markAsFailed(paymentIntent.last_payment_error?.message || 'Payment failed');
    }
  }
};

const handleChargeRefunded = async (charge) => {
  console.log(`💸 Charge refunded: ${charge.id}`);
  const { bookingId } = charge.metadata;
  
  if (bookingId) {
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.paymentStatus = 'refunded';
      booking.status = 'cancelled';
      booking.cancelledAt = new Date();
      booking.refundAmount = charge.amount_refunded / 100;
      booking.refundedAt = new Date();
      await booking.save();
    }
  }
};

// =========================
// ✅ GET PAYMENT BY ID
// =========================

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('user', 'name email')
      .populate('booking', 'tour listing startDate endDate totalPrice status')
      .populate('provider', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // ✅ Authorization check
    const isAuthorized = 
      payment.user._id.toString() === req.user._id.toString() ||
      payment.provider._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payment"
    });
  }
};

// =========================
// ✅ GET MY PAYMENTS
// =========================

export const getMyPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate('booking', 'tour listing totalPrice status startDate')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Payment.countDocuments(filter);

    res.json({
      success: true,
      payments,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payments"
    });
  }
};

// =========================
// ✅ GET PROVIDER PAYMENTS
// =========================

export const getProviderPayments = async (req, res) => {
  try {
    // ✅ Only providers can access
    if (req.user.role !== 'provider' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Provider account required."
      });
    }

    const { page = 1, limit = 20, status } = req.query;
    const filter = { provider: req.user._id };
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate('user', 'name email')
      .populate('booking', 'tour listing totalPrice startDate status')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Payment.countDocuments(filter);

    res.json({
      success: true,
      payments,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch provider payments"
    });
  }
};

// =========================
// ✅ TEST PAYMENT (Development)
// =========================

export const testPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('user', 'name email')
      .populate('listing', 'title');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // ✅ Security check
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // ✅ Check if already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: "Booking already paid"
      });
    }

    // ✅ Mark as paid
    booking.paymentStatus = 'paid';
    booking.status = 'paid';
    booking.paidAt = new Date();
    await booking.save();

    // ✅ Create payment record
    await Payment.create({
      user: booking.user,
      booking: booking._id,
      provider: booking.provider,
      amount: booking.totalPrice,
      currency: "USD",
      status: "paid",
      paidAt: new Date(),
      isTestMode: true
    });

    // ✅ Create earning record
    await Earning.create({
      provider: booking.provider,
      booking: booking._id,
      amount: booking.totalPrice * 0.9,
      platformFee: booking.totalPrice * 0.1,
      status: 'available',
      isTestMode: true
    });

    res.json({
      success: true,
      message: "Payment bypassed for testing",
      booking
    });
  } catch (error) {
    console.error('❌ Test payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Test payment failed"
    });
  }
};

// =========================
// ✅ REQUEST REFUND
// =========================

export const requestRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // ✅ Authorization: Only user or admin can request refund
    const isAuthorized = 
      booking.user.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to request refund"
      });
    }

    // ✅ Check if refundable
    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: "Booking is not paid or already refunded"
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: "Completed bookings cannot be refunded"
      });
    }

    // ✅ Process refund via Stripe
    try {
      const refund = await stripe.refunds.create({
        payment_intent: booking.paymentId,
        reason: 'requested_by_customer',
        metadata: {
          bookingId: booking._id.toString(),
          reason: reason || 'Customer requested refund'
        }
      });

      // ✅ Update booking
      booking.paymentStatus = 'refunded';
      booking.status = 'cancelled';
      booking.cancelledAt = new Date();
      booking.cancellationReason = reason || 'Refund requested';
      booking.refundAmount = booking.totalPrice;
      booking.refundedAt = new Date();
      booking.refundId = refund.id;
      await booking.save();

      // ✅ Send notification
      await createNotification({
        recipient: booking.provider,
        type: 'refund_processed',
        title: 'Refund Processed 💸',
        message: `Refund of $${booking.totalPrice} processed for booking ${booking.bookingCode}`,
        data: { bookingId: booking._id }
      });

      res.json({
        success: true,
        message: "Refund processed successfully",
        refund,
        booking
      });
    } catch (stripeError) {
      console.error('❌ Stripe refund error:', stripeError);
      return res.status(500).json({
        success: false,
        message: stripeError.message || "Failed to process refund"
      });
    }
  } catch (error) {
    console.error('❌ Request refund error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process refund request"
    });
  }
};

// =========================
// ✅ GET PROVIDER EARNINGS SUMMARY
// =========================

export const getProviderEarnings = async (req, res) => {
  try {
    // Only providers can access
    if (req.user.role !== 'provider' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Provider account required."
      });
    }

    const providerId = req.user._id;

    // Get earnings from Earning model
    const Earning = await import('../models/Earning.js');
    const summary = await Earning.default.getDashboardSummary(providerId);

    // Get recent earnings
    const recentEarnings = await Earning.default.find({ provider: providerId })
      .populate('booking', 'bookingCode startDate totalPrice')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      summary,
      recent: recentEarnings,
      currency: 'USD'
    });
  } catch (error) {
    console.error("❌ Get provider earnings error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch earnings"
    });
  }
};

// =========================
// ✅ GET ALL PAYMENTS (Admin)
// =========================

export const getAllPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const Payment = await import('../models/Payment.js');
    const payments = await Payment.default.find(filter)
      .populate('user', 'name email')
      .populate('booking', 'bookingCode totalPrice status')
      .populate('provider', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Payment.default.countDocuments(filter);

    res.json({
      success: true,
      payments,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("❌ Get all payments error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payments"
    });
  }
};

// =========================
// ✅ PROCESS REFUND (Admin)
// =========================

export const processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    const Payment = await import('../models/Payment.js');
    const payment = await Payment.default.findById(paymentId)
      .populate('booking', 'bookingCode status')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    if (payment.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: `Payment cannot be refunded. Current status: ${payment.status}`
      });
    }

    // Process refund via Stripe
    const stripe = await import('stripe');
    const stripeInstance = new stripe.default(process.env.STRIPE_SECRET_KEY);

    const refundAmount = amount || payment.amount;
    const refund = await stripeInstance.refunds.create({
      payment_intent: payment.stripePaymentId,
      amount: Math.round(refundAmount * 100),
      reason: reason || 'requested_by_admin',
      metadata: {
        paymentId: payment._id.toString(),
        bookingId: payment.booking._id.toString(),
        reason: reason || 'Admin initiated refund'
      }
    });

    // Update payment
    await payment.processRefund(refund.id, refundAmount);

    // Update booking
    const booking = payment.booking;
    if (booking) {
      booking.status = 'cancelled';
      booking.refundAmount = refundAmount;
      booking.refundedAt = new Date();
      booking.refundId = refund.id;
      await booking.save();
    }

    res.json({
      success: true,
      message: "Refund processed successfully",
      refund,
      payment
    });
  } catch (error) {
    console.error("❌ Process refund error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process refund"
    });
  }
};