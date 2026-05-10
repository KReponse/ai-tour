// src/pages/Booking.jsx - Add Hotel import
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, CreditCard, Plane, Hotel, Car, AlertCircle } from 'lucide-react'; // Added Hotel
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// Rest of the code remains the same...

const Booking = () => {
  const [bookingType, setBookingType] = useState('flight');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    travelers: 1,
    class: 'economy'
  });

  const bookingOptions = [
    { id: 'flight', icon: Plane, label: 'Flights' },
    { id: 'hotel', icon: Hotel, label: 'Hotels' },
    { id: 'car', icon: Car, label: 'Car Rental' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking logic
    console.log('Booking submitted:', formData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Your Trip</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find the best deals on flights, hotels, and car rentals
        </p>
      </div>

      {/* Booking Type Selector */}
      <div className="flex justify-center gap-4">
        {bookingOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setBookingType(option.id)}
            className={`flex items-center px-6 py-3 rounded-xl transition-all ${
              bookingType === option.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <option.icon className="w-5 h-5 mr-2" />
            {option.label}
          </button>
        ))}
      </div>

      {/* Booking Form */}
      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {bookingType === 'flight' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <Input
                    placeholder="Departure city"
                    value={formData.from}
                    onChange={(e) => setFormData({...formData, from: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <Input
                    placeholder="Arrival city"
                    value={formData.to}
                    onChange={(e) => setFormData({...formData, to: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Departure Date</label>
                  <Input
                    type="date"
                    value={formData.departDate}
                    onChange={(e) => setFormData({...formData, departDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Return Date</label>
                  <Input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Travelers</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, travelers: Math.max(1, formData.travelers - 1)})}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{formData.travelers}</span>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, travelers: formData.travelers + 1})}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Class</label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Search Flights
          </Button>
        </form>
      </Card>

      {/* Request Trip Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Can't find what you're looking for?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Request a custom trip package tailored to your needs
            </p>
          </div>
          <Link to="/request-trip">
            <Button variant="primary">
              Request a Trip
            </Button>
          </Link>
        </div>
      </Card>

      {/* Payment Options Preview */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Secure Payment Options</h2>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
            <CreditCard className="w-5 h-5" />
            <span>Credit Card</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>PayPal</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;