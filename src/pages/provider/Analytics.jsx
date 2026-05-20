import React from 'react';

import {
  TrendingUp,
  Wallet,
  Users,
  CalendarCheck,
} from 'lucide-react';

const Analytics = () => {

  const analyticsCards = [
    {
      title: 'Monthly Revenue',
      value: '$12,400',
      icon: Wallet,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Bookings',
      value: '184',
      icon: CalendarCheck,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Travelers',
      value: '326',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Growth',
      value: '+24%',
      icon: TrendingUp,
      color: 'from-orange-500 to-yellow-500',
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Analytics
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track provider performance and platform growth
        </p>

      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {analyticsCards.map((card, index) => (

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
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>

                <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">
                  {card.value}
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
                  ${card.color}
                `}
              >

                <card.icon className="w-7 h-7" />

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* CHART PLACEHOLDER */}
      <div
        className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-3xl
          p-8
          shadow-sm
        "
      >

        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
          Revenue Overview
        </h2>

        <div className="
          h-80
          rounded-2xl
          bg-gradient-to-r
          from-blue-100
          to-purple-100
          dark:from-gray-800
          dark:to-gray-900
          flex
          items-center
          justify-center
        ">

          <p className="text-gray-500 dark:text-gray-400 font-semibold">
            Analytics Chart Coming Soon
          </p>

        </div>

      </div>

    </div>
  );
};

export default Analytics;