// backend/src/controllers/paymentController.js
// ✅ FIXED - Proper metadata assignment, status mapping, and idempotent verification

import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Earning from "../models/Earning.js";
import { createNotification } from "../utils/notificationService.js";
import paymentService from "../services/paymentService.js";
import walletService from "../services/walletService.js";
import { PAYMENT_STATUS } from "../services/paymentProvider.interface.js";

// =========================
// ✅ STRIPE INITIALIZATION
// =========================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  maxNetworkRetries: 3
});

// =========================
// ✅ STATUS MAPPING
// =========================

const STRIPE_STATUS_MAP = {
  'succeeded': 'paid',
  'requires_payment_method': 'pending',
  'requires_confirmation': 'pending',
  'requires_action': 'pending',
  'processing': 'processing',
  'canceled': 'failed',
  'failed': 'failed',
  'complete': 'paid',
  'expired': 'failed',
  'open': 'pending',
  'paid': 'paid',
  'unpaid': 'pending',
  'no_payment_required': 'pending',
};

const mapStripeStatus = (stripeStatus) => {
  return STRIPE_STATUS_MAP[stripeStatus] || 'pending';
};

// =========================
// ✅ LIGHTWEIGHT PROVIDER DATA EXTRACTOR
// =========================

const extractLightweightProviderData = (session, paymentIntent) => {
  const data = {};
  
  if (session) {
    data.sessionId = session.id || null;
    data.sessionStatus = session.status || null;
    data.sessionPaymentStatus = session.payment_status || null;
    data.customerEmail = session.customer_details?.email || session.customer_email || null;
    data.customerName = session.customer_details?.name || null;
    data.created = session.created || null;
    data.expiresAt = session.expires_at || null;
  }
  
  if (paymentIntent) {
    data.paymentIntentId = paymentIntent.id || null;
    data.paymentIntentStatus = paymentIntent.status || null;
    data.amount = paymentIntent.amount ? paymentIntent.amount / 100 : null;
    data.currency = paymentIntent.currency || null;
    data.paymentMethod = paymentIntent.payment_method || null;
    data.latestCharge = paymentIntent.latest_charge || null;
    data.created = paymentIntent.created || null;
  }
  
  return data;
};

// =========================
// ✅ SAFE BOOKING UPDATE
// =========================

const safelyUpdateBooking = async (bookingId, updateData) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { 
        new: true,
        runValidators: false,
        context: 'query'
      }
    );
    return booking;
  } catch (error) {
    console.warn('⚠️ Could not update booking with validation:', error.message);
    const booking = await Booking.findById(bookingId);
    if (booking) {
      Object.assign(booking, updateData);
      booking.markModified('status');
      booking.markModified('paymentStatus');
      booking.markModified('paidAt');
      await booking.save({ validateBeforeSave: false });
    }
    return booking;
  }
};

// =========================
// ✅ IDEMPOTENCY CHECK
// =========================

const isPaymentAlreadyProcessed = async (bookingId) => {
  const existingPayment = await Payment.findOne({
    booking: bookingId,
    status: { $in: ['paid', 'processing'] }
  });
  
  if (existingPayment) {
    console.log(`ℹ️ Payment already processed for booking: ${bookingId}`);
    return true;
  }
  
  const booking = await Booking.findById(bookingId);
  if (booking && booking.paymentStatus === 'paid') {
    console.log(`ℹ️ Booking already marked as paid: ${bookingId}`);
    return true;
  }
  
  return false;
};

// =========================
// ✅ CREATE CHECKOUT SESSION
// =========================

