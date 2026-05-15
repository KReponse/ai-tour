// src/pages/Booking.jsx

import React, { useState } from 'react';


import {
  Plane,
  Hotel,
  Car,
  Users,
  CreditCard,
  ShieldCheck,
  Sparkles,
  MapPin,
  Star,
  Smartphone,
  Wallet,
  BadgeDollarSign,
} from 'lucide-react';

import Card, {
  CardContent,
  CardImage,
} from '../components/ui/Card';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

import { rwandaDestinations as destinations } from '../data/destinations';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../contexts/BookingContext';

const Booking = () => {
  const { id } = useParams();
  const {
  bookingData,
  updateBooking,
  updateFormData,
} = useBooking();

  const destination = destinations.find(
    (item) => item.id === parseInt(id)
  );

  const [bookingType, setBookingType] =
    useState('flight');

  const formData = bookingData.formData;
  React.useEffect(() => {

  if (
    destination &&
    !bookingData.formData.to
  ) {
    updateFormData({
      to: destination.name,
    });
  }

}, [destination]);

  // Booking options
  const bookingOptions = [
    {
      id: 'flight',
      icon: Plane,
      label: 'Flights',
    },
    {
      id: 'hotel',
      icon: Hotel,
      label: 'Hotels',
    },
    {
      id: 'car',
      icon: Car,
      label: 'Car Rental',
    },
  ];

  // Payment methods
  const paymentMethods = [
    {
      icon: Smartphone,
      name: 'MTN MoMo',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      icon: Smartphone,
      name: 'Airtel Money',
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      icon: CreditCard,
      name: 'Visa',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: Wallet,
      name: 'PayPal',
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      icon: BadgeDollarSign,
      name: 'Apple Pay',
      color: 'text-gray-700',
      bg: 'bg-gray-100',
    },
  ];

  // Pricing
  const basePrice = destination?.price || 899;

  const travelersCost =
    basePrice * formData.travelers;

  const taxes = Math.round(
    travelersCost * 0.12
  );

  const serviceFee = 45;

  const total =
    travelersCost + taxes + serviceFee;

  const navigate = useNavigate();

const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  setSubmitting(true);

  await new Promise((resolve) =>
    setTimeout(resolve, 1500)
  );

  navigate('/payment', {
    state: {
      destination,
      bookingType,
      formData,
      total,
    },
  });

  setSubmitting(false);
};
if (!destination) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">

      <div className="max-w-md">

        <h1 className="text-4xl font-bold mb-4 dark:text-white">
          No Destination Selected
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Please choose a destination before making a booking.
        </p>

        <Link to="/explore">
          <Button>
            Explore Destinations
          </Button>
        </Link>

      </div>

    </div>
  );
}


  return (
    <div className="max-w-7xl mx-auto px-3 md:px-5 space-y-8 pb-32 md:pb-10 animate-fade-in">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 md:p-12 text-white">

        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10">

          {/* Steps */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {[
              'Search',
              'Details',
              'Payment',
              'Confirmation',
            ].map((step, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  index === 0
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white'
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Book Your Dream Trip
          </h1>

          <p className="text-white/90 text-lg max-w-2xl">
            Secure your flights,
            hotels, and transportation
            in just a few steps.
          </p>
        </div>
      </section>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          {/* DESTINATION */}
          {destination && (
            <Card className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800">

              <div className="grid md:grid-cols-2">

                <CardImage
                  src={destination.image}
                  alt={destination.name}
                  className="h-64 md:h-full object-cover"
                />

                <CardContent className="p-6 flex flex-col justify-center">

                  <div className="flex items-center gap-2 mb-3">

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                      Popular Destination
                    </span>

                    <div className="flex items-center text-sm font-semibold">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {destination.rating}
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold mb-3 dark:text-white">
                    {destination.name}
                  </h2>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    Rwanda
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm text-gray-500">
                        Starting from
                      </p>

                      <div className="text-3xl font-bold text-blue-600">
                        ${destination.price}
                      </div>
                    </div>

                    <Link
                      to={`/destination/${destination.id}`}
                    >
                      <Button variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          )}

          {/* BOOKING TYPE */}
          <div className="flex flex-wrap gap-4">

            {bookingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  setBookingType(option.id)
                }
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all duration-300 font-medium ${
                  bookingType === option.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <option.icon className="w-5 h-5" />
                {option.label}
              </button>
            ))}
          </div>

          {/* FORM */}
          <Card className="p-6 md:p-8 rounded-3xl">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Flight Form */}
              {bookingType === 'flight' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        From
                      </label>

                      <Input
                        placeholder="Departure city"
                        value={formData.from}
                       onChange={(e) =>
  updateFormData({
    from: e.target.value,
  })
}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        To
                      </label>

                      <Input
  placeholder="Destination"
  value={formData.to}
  onChange={(e) =>
    updateFormData({
      to: e.target.value,
    })
  }
  required
/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Departure Date
                      </label>

                      <Input
                        type="date"
                        value={formData.departDate}
                        onChange={(e) =>
  updateFormData({
    departDate: e.target.value,
  })
}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Return Date
                      </label>

                      <Input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) =>
  updateFormData({
    returnDate: e.target.value,
  })
}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Travelers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium mb-3 dark:text-white">
                    Travelers
                  </label>

                  <div className="flex items-center gap-4">

                    <button
                      type="button"
                     onClick={() =>
  updateFormData({
    travelers: Math.max(
      1,
      formData.travelers - 1
    ),
  })
}
                      className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800"
                    >
                      -
                    </button>

                    <div className="flex items-center gap-2 text-lg font-bold dark:text-white">
                      <Users className="w-5 h-5" />
                      {formData.travelers}
                    </div>

                    <button
                      type="button"
                       onClick={() =>
  updateFormData({
    travelers:
      formData.travelers + 1,
  })
}

                      className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    Travel Class
                  </label>

                  <select
                    value={formData.class}
                    onChange={(e) =>
  updateFormData({
    class: e.target.value,
  })
}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white outline-none"
                  >
                    <option value="economy">
                      Economy
                    </option>

                    <option value="business">
                      Business
                    </option>

                    <option value="first">
                      First Class
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  <div>
    <label className="block text-sm font-medium mb-2 dark:text-white">
      Full Name
    </label>

    <Input
      placeholder="Your full name"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-2 dark:text-white">
      Email Address
    </label>

    <Input
      type="email"
      placeholder="example@gmail.com"
    />
  </div>

</div>

              {/* AI TIP */}
              <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-5 border border-blue-100 dark:border-gray-700">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-1 dark:text-white">
                      AI Recommendation
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      AI recommends booking your
                      trip during July–September
                      for the best experience.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50">
  <p className="text-sm font-semibold dark:text-white">
    Recommended Package:
  </p>

  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
    3 Days Luxury Rwanda Experience
    including airport pickup,
    premium hotel, safari tour,
    and cultural activities.
  </p>
</div>

              {/* BUTTON */}
              <Button
  type="submit"
  disabled={submitting}
  className="w-full h-14 rounded-2xl text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-[1.02] transition-all duration-300"
>
  {submitting
    ? 'Preparing Your Booking...'
    : 'Continue Booking'}
</Button>
            </form>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:sticky lg:top-24 h-fit">

          <Card className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">

            {/* SUMMARY */}
            <div>

              <h2 className="text-2xl font-bold mb-5 dark:text-white">
                Booking Summary
              </h2>

             <div className="space-y-4">

  <div className="flex justify-between text-sm">
    <span className="text-gray-500">
      Destination
    </span>

    <span className="font-semibold dark:text-white">
      {formData.to || 'Not selected'}
    </span>
  </div>

  <div className="flex justify-between text-sm">
    <span className="text-gray-500">
      Booking Type
    </span>

    <span className="font-semibold capitalize dark:text-white">
      {bookingType}
    </span>
  </div>

  <div className="flex justify-between text-sm">
    <span className="text-gray-500">
      Travelers
    </span>

    <span className="font-semibold dark:text-white">
      {formData.travelers}
    </span>
  </div>

  <div className="flex justify-between text-sm">
    <span className="text-gray-500">
      Travel Class
    </span>

    <span className="font-semibold capitalize dark:text-white">
      {formData.class}
    </span>
  </div>

  <div className="flex justify-between text-sm">
    <span className="text-gray-500">
      Departure
    </span>

    <span className="font-semibold dark:text-white">
      {formData.departDate || '--'}
    </span>
  </div>

  <div className="flex justify-between text-sm">
    <span className="text-gray-500">
      Return
    </span>

    <span className="font-semibold dark:text-white">
      {formData.returnDate || '--'}
    </span>
  </div>

  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">

    <div className="flex justify-between text-sm">
      <span className="text-gray-500">
        Base Price
      </span>

      <span className="font-semibold dark:text-white">
        ${basePrice}
      </span>
    </div>

    <div className="flex justify-between text-sm">
      <span className="text-gray-500">
        Taxes
      </span>

      <span className="font-semibold dark:text-white">
        ${taxes}
      </span>
    </div>

    <div className="flex justify-between text-sm">
      <span className="text-gray-500">
        Service Fee
      </span>

      <span className="font-semibold dark:text-white">
        ${serviceFee}
      </span>
    </div>

  </div>

  <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">

    <span className="text-lg font-bold dark:text-white">
      Total
    </span>

    <span className="text-3xl font-bold text-blue-600">
      ${total}
    </span>
  </div>
</div> 
            </div>

            {/* TRUST */}
            <div className="space-y-3">

              {[
                'Secure Payment',
                'Free Cancellation',
                '24/7 Support',
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800"
                >
                  <ShieldCheck className="w-5 h-5 text-green-600" />

                  <span className="text-sm font-medium dark:text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* PAYMENT */}
            <div>

              <h3 className="font-bold mb-4 dark:text-white">
                Secure Payment Methods
              </h3>

              <div className="grid grid-cols-2 gap-4">

                {paymentMethods.map(
                  (method, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${method.bg} flex items-center justify-center mb-2`}
                      >
                        <method.icon
                          className={`w-6 h-6 ${method.color}`}
                        />
                      </div>

                      <span className="text-sm font-medium dark:text-white text-center">
                        {method.name}
                      </span>
                    </div>
                  )
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                All transactions are encrypted
                and secure.
              </p>
            </div>

            {/* CUSTOM TRIP */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-5">

              <h3 className="font-bold mb-2 dark:text-white">
                Need a Custom Trip?
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Let AI Tour create a personalized
                experience just for you.
              </p>

              <Link to="/request-trip">
                <Button
                  variant="outline"
                  className="w-full"
                >
                  Request Custom Trip
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-50 shadow-2xl">

        <div className="flex items-center gap-4">

          <div>
            <p className="text-xs text-gray-500">
              Total Price
            </p>

            <p className="text-2xl font-bold text-blue-600">
              ${total}
            </p>
          </div>

          <Button className="flex-1 h-12 rounded-2xl">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Booking;