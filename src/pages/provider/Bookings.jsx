import React from 'react';

const Bookings = () => {

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Bookings
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage confirmed trips and bookings
        </p>

      </div>

      {/* BOOKINGS LIST */}
      <div className="grid gap-5">

        {[1,2,3].map((item) => (

          <div
            key={item}
            className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-3xl
              p-6
              shadow-sm
            "
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              {/* LEFT */}
              <div className="space-y-3">

                <div>

                  <h2 className="text-xl font-bold dark:text-white">
                    Gorilla Trekking Adventure
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Booked by John Doe
                  </p>

                </div>

                <div className="grid sm:grid-cols-3 gap-4">

                  <div>

                    <p className="text-sm text-gray-500">
                      Travelers
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      4 People
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Booking Date
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      18 Oct 2026
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>

                    <h3 className="font-semibold text-green-600">
                      $2,400
                    </h3>

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex gap-3">

                <button
                  className="
                    px-5
                    h-11
                    rounded-2xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-semibold
                    transition
                  "
                >
                  View Details
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Bookings;