export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId, providerId = 'stripe', paymentMethod = 'card' } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required"
      });
    }

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

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot pay for this booking"
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Booking already paid"
      });
    }

    const entity = booking.listing || booking.tour;
    if (!entity) {
      return res.status(404).json({
        success: false,
        message: "No experience associated with this booking."
      });
    }

    const entityTitle = entity.title || 'Experience';
    const amount = booking.totalPrice || entity.price || 100;

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const successUrl = `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`;
    const cancelUrl = `${clientUrl}/payment-cancel?booking_id=${booking._id}`;

    const result = await paymentService.createPayment({
      bookingId: booking._id,
      providerId: providerId,
      userId: req.user._id,
      amount: amount,
      currency: 'USD',
      paymentMethod: paymentMethod,
      description: `${entityTitle} - Booking #${booking.bookingCode}`,
      metadata: {
        entityType: booking.listing ? 'listing' : 'tour',
        entityTitle: entityTitle,
        numberOfPeople: booking.numberOfPeople || 1,
        bookingCode: booking.bookingCode,
      },
      successUrl: successUrl,
      cancelUrl: cancelUrl,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || "Failed to create payment"
      });
    }

    res.json({
      success: true,
      url: result.payment.paymentUrl || result.providerResult.paymentUrl,
      sessionId: result.payment.providerReference,
      paymentId: result.payment.id,
      provider: providerId,
      status: result.payment.status,
    });

  } catch (error) {
    console.error("❌ Create Checkout Session Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment session"
    });
  }
};

