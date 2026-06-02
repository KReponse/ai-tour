import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-50
      dark:bg-gray-950
      p-4
    ">

      <div className="
        bg-white
        dark:bg-gray-900
        rounded-3xl
        shadow-xl
        p-10
        text-center
        max-w-md
        w-full
      ">

        <CheckCircle
          className="
            w-20
            h-20
            text-green-500
            mx-auto
            mb-6
          "
        />

        <h1 className="
          text-3xl
          font-bold
          mb-4
          dark:text-white
        ">
          Payment Successful
        </h1>

        <p className="
          text-gray-600
          dark:text-gray-300
          mb-8
        ">
          Your booking has been confirmed successfully.
        </p>

        <Link
          to="/my-bookings"
          className="
            inline-flex
            items-center
            justify-center
            h-12
            px-6
            rounded-2xl
            bg-blue-600
            text-white
            font-semibold
          "
        >
          View My Bookings
        </Link>

      </div>

    </div>

  );

};

export default PaymentSuccess;