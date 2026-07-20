// backend/src/services/paymentService.js
// ✅ FIXED - Ensure all metadata values are plain strings, not Mongoose objects

import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Earning from "../models/Earning.js";
import User from "../models/User.js";
import { createNotification } from "../utils/notificationService.js";
import paymentConfig, {
  getEnabledProviders,
  providerSupportsCurrency,
  getDefaultCurrency,
  calculateCommission,
  formatCurrency,
} from "../config/payment.config.js";
import { PAYMENT_STATUS, WEBHOOK_EVENTS } from "./paymentProvider.interface.js";

// ─── Provider Imports ────────────────────────────────────────────
import StripeProvider from "./providers/stripe.provider.js";

class PaymentService {
  constructor() {
    this.providers = new Map();
    this.initializeProviders();
  }

  initializeProviders() {
    const providerConfigs = paymentConfig.providers;

    if (providerConfigs.stripe.enabled) {
      try {
        this.providers.set('stripe', new StripeProvider(providerConfigs.stripe.config));
        console.log('✅ Stripe provider initialized');
      } catch (error) {
        console.error('❌ Failed to initialize Stripe provider:', error.message);
      }
    }

    console.log(`💰 Payment Service initialized with ${this.providers.size} provider(s)`);
  }

  getProvider(providerId) {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Payment provider "${providerId}" not found`);
    }
    if (!provider.isEnabled) {
      throw new Error(`Payment provider "${providerId}" is not enabled`);
    }
    return provider;
  }

  getEnabledProviders() {
    const providers = [];
    for (const [id, provider] of this.providers) {
      if (provider.isEnabled) {
        providers.push({
          id,
          name: provider.providerName,
          supportedCurrencies: provider.supportedCurrencies,
          isTestMode: provider.isTestMode,
        });
      }
    }
    return providers;
  }

  // ─── Core Payment Methods ──────────────────────────────────────

  async createPayment(data) {
    const {
      bookingId,
      providerId,
      userId,
      successUrl,
      cancelUrl,
      metadata = {},
    } = data;

    try {
      console.log(`💰 Creating payment for booking: ${bookingId} via ${providerId}`);

      // ─── 1. Validate booking ────────────────────────────────────
      const booking = await Booking.findById(bookingId)
        .populate('user', 'name email')
        .populate('listing', 'title price')
        .populate('tour', 'title price');

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.paymentStatus === 'paid') {
        throw new Error('Booking already paid');
      }

      // ─── 2. Get payment provider ───────────────────────────────
      const provider = this.getProvider(providerId);
      
      // ─── 3. Validate currency support ──────────────────────────
      const currency = booking.currency || getDefaultCurrency();
      if (!provider.supportedCurrencies.includes(currency)) {
        throw new Error(`Provider "${providerId}" does not support currency "${currency}"`);
      }

      // ─── 4. Calculate payment details ──────────────────────────
      const amount = booking.totalPrice;
      const commission = calculateCommission(amount);
      const providerAmount = amount - commission;

      // ─── 5. Get entity details ─────────────────────────────────
      const entity = booking.listing || booking.tour;
      const entityTitle = entity?.title || 'Experience';

      // ─── 6. ✅ Ensure all IDs are strings before creating payment ──
      const safeUserId = userId ? userId.toString() : booking.user._id.toString();
      const safeBookingId = booking._id.toString();
      const safeProviderId = booking.provider ? booking.provider.toString() : null;

      // ─── 7. Create payment record ──────────────────────────────
      const payment = await Payment.create({
        user: safeUserId,
        booking: safeBookingId,
        provider: safeProviderId,
        amount: amount,
        currency: currency,
        platformFee: commission,
        providerAmount: providerAmount,
        paymentMethod: providerId,
        status: PAYMENT_STATUS.PENDING,
        // ✅ Plain object metadata - no Mongoose objects
        metadata: {
          bookingId: safeBookingId,
          entityType: booking.listing ? 'listing' : 'tour',
          entityTitle: entityTitle,
          numberOfPeople: booking.numberOfPeople || 1,
          ...metadata,
        },
      });

      // ─── 8. ✅ Ensure all metadata values are strings ──────────
      const safeMetadata = {
        bookingId: safeBookingId,
        paymentId: payment._id.toString(),
        userId: safeUserId,
        providerId: safeProviderId || '',
        entityType: booking.listing ? 'listing' : 'tour',
        entityTitle: entityTitle,
        numberOfPeople: String(booking.numberOfPeople || 1),
        ...Object.fromEntries(
          Object.entries(metadata).map(([key, value]) => [
            key,
            typeof value === 'object' ? JSON.stringify(value) : String(value)
          ])
        ),
      };

      // ─── 9. Create provider payment ────────────────────────────
      const providerData = {
        bookingId: safeBookingId,
        userId: safeUserId,
        paymentId: payment._id.toString(),
        amount: amount,
        currency: currency,
        description: `${entityTitle} - Booking #${booking.bookingCode}`,
        successUrl: successUrl || `${process.env.CLIENT_URL}/payment-success?payment_id=${payment._id}`,
        cancelUrl: cancelUrl || `${process.env.CLIENT_URL}/payment-cancel?payment_id=${payment._id}`,
        webhookUrl: `${process.env.API_URL}/api/payments/webhook/${providerId}`,
        customerEmail: booking.user?.email || '',
        userEmail: booking.user?.email || '',
        metadata: safeMetadata,
      };