// =========================
// ✅ VERIFY PAYMENT (FIXED)
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

    // ✅ Find payment by session ID
    let payment = await Payment.findOne({
      $or: [
        { stripeSessionId: sessionId },
        { providerReference: sessionId }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    // ✅ IDEMPOTENCY CHECK - If already paid, return success
    if (payment.status === 'paid') {
      console.log(`ℹ️ Payment ${payment._id} already marked as paid`);
      const booking = await Booking.findById(payment.booking)
        .populate('listing', 'title price location')
        .populate('tour', 'title price location');
      
      return res.json({
        success: true,
        alreadyProcessed: true,
        paymentStatus: 'paid',
        booking: booking ? {
          _id: booking._id,
          status: booking.status,
          totalPrice: booking.totalPrice,
          bookingCode: booking.bookingCode,
          numberOfPeople: booking.numberOfPeople,
          startDate: booking.startDate,
        } : null,
      });
    }

    // ✅ Check if booking already paid
    const bookingCheck = await Booking.findById(payment.booking);
    if (bookingCheck && bookingCheck.paymentStatus === 'paid') {
      console.log(`ℹ️ Booking ${payment.booking} already marked as paid`);
      payment.status = 'paid';
      await payment.save();
      
      return res.json({
        success: true,
        alreadyProcessed: true,
        paymentStatus: 'paid',
        booking: {
          _id: bookingCheck._id,
          status: bookingCheck.status,
          totalPrice: bookingCheck.totalPrice,
          bookingCode: bookingCheck.bookingCode,
        },
      });
    }

    // ✅ Retrieve Stripe session
    let session;
    let paymentIntent;
    
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log(`✅ Stripe session: ${session.id}, status: ${session.status}, payment_status: ${session.payment_status}`);
      
      if (session.payment_intent) {
        paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
        console.log(`✅ Payment intent: ${paymentIntent.id}, status: ${paymentIntent.status}`);
      }
    } catch (stripeError) {
      console.error('❌ Stripe retrieval error:', stripeError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to verify payment with Stripe"
      });
    }

    // ✅ Check if payment is successful
    const isSuccessful = 
      (paymentIntent && paymentIntent.status === 'succeeded') ||
      (session && session.payment_status === 'paid') ||
      (session && session.status === 'complete');

    if (!isSuccessful) {
      const stripeStatus = paymentIntent?.status || session?.payment_status || session?.status || 'unknown';
      const mappedStatus = mapStripeStatus(stripeStatus);
      
      payment.status = mappedStatus;
      payment.errorMessage = `Payment not successful. Stripe status: ${stripeStatus}`;
      payment.providerData = extractLightweightProviderData(session, paymentIntent);
      await payment.save();
      
      return res.status(400).json({
        success: false,
        message: `Payment not successful. Status: ${stripeStatus}`,
        paymentStatus: mappedStatus
      });
    }

    // ✅ UPDATE PAYMENT
    const paymentIntentId = paymentIntent?.id || session?.payment_intent || null;
    const latestCharge = paymentIntent?.latest_charge || null;
    const customerEmail = session?.customer_details?.email || session?.customer_email || null;
    const paymentMethodId = paymentIntent?.payment_method || null;

    payment.status = 'paid';
    payment.stripePaymentId = paymentIntentId;
    payment.transactionId = paymentIntentId || sessionId;
    payment.paidAt = new Date();
    payment.providerAmount = payment.amount - (payment.platformFee || 0);
    payment.providerReference = sessionId;
    payment.providerData = extractLightweightProviderData(session, paymentIntent);
    
    const existingMetadata = payment.metadata instanceof Map 
      ? Object.fromEntries(payment.metadata) 
      : (payment.metadata || {});
    
    const newMetadata = {
      ...existingMetadata,
      stripePaymentIntentId: paymentIntentId,
      stripeLatestCharge: latestCharge,
      stripeCustomerEmail: customerEmail,
      stripePaymentMethod: paymentMethodId,
      verifiedAt: new Date().toISOString(),
      sessionId: sessionId,
    };
    
    payment.set('metadata', newMetadata);
    await payment.save();

    // ✅ Update booking
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      booking.paymentId = paymentIntentId;
      booking.paidAt = new Date();
      await booking.save();
    }

    // ✅ Get booking details for notification
    const bookingDetails = await Booking.findById(payment.booking)
      .populate('listing', 'title')
      .populate('tour', 'title')
      .populate('user', 'name email')
      .populate('provider', 'name email');

    const entityTitle = bookingDetails?.listing?.title || bookingDetails?.tour?.title || 'experience';
    const amount = payment.amount || 0;

    // ✅ Determine booking type
    const bookingType = bookingDetails?.listing ? 'listing' : 'tour';

    // ✅ Create earning for provider
    const platformFee = payment.platformFee || (amount * 0.1);
    const providerAmount = amount - platformFee;
    
    const existingEarning = await Earning.findOne({ 
      booking: payment.booking,
      paymentId: paymentIntentId,
    });
    
    if (!existingEarning) {
      await Earning.create({
        provider: payment.provider,
        booking: payment.booking,
        payment: payment._id,
        amount: providerAmount,
        platformFee: platformFee,
        netAmount: providerAmount,
        bookingType: bookingType, // ✅ REQUIRED FIELD
        status: 'available',
        paymentId: paymentIntentId,
        paidAt: new Date()
      });
      console.log(`✅ Earning created for provider: ${payment.provider}`);
    } else {
      console.log(`ℹ️ Earning already exists for booking: ${payment.booking}`);
    }

    // ✅ Send notifications
    if (bookingDetails) {
      await Promise.all([
        createNotification({
          recipient: bookingDetails.provider,
          sender: bookingDetails.user,
          type: 'payment_success',
          title: 'Payment Received 💰',
          message: `You received a payment of $${amount} for ${entityTitle}`,
          data: { bookingId: payment.booking },
          link: `/provider/earnings`
        }),
        createNotification({
          recipient: bookingDetails.user,
          sender: bookingDetails.provider,
          type: 'payment_success',
          title: 'Payment Successful ✅',
          message: `Your payment of $${amount} for ${entityTitle} was successful!`,
          data: { bookingId: payment.booking },
          link: `/my-bookings/${payment.booking}`
        })
      ]);
    }

    console.log(`✅ Payment verified and processed: ${payment.booking}`);

    // ✅ Return success response
    const finalBooking = await Booking.findById(payment.booking)
      .populate('listing', 'title price location')
      .populate('tour', 'title price location');

    res.json({
      success: true,
      paymentStatus: 'paid',
      bookingStatus: finalBooking?.status || 'confirmed',
      booking: finalBooking ? {
        _id: finalBooking._id,
        status: finalBooking.status,
        totalPrice: finalBooking.totalPrice,
        bookingCode: finalBooking.bookingCode,
        numberOfPeople: finalBooking.numberOfPeople,
        startDate: finalBooking.startDate,
        listing: finalBooking.listing || null,
        tour: finalBooking.tour || null
      } : null,
      payment: {
        id: payment._id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        provider: payment.paymentMethod,
        paidAt: payment.paidAt
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

  console.log(`📥 Webhook received: ${event.type}`);

  try {
    const result = await paymentService.handleWebhook('stripe', {
      body: req.body,
      headers: req.headers,
      rawBody: req.rawBody,
      event: event,
    });

    if (result.success) {
      res.json({ received: true, processed: true });
    } else {
      await handleWebhookLegacy(event);
      res.json({ received: true, processed: true });
    }
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    try {
      await handleWebhookLegacy(event);
      res.json({ received: true, processed: true });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        message: fallbackError.message
      });
    }
  }
};

