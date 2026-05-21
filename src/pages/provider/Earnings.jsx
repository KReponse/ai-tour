import React from 'react';

import {
  Wallet,
  CreditCard,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

const Earnings = () => {

  const stats = [
    {
      title: 'Total Earnings',
      value: '$24,800',
      icon: Wallet,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Pending Payout',
      value: '$2,400',
      icon: CreditCard,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Monthly Revenue',
      value: '$6,300',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Completed Payments',
      value: '128',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Earnings
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your payments and revenue performance
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item, index) => (

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
                  ${item.color}
                `}
              >

                <item.icon className="w-7 h-7" />

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* TRANSACTIONS */}
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
            Recent Transactions
          </h2>

          <button className="text-blue-600 font-semibold hover:underline">
            View All
          </button>

        </div>

        <div className="space-y-4">

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="
                flex
                items-center
                justify-between
                p-4
                rounded-2xl
                bg-gray-50
                dark:bg-gray-800
              "
            >

              <div>

                <h3 className="font-bold dark:text-white">
                  Volcanoes National Park Tour
                </h3>

                <p className="text-sm text-gray-500">
                  Payment received
                </p>

              </div>

              <div className="text-right">

                <h3 className="font-bold text-green-600">
                  +$1,200
                </h3>

                <p className="text-sm text-gray-500">
                  Today
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default Earnings;