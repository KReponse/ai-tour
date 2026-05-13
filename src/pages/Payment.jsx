// src/pages/Payment.jsx

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  CreditCard,
  Smartphone,
  Wallet,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data from Booking page
  const bookingData = location.state;

  const [paymentMethod, setPaymentMethod] =
    useState('mobile');

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
        <Card className="p-8 rounded-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            No Booking Found
          </h2>

          <p className="text-gray-500 mb-6">
            Please complete your booking first.
          </p>

          <Button
            onClick={() => navigate('/booking')}
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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          {/* HEADER */}
          <div>
            <h1 className="text-4xl font-bold mb-3 dark:text-white">
              Payment
            </h1>

            <p className="text-gray-500 dark:text-gray-400">
              Complete your booking securely.
            </p>
          </div>

          {/* PAYMENT METHODS */}
          <Card className="p-6 rounded-3xl">

            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Choose Payment Method
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {/* Mobile Money */}
              <button
                onClick={() =>
                  setPaymentMethod('mobile')
                }
                className={`p-5 rounded-2xl border transition-all ${
                  paymentMethod === 'mobile'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Smartphone className="w-8 h-8 text-yellow-500 mb-2" />

                  <span className="font-medium dark:text-white">
                    Mobile Money
                  </span>
                </div>
              </button>

              {/* Card */}
              <button
                onClick={() =>
                  setPaymentMethod('card')
                }
                className={`p-5 rounded-2xl border transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex flex-col items-center">
                  <CreditCard className="w-8 h-8 text-blue-500 mb-2" />

                  <span className="font-medium dark:text-white">
                    Visa Card
                  </span>
                </div>
              </button>

              {/* PayPal */}
              <button
                onClick={() =>
                  setPaymentMethod('paypal')
                }
                className={`p-5 rounded-2xl border transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Wallet className="w-8 h-8 text-indigo-500 mb-2" />

                  <span className="font-medium dark:text-white">
                    PayPal
                  </span>
                </div>
              </button>

              {/* Secure */}
              <button
                onClick={() =>
                  setPaymentMethod('secure')
                }
                className={`p-5 rounded-2xl border transition-all ${
                  paymentMethod === 'secure'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />

                  <span className="font-medium dark:text-white">
                    Secure Pay
                  </span>
                </div>
              </button>
            </div>
          </Card>

          {/* PAYMENT FORM */}
          <Card className="p-6 rounded-3xl">

            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Payment Details
            </h2>

            <form
              onSubmit={handlePayment}
              className="space-y-5"
            >

              <div>
                <label className="block mb-2 font-medium dark:text-white">
                  Full Names
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
                  required
                />
              </div>

              {paymentMethod === 'mobile' && (
                <div>
                  <label className="block mb-2 font-medium dark:text-white">
                    Mobile Number
                  </label>

                  <Input
                    placeholder="+250 7..."
                    value={paymentData.phone}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block mb-2 font-medium dark:text-white">
                      Card Number
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
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <label className="block mb-2 font-medium dark:text-white">
                        Expiry
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
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium dark:text-white">
                        CVV
                      </label>

                      <Input
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            cvv: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-gray-800">
                  <p className="dark:text-white">
                    You will be redirected to
                    PayPal after clicking Pay Now.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl text-lg"
              >
                Pay ${total}
              </Button>
            </form>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div>

          <Card className="p-6 rounded-3xl sticky top-24">

            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Booking Summary
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Destination
                </span>

                <span className="font-semibold dark:text-white">
                  {destination?.name || 'Rwanda'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Booking Type
                </span>

                <span className="font-semibold capitalize dark:text-white">
                  {bookingType}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Travelers
                </span>

                <span className="font-semibold dark:text-white">
                  {formData.travelers}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Class
                </span>

                <span className="font-semibold dark:text-white">
                  {formData.class}
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-xl font-bold dark:text-white">
                  Total
                </span>

                <span className="text-3xl font-bold text-blue-600">
                  ${total}
                </span>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-green-50 dark:bg-gray-800 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />

              <p className="text-sm dark:text-white">
                Your payment is protected and encrypted.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;