// =========================
// ✅ LEGACY WEBHOOK HANDLERS
// =========================

const handleWebhookLegacy = async (event) => {
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
      console.log(`ℹ️ Unhandled legacy event type: ${event.type}`);
  }
};

const handleCheckoutCompleted = async (session) => {
  const bookingId = session.metadata?.bookingId;
  
  console.log(`💰 Payment successful for session: ${session.id}`);
  console.log(`📦 Booking ID: ${bookingId}`);

  if (!bookingId) {
    console.error("❌ No bookingId in session metadata");
    return;
  }

  const alreadyProcessed = await isPaymentAlreadyProcessed(bookingId);
  if (alreadyProcessed) {
    console.log(`ℹ️ Booking ${bookingId} already processed, skipping`);
    return;
  }

  const booking = await Booking.findById(bookingId).lean();
  if (!booking) {
    console.error("❌ Booking not found:", bookingId);
    return;
  }

  let payment = await Payment.findOne({ booking: bookingId });
  
  if (!payment) {
    payment = await Payment.create({
      user: booking.user,
      booking: booking._id,
      provider: booking.provider,
      amount: booking.totalPrice,
      currency: "USD",
      status: "paid",
      stripeSessionId: session.id,
      stripePaymentId: session.payment_intent,
      transactionId: session.payment_intent,
      paidAt: new Date(),
      paymentMethod: 'stripe',
      source: 'webhook',
      providerReference: session.id,
      platformFee: booking.totalPrice * 0.1,
      providerAmount: booking.totalPrice * 0.9,
      providerData: extractLightweightProviderData(session, null),
      metadata: {
        bookingId: booking._id.toString(),
        entityType: booking.listing ? 'listing' : 'tour',
        webhookProcessed: true,
        webhookProcessedAt: new Date().toISOString(),
      }
    });
  } else if (payment.status !== 'paid') {
    payment.status = 'paid';
    payment.stripeSessionId = session.id;
    payment.stripePaymentId = session.payment_intent;
    payment.transactionId = session.payment_intent;
    payment.paidAt = new Date();
    payment.providerData = extractLightweightProviderData(session, null);
    await payment.save();
  }

  await safelyUpdateBooking(bookingId, {
    paymentStatus: "paid",
    status: "confirmed",
    paymentId: session.payment_intent,
    paidAt: new Date()
  });

  const existingEarning = await Earning.findOne({ booking: bookingId });
  if (!existingEarning) {
    await Earning.create({
      provider: booking.provider,
      booking: booking._id,
      amount: booking.totalPrice * 0.9,
      platformFee: booking.totalPrice * 0.1,
      status: "available",
      paymentId: session.payment_intent,
      paidAt: new Date()
    });
  }

  console.log(`✅ Payment processed successfully for booking: ${bookingId}`);
};

const handleCheckoutExpired = async (session) => {
  const bookingId = session.metadata?.bookingId;
  console.log(`⏰ Checkout expired for booking: ${bookingId}`);
  
  if (bookingId) {
    const alreadyProcessed = await isPaymentAlreadyProcessed(bookingId);
    if (!alreadyProcessed) {
      await safelyUpdateBooking(bookingId, {
        status: 'failed_payment',
        adminNotes: 'Payment session expired'
      });
    }
  }
};

const handlePaymentIntentSucceeded = async (paymentIntent) => {
  console.log(`✅ Payment intent succeeded: ${paymentIntent.id}`);
};

const handlePaymentFailed = async (paymentIntent) => {
  console.log(`❌ Payment failed: ${paymentIntent.id}`);
  const bookingId = paymentIntent.metadata?.bookingId;
  
  if (bookingId) {
    const alreadyProcessed = await isPaymentAlreadyProcessed(bookingId);
    if (!alreadyProcessed) {
      await safelyUpdateBooking(bookingId, {
        status: 'failed_payment',
        adminNotes: paymentIntent.last_payment_error?.message || 'Payment failed'
      });
    }
  }
};

