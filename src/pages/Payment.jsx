// src/pages/Payment.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Calendar as CalendarIcon, User, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      navigate('/trips');
    }, 2000);
  };

  const tripSummary = {
    destination: 'Paris, France',
    dates: 'March 15 - March 20, 2024',
    travelers: 2,
    total: 1798,
    discount: 100,
    finalTotal: 1698
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Payment</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Secure payment for your dream vacation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm">Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm">PayPal</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="1234 5678 9012 3456"
                        className="pl-10"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="John Doe"
                        className="pl-10"
                        value={formData.cardName}
                        onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          placeholder="MM/YY"
                          className="pl-10"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <Input
                        type="password"
                        placeholder="123"
                        maxLength="3"
                        value={formData.cvv}
                        onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="primary" className="w-full" disabled={processing}>
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pay ${tripSummary.finalTotal}
                      </>
                    )}
                  </Button>
                </form>
              )}

              {paymentMethod === 'paypal' && (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <p className="mb-4">You will be redirected to PayPal to complete your payment</p>
                  <Button variant="primary" onClick={() => setProcessing(true)}>
                    Proceed to PayPal
                  </Button>
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{tripSummary.destination}</span>
                  <span className="font-semibold">${tripSummary.total}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {tripSummary.dates}
                </div>
                <div className="text-sm text-gray-500">
                  {tripSummary.travelers} travelers
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${tripSummary.total}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${tripSummary.discount}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>${tripSummary.finalTotal}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Free cancellation up to 30 days before travel</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;