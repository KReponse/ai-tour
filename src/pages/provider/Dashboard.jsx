import {
  Users,
  CalendarCheck,
  Wallet,
  Clock3,
  ArrowUpRight,
} from 'lucide-react';

import {
  providerStats,
  recentRequests,
} from '../../data/providerData';

const Dashboard = () => {

  const iconMap = {
    'Total Bookings': CalendarCheck,
    'Pending Requests': Clock3,
    Travelers: Users,
    Revenue: Wallet,
  };

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Provider Dashboard
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back to AI Tour Rwanda
          </p>

        </div>

        <button
          className="
            h-12
            px-6
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-purple-600
            text-white
            font-semibold
            shadow-lg
            hover:scale-105
            transition-all
          "
        >
          Create New Trip
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {providerStats.map((item, index) => {

          const Icon =
            iconMap[item.title];

          const colors = [
            'from-blue-500 to-cyan-500',
            'from-yellow-500 to-orange-500',
            'from-purple-500 to-pink-500',
            'from-green-500 to-emerald-500',
          ];

          return (

            <div
              key={index}
              className="
                bg-white
                dark:bg-gray-900
                border
                border-gray-200
                dark:border-gray-800
                rounded-3xl
                p-6
                shadow-sm
                hover:shadow-xl
                transition-all
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`
                    w-14
                    h-14
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    text-white
                    bg-gradient-to-r
                    ${colors[index]}
                  `}
                >

                  <Icon className="w-7 h-7" />

                </div>

              </div>

              <div className="mt-6 flex items-center gap-2 text-green-600 text-sm font-medium">

                <ArrowUpRight className="w-4 h-4" />

                <span>
                  {item.growth} this month
                </span>

              </div>

            </div>

          );

        })}

      </div>

      {/* RECENT REQUESTS */}
      <div
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

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Recent Requests
          </h2>

          <button className="text-blue-600 font-semibold hover:underline">
            View All
          </button>

        </div>

        <div className="space-y-4">

          {recentRequests.map((item) => (

            <div
              key={item.id}
              className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
                p-4
                rounded-2xl
                bg-gray-50
                dark:bg-gray-800
              "
            >

              <div>

                <h3 className="font-bold text-gray-900 dark:text-white">
                  {item.destination}
                </h3>

                <p className="text-sm text-gray-500">
                  Requested by {item.traveler}
                </p>

              </div>

              <div className="flex items-center gap-3">

                <button
                  className="
                    px-4
                    h-10
                    rounded-xl
                    bg-green-500
                    hover:bg-green-600
                    text-white
                    font-semibold
                    transition
                  "
                >
                  Accept
                </button>

                <button
                  className="
                    px-4
                    h-10
                    rounded-xl
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    font-semibold
                    transition
                  "
                >
                  Decline
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
};

export default Dashboard;