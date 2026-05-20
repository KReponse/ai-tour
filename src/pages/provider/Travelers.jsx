import React from 'react';

const Travelers = () => {

  const travelers = [
    {
      id: 1,
      name: 'John Doe',
      country: 'USA',
      trip: 'Volcanoes Tour',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      country: 'Canada',
      trip: 'Akagera Safari',
      status: 'Completed',
    },
    {
      id: 3,
      name: 'Ali Hassan',
      country: 'UAE',
      trip: 'Kigali City Tour',
      status: 'Pending',
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Travelers
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage travelers and booking participants
        </p>

      </div>

      {/* TRAVELERS */}
      <div className="grid gap-5">

        {travelers.map((traveler) => (

          <div
            key={traveler.id}
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
              <div className="flex items-center gap-4">

                <div className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                  text-white
                  flex
                  items-center
                  justify-center
                  text-2xl
                  font-black
                ">
                  {traveler.name.charAt(0)}
                </div>

                <div>

                  <h2 className="text-xl font-bold dark:text-white">
                    {traveler.name}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {traveler.country}
                  </p>

                </div>

              </div>

              {/* CENTER */}
              <div>

                <p className="text-sm text-gray-500">
                  Trip
                </p>

                <h3 className="font-semibold dark:text-white">
                  {traveler.trip}
                </h3>

              </div>

              {/* STATUS */}
              <div>

                <span
                  className={`
                    px-4
                    py-2
                    rounded-xl
                    text-sm
                    font-semibold
                    ${
                      traveler.status === 'Active'
                        ? 'bg-green-100 text-green-600'
                        : traveler.status === 'Completed'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  `}
                >
                  {traveler.status}
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Travelers;