const handleChargeRefunded = async (charge) => {
  console.log(`💸 Charge refunded: ${charge.id}`);
  const bookingId = charge.metadata?.bookingId;
  
  if (bookingId) {
    await safelyUpdateBooking(bookingId, {
      paymentStatus: 'refunded',
      status: 'cancelled',
      cancelledAt: new Date(),
      refundAmount: charge.amount_refunded / 100,
      refundedAt: new Date()
    });
    
    const payment = await Payment.findOne({ booking: bookingId });
    if (payment && payment.status === 'paid') {
      payment.status = 'refunded';
      payment.refundAmount = charge.amount_refunded / 100;
      payment.refundedAt = new Date();
      payment.refundId = charge.id;
      await payment.save();
    }
  }
};

// =========================
// ✅ OTHER CONTROLLER FUNCTIONS
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

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payment"
    });
  }
};

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

export const getProviderPayments = async (req, res) => {
  try {
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

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: "Booking already paid"
      });
    }

    await safelyUpdateBooking(bookingId, {
      paymentStatus: 'paid',
      status: 'confirmed',
      paidAt: new Date()
    });

    await Payment.create({
      user: booking.user,
      booking: booking._id,
      provider: booking.provider,
      amount: booking.totalPrice,
      currency: "USD",
      status: "paid",
      paidAt: new Date(),
      isTestMode: true,
      paymentMethod: 'test',
      platformFee: booking.totalPrice * 0.1,
      providerAmount: booking.totalPrice * 0.9,
      metadata: {
        testPayment: true,
        processedAt: new Date().toISOString(),
      }
    });

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

    const isAuthorized = 
      booking.user.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to request refund"
      });
    }

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

    const payment = await Payment.findOne({ booking: booking._id });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "No payment found for this booking"
      });
    }

    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentId,
      reason: 'requested_by_customer',
      metadata: {
        bookingId: booking._id.toString(),
        reason: reason || 'Customer requested refund'
      }
    });

    await safelyUpdateBooking(bookingId, {
      paymentStatus: 'refunded',
      status: 'cancelled',
      cancelledAt: new Date(),
      cancellationReason: reason || 'Refund requested',
      refundAmount: booking.totalPrice,
      refundedAt: new Date(),
      refundId: refund.id
    });

    payment.status = 'refunded';
    payment.refundAmount = booking.totalPrice;
    payment.refundedAt = new Date();
    payment.refundId = refund.id;
    await payment.save();

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
  } catch (error) {
    console.error('❌ Request refund error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process refund request"
    });
  }
};

export const getProviderEarnings = async (req, res) => {
  try {
    if (req.user.role !== 'provider' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Provider account required."
      });
    }

    const providerId = req.user._id;
    const summary = await Earning.getDashboardSummary(providerId);
    const balanceResult = await walletService.getProviderBalanceSummary(providerId);

    const recentEarnings = await Earning.find({ provider: providerId })
      .populate('booking', 'bookingCode startDate totalPrice')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      summary,
      wallet: balanceResult.success ? balanceResult.summary : null,
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

export const getAllPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate('user', 'name email')
      .populate('booking', 'bookingCode totalPrice status')
      .populate('provider', 'name email')
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
    console.error("❌ Get all payments error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payments"
    });
  }
};

export const processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findById(paymentId)
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

    const refundAmount = amount || payment.amount;
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentId,
      amount: Math.round(refundAmount * 100),
      reason: 'requested_by_admin',
      metadata: {
        paymentId: payment._id.toString(),
        bookingId: payment.booking._id.toString(),
        reason: reason || 'Admin initiated refund'
      }
    });

    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundedAt = new Date();
    payment.refundId = refund.id;
    await payment.save();

    const booking = payment.booking;
    if (booking) {
      await safelyUpdateBooking(booking._id, {
        status: 'cancelled',
        refundAmount: refundAmount,
        refundedAt: new Date(),
        refundId: refund.id
      });
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