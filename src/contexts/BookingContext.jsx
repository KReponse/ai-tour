// src/context/BookingContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

// Create Context
const BookingContext = createContext();

// Provider
export const BookingProvider = ({
  children,
}) => {

  // Initial State
  const [bookingData, setBookingData] =
    useState(() => {

      // Load from localStorage
      const savedBooking =
        localStorage.getItem(
          'ai-tour-booking'
        );

      return savedBooking
        ? JSON.parse(savedBooking)
        : {
            destination: null,
            bookingType: 'flight',

            formData: {
              from: '',
              to: '',
              departDate: '',
              returnDate: '',
              travelers: 1,
              class: 'economy',
            },

            total: 0,

            paymentMethod: '',

            paymentData: {
              names: '',
              phone: '',
              cardNumber: '',
              expiry: '',
              cvv: '',
            },
          };
    });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      'ai-tour-booking',
      JSON.stringify(bookingData)
    );
  }, [bookingData]);

  // Update Entire Booking
  const updateBooking = (data) => {
    setBookingData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Update Form Data
  const updateFormData = (data) => {
    setBookingData((prev) => ({
      ...prev,

      formData: {
        ...prev.formData,
        ...data,
      },
    }));
  };

  // Update Payment Data
  const updatePaymentData = (data) => {
    setBookingData((prev) => ({
      ...prev,

      paymentData: {
        ...prev.paymentData,
        ...data,
      },
    }));
  };

  // Reset Booking
  const resetBooking = () => {

    const emptyBooking = {
      destination: null,
      bookingType: 'flight',

      formData: {
        from: '',
        to: '',
        departDate: '',
        returnDate: '',
        travelers: 1,
        class: 'economy',
      },

      total: 0,

      paymentMethod: '',

      paymentData: {
        names: '',
        phone: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
      },
    };

    setBookingData(emptyBooking);

    localStorage.removeItem(
      'ai-tour-booking'
    );
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,

        setBookingData,

        updateBooking,

        updateFormData,

        updatePaymentData,

        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Custom Hook
export const useBooking = () => {
  return useContext(BookingContext);
};