      const providerResult = await provider.createPayment(providerData);

      // ─── 10. Update payment with provider data ─────────────────
      payment.providerReference = providerResult.paymentId;
      payment.providerData = providerResult.metadata || {};
      payment.status = providerResult.status || PAYMENT_STATUS.PENDING;
      
      if (providerResult.paymentUrl) {
        payment.paymentUrl = providerResult.paymentUrl;
      }

      await payment.save();

      // ─── 11. Update booking status ─────────────────────────────
      booking.paymentStatus = 'pending';
      booking.status = 'pending_payment';
      await booking.save();

      console.log(`✅ Payment created: ${payment._id} (Provider: ${providerId})`);

      return {
        success: true,
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          provider: providerId,
          paymentUrl: providerResult.paymentUrl,
          providerReference: providerResult.paymentId,
        },
        providerResult,
      };

    } catch (error) {
      console.error('❌ Payment creation error:', error.message);
      throw error;
    }
  }

  async verifyPayment(paymentId, providerId = null) {
    try {
      console.log(`🔍 Verifying payment: ${paymentId}`);

      const payment = await Payment.findById(paymentId)
        .populate('user', 'name email')
        .populate('booking');

      if (!payment) {
        throw new Error('Payment not found');
      }

      const provider = this.getProvider(providerId || payment.paymentMethod);
      
      const result = await provider.verifyPayment(
        payment.providerReference,
        { paymentId: payment._id }
      );

      if (result.status === PAYMENT_STATUS.SUCCEEDED || result.status === PAYMENT_STATUS.COMPLETED) {
        await this.handleSuccessfulPayment(payment, result);
      } else if (result.status === PAYMENT_STATUS.FAILED) {
        await this.handleFailedPayment(payment, result);
      } else {
        payment.status = result.status;
        // ✅ Store only safe data
        payment.providerData = {
          ...payment.providerData,
          verification: result.data ? JSON.stringify(result.data) : null,
        };
        await payment.save();
      }

      return {
        success: true,
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          provider: payment.paymentMethod,
        },
        verification: result,
      };

    } catch (error) {
      console.error('❌ Payment verification error:', error.message);
      throw error;
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const payment = await Payment.findById(paymentId)
        .select('status amount currency paymentMethod providerReference createdAt updatedAt');

      if (!payment) {
        throw new Error('Payment not found');
      }

      return {
        success: true,
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          provider: payment.paymentMethod,
          providerReference: payment.providerReference,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        },
      };

    } catch (error) {
      console.error('❌ Get payment status error:', error.message);
      throw error;
    }
  }

  async refundPayment(paymentId, amount = null, reason = '') {
    try {
      console.log(`💸 Processing refund for payment: ${paymentId}`);

      const payment = await Payment.findById(paymentId)
        .populate('booking', 'bookingCode status')
        .populate('user', 'name email');

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== PAYMENT_STATUS.SUCCEEDED && payment.status !== PAYMENT_STATUS.COMPLETED) {
        throw new Error(`Payment cannot be refunded. Current status: ${payment.status}`);
      }

      if (payment.refundId) {
        throw new Error('Payment already refunded');
      }

      const provider = this.getProvider(payment.paymentMethod);
      
      const refundAmount = amount || payment.amount;
      const result = await provider.refundPayment(
        payment.providerReference,
        refundAmount,
        reason,
        { 
          paymentId: payment._id.toString(),
          bookingId: payment.booking?._id?.toString() || '',
        }
      );

      if (result.success) {
        payment.status = refundAmount === payment.amount ? PAYMENT_STATUS.REFUNDED : PAYMENT_STATUS.PARTIALLY_REFUNDED;
        payment.refundId = result.refundId;
        payment.refundAmount = refundAmount;
        payment.refundedAt = new Date();
        await payment.save();

        const booking = payment.booking;
        if (booking) {
          booking.status = 'cancelled';
          booking.refundAmount = refundAmount;
          booking.refundedAt = new Date();
          booking.refundId = result.refundId;
          booking.cancellationReason = reason || 'Refund requested';
          await booking.save();
        }

        await createNotification({
          recipient: payment.user._id,
          sender: payment.provider,
          type: 'refund_processed',
          title: 'Refund Processed 💸',
          message: `Refund of ${formatCurrency(refundAmount, payment.currency)} processed for booking ${booking?.bookingCode || ''}`,
          data: { paymentId: payment._id, bookingId: booking?._id },
          link: `/my-payments/${payment._id}`,
        });

        console.log(`✅ Refund processed: ${payment._id} (${result.refundId})`);

        return {
          success: true,
          refund: {
            id: result.refundId,
            amount: refundAmount,
            status: payment.status,
            processedAt: payment.refundedAt,
          },
          payment: {
            id: payment._id,
            status: payment.status,
          },
        };
      }

      throw new Error('Refund failed');

    } catch (error) {
      console.error('❌ Refund error:', error.message);
      throw error;
    }
  }

  async handleWebhook(providerId, req) {
    try {
      console.log(`📥 Webhook received for provider: ${providerId}`);

      const provider = this.getProvider(providerId);
      const result = await provider.handleWebhook(req);

      if (result.success) {
        console.log(`✅ Webhook processed: ${providerId} - ${result.event}`);

        switch (result.event) {
          case WEBHOOK_EVENTS.PAYMENT_SUCCEEDED:
            await this.handleSuccessfulPaymentByProvider(result.data, providerId);
            break;
          case WEBHOOK_EVENTS.PAYMENT_FAILED:
            await this.handleFailedPaymentByProvider(result.data, providerId);
            break;
          case WEBHOOK_EVENTS.REFUND_SUCCEEDED:
            await this.handleRefundWebhook(result.data, providerId);
            break;
          default:
            console.log(`ℹ️ Unhandled webhook event: ${result.event}`);
        }

        return {
          success: true,
          event: result.event,
          handled: true,
        };
      }

      return result;

    } catch (error) {
      console.error('❌ Webhook handling error:', error.message);
      throw error;
    }
  }

  // ─── Internal Handlers ─────────────────────────────────────────

  async handleSuccessfulPayment(payment, verificationResult) {
    try {
      console.log(`✅ Processing successful payment: ${payment._id}`);

      payment.status = PAYMENT_STATUS.SUCCEEDED;
      payment.paidAt = new Date();
      // ✅ Store only safe data
      payment.providerData = {
        ...payment.providerData,
        verification: verificationResult.data ? JSON.stringify(verificationResult.data) : null,
      };
      if (verificationResult.transactionId) {
        payment.transactionId = verificationResult.transactionId;
      }
      await payment.save();

      const booking = await Booking.findById(payment.booking);
      if (booking) {
        booking.paymentStatus = 'paid';
        booking.status = 'paid';
        booking.paidAt = new Date();
        booking.paymentId = verificationResult.transactionId || payment.providerReference;
        await booking.save();

        const earning = await Earning.create({
          provider: booking.provider,
          booking: booking._id,
          payment: payment._id,
          amount: payment.amount,
          platformFee: payment.platformFee,
          netAmount: payment.providerAmount,
          bookingType: booking.listing ? 'listing' : 'tour',
          status: 'available',
          paymentId: verificationResult.transactionId || payment.providerReference,
        });

        await this.sendPaymentNotifications(payment, booking, earning);

        console.log(`✅ Payment completed: ${payment._id}, Earning: ${earning._id}`);
      }

    } catch (error) {
      console.error('❌ Handle successful payment error:', error.message);
      throw error;
    }
  }

  async handleSuccessfulPaymentByProvider(data, providerId) {
    try {
      const { paymentId } = data.metadata || {};
      if (!paymentId) {
        console.warn('⚠️ No paymentId in webhook data');
        return;
      }

      const payment = await Payment.findById(paymentId);
      if (!payment) {
        console.warn(`⚠️ Payment not found: ${paymentId}`);
        return;
      }

      if (payment.status === PAYMENT_STATUS.SUCCEEDED) {
        console.log(`ℹ️ Payment already processed: ${paymentId}`);
        return;
      }

      await this.handleSuccessfulPayment(payment, { data });
    } catch (error) {
      console.error('❌ Webhook payment success handler error:', error.message);
    }
  }

  async handleFailedPayment(payment, result) {
    try {
      payment.status = PAYMENT_STATUS.FAILED;
      payment.errorMessage = result.error || 'Payment failed';
      // ✅ Store only safe data
      payment.providerData = {
        ...payment.providerData,
        failure: result.data ? JSON.stringify(result.data) : null,
      };
      await payment.save();

      const booking = await Booking.findById(payment.booking);
      if (booking) {
        booking.status = 'failed_payment';
        booking.adminNotes = `Payment failed: ${payment.errorMessage}`;
        await booking.save();
      }

      console.log(`❌ Payment failed: ${payment._id} - ${payment.errorMessage}`);

    } catch (error) {
      console.error('❌ Handle failed payment error:', error.message);
    }
  }

  async handleFailedPaymentByProvider(data, providerId) {
    try {
      const { paymentId } = data.metadata || {};
      if (!paymentId) return;

      const payment = await Payment.findById(paymentId);
      if (!payment) return;

      if (payment.status === PAYMENT_STATUS.FAILED) return;

      await this.handleFailedPayment(payment, { data });
    } catch (error) {
      console.error('❌ Webhook payment failure handler error:', error.message);
    }
  }

  async handleRefundWebhook(data, providerId) {
    try {
      const { paymentId } = data.metadata || {};
      if (!paymentId) return;

      const payment = await Payment.findById(paymentId);
      if (!payment) return;

      if (payment.status === PAYMENT_STATUS.REFUNDED) return;

      payment.status = PAYMENT_STATUS.REFUNDED;
      payment.refundId = data.refundId;
      payment.refundAmount = data.amount || payment.amount;
      payment.refundedAt = new Date();
      await payment.save();

      console.log(`✅ Refund processed via webhook: ${payment._id}`);

    } catch (error) {
      console.error('❌ Webhook refund handler error:', error.message);
    }
  }

  async sendPaymentNotifications(payment, booking, earning) {
    try {
      const entity = booking.listing || booking.tour;
      const entityTitle = entity?.title || 'Experience';

      await createNotification({
        recipient: booking.user,
        sender: booking.provider,
        type: 'payment_success',
        title: 'Payment Successful ✅',
        message: `Your payment of ${formatCurrency(payment.amount, payment.currency)} for "${entityTitle}" was successful!`,
        data: { 
          bookingId: booking._id.toString(),
          paymentId: payment._id.toString(),
          earningId: earning?._id?.toString() || null,
        },
        link: `/my-bookings/${booking._id}`,
      });

      await createNotification({
        recipient: booking.provider,
        sender: booking.user,
        type: 'payment_received',
        title: 'Payment Received 💰',
        message: `You received ${formatCurrency(payment.providerAmount, payment.currency)} for "${entityTitle}"`,
        data: { 
          bookingId: booking._id.toString(),
          paymentId: payment._id.toString(),
          earningId: earning?._id?.toString() || null,
          commission: payment.platformFee,
        },
        link: `/provider/earnings`,
      });

      console.log(`📧 Payment notifications sent for booking: ${booking._id}`);
    } catch (error) {
      console.error('❌ Send payment notifications error:', error.message);
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;