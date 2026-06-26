// src/pages/Payment.jsx

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  CreditCard,
  Smartphone,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowLeft,
} from 'lucide-react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state;

  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    names: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Prevent direct access
  if (!bookingData) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <Card className="p-8 rounded-3xl text-center border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-4">
            No Booking Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Please complete your booking first.
          </p>
          <Button
            onClick={() => navigate('/booking')}
            className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B]"
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const {
    destination,
    bookingType,
    formData,
    total,
  } = bookingData;

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      console.log({
        bookingData,
        paymentMethod,
        paymentData,
      });

      navigate('/confirmation', {
        state: {
          bookingData,
          paymentMethod,
        },
      });
      setLoading(false);
    }, 1500);
  };

  // Payment methods with AI Tour colors
  const paymentMethods = [
    {
      id: 'mobile',
      icon: Smartphone,
      label: 'Mobile Money',
      color: '#F59E0B',
      borderColor: 'border-[#F59E0B]',
      bgColor: 'bg-[#F59E0B]/10',
    },
    {
      id: 'card',
      icon: CreditCard,
      label: 'Visa Card',
      color: '#0D9488',
      borderColor: 'border-[#0D9488]',
      bgColor: 'bg-[#0D9488]/10',
    },
    {
      id: 'paypal',
      icon: Wallet,
      label: 'PayPal',
      color: '#374151',
      borderColor: 'border-[#374151]',
      bgColor: 'bg-[#374151]/10',
    },
    {
      id: 'secure',
      icon: ShieldCheck,
      label: 'Secure Pay',
      color: '#0D9488',
      borderColor: 'border-[#0D9488]',
      bgColor: 'bg-[#0D9488]/10',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-[#0D9488] transition mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          {/* HEADER - Updated with AI Tour colors */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#374151] dark:text-white">
                  Payment
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Complete your booking securely.
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT METHODS - Updated with AI Tour colors */}
          <Card className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-[#374151] dark:text-white">
              Choose Payment Method
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isActive = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                      isActive
                        ? `${method.borderColor} ${method.bgColor} scale-[1.02] shadow-md`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Icon
                        className="w-8 h-8 mb-2"
                        style={{ color: isActive ? method.color : '#94a3b8' }}
                      />
                      <span className={`font-medium text-sm ${isActive ? 'text-[#374151] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {method.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* PAYMENT FORM - Updated with AI Tour colors */}
          <Card className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-[#374151] dark:text-white">
              Payment Details
            </h2>

            <form onSubmit={handlePayment} className="space-y-5">
              <div>
                <label className="block mb-2 font-medium text-[#374151] dark:text-white">
                  Full Names *
                </label>
                <Input
                  placeholder="Enter your names"
                  value={paymentData.names}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      names: e.target.value,
                    })
                  }
                  className="focus:ring-[#0D9488]"
                  required
                />
              </div>

              {paymentMethod === 'mobile' && (
                <div>
                  <label className="block mb-2 font-medium text-[#374151] dark:text-white">
                    Mobile Number *
                  </label>
                  <Input
                    placeholder="+250 7XX XXX XXX"
                    value={paymentData.phone}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        phone: e.target.value,
                      })
                    }
                    className="focus:ring-[#0D9488]"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    You will receive a payment confirmation SMS
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block mb-2 font-medium text-[#374151] dark:text-white">
                      Card Number *
                    </label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          cardNumber: e.target.value,
                        })
                      }
                      className="focus:ring-[#0D9488]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-medium text-[#374151] dark:text-white">
                        Expiry *
                      </label>
                      <Input
                        placeholder="MM/YY"
                        value={paymentData.expiry}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            expiry: e.target.value,
                          })
                        }
                        className="focus:ring-[#0D9488]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-[#374151] dark:text-white">
                        CVV *
                      </label>
                      <Input
                        placeholder="123"
                        type="password"
                        maxLength="4"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            cvv: e.target.value,
                          })
                        }
                        className="focus:ring-[#0D9488]"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-5 rounded-2xl bg-[#374151]/10 dark:bg-gray-800 border border-[#374151]/20">
                  <p className="text-[#374151] dark:text-white text-sm">
                    You will be redirected to PayPal after clicking Pay Now.
                  </p>
                </div>
              )}

              {paymentMethod === 'secure' && (
                <div className="p-5 rounded-2xl bg-[#0D9488]/10 dark:bg-[#0D9488]/20 border border-[#0D9488]/20">
                  <p className="text-[#0D9488] dark:text-[#0D9488] text-sm flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Your payment is fully encrypted and secure.
                  </p>
                </div>
              )}

              {/* Payment Button - Updated with AI Tour colors */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl text-lg bg-gradient-to-r from-[#0D9488] to-[#F59E0B] shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Pay ${total}
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-gray-400">
                🔒 Your payment information is secure and encrypted
              </p>
            </form>
          </Card>
        </div>

        {/* RIGHT SIDEBAR - Updated with AI Tour colors */}
        <div>
          <Card className="p-6 rounded-3xl sticky top-24 border border-gray-100 dark:border-gray-800 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-[#374151] dark:text-white">
              Booking Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Destination</span>
                <span className="font-semibold text-[#374151] dark:text-white">
                  {destination?.name || 'Rwanda'}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Booking Type</span>
                <span className="font-semibold capitalize text-[#374151] dark:text-white">
                  {bookingType}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Travelers</span>
                <span className="font-semibold text-[#374151] dark:text-white">
                  {formData.travelers}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Class</span>
                <span className="font-semibold capitalize text-[#374151] dark:text-white">
                  {formData.class}
                </span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-[#374151] dark:text-white">
                  Total
                </span>
                <span className="text-3xl font-bold text-[#0D9488]">
                  ${total}
                </span>
              </div>
            </div>

            {/* Trust Badge - Updated with AI Tour colors */}
            <div className="mt-6 p-4 rounded-2xl bg-[#0D9488]/10 dark:bg-[#0D9488]/20 border border-[#0D9488]/20 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#0D9488] flex-shrink-0" />
              <p className="text-sm text-[#0D9488] dark:text-[#0D9488]">
                Your payment is protected and encrypted.
              </p>
            </div>

            {/* Payment Methods Accepted */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 text-center">
                We accept all major payment methods
              </p>
              <div className="flex justify-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">💳 Visa</span>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">💳 Mastercard</span>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">📱 MoMo</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;