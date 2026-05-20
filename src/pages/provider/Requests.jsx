import React from 'react';

const Requests = () => {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Trip Requests
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage incoming traveler requests
        </p>
      </div>

      {/* REQUEST CARDS */}
      <div className="grid gap-5">

        {/* CARD */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* LEFT */}
            <div className="space-y-3">

              <div className="flex items-center gap-3">

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-black text-xl">
                  R
                </div>

                <div>
                  <h2 className="font-bold text-lg dark:text-white">
                    Reponse Dev
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Kigali, Rwanda
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Destination
                  </p>

                  <h3 className="font-semibold dark:text-white">
                    Volcanoes National Park
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Travelers
                  </p>

                  <h3 className="font-semibold dark:text-white">
                    2 People
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Budget
                  </p>

                  <h3 className="font-semibold text-green-600">
                    $1,200
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Date
                  </p>

                  <h3 className="font-semibold dark:text-white">
                    12 Oct 2026
                  </h3>
                </div>

              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col sm:flex-row gap-3">

              <button className="px-6 h-12 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold transition">
                Accept
              </button>

              <button className="px-6 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition">
                Reject
              </button>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Requests;