import React from 'react';

import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
} from 'lucide-react';

import {
  earningsData,
} from '../../data/providerData';

const Earnings = () => {

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Earnings
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your revenue and payouts
          </p>

        </div>

        <button
          className="
            h-12
            px-6
            rounded-2xl
            bg-gradient-to-r
            from-green-500
            to-emerald-600
            text-white
            font-semibold
            shadow-lg
            hover:scale-105
            transition-all
          "
        >
          Withdraw Funds
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* TOTAL */}
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

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Earnings
              </p>

              <h2 className="text-4xl font-black text-green-600 mt-2">
                $24,500
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-green-500
                to-emerald-600
                text-white
                flex
                items-center
                justify-center
              "
            >

              <Wallet className="w-7 h-7" />

            </div>

          </div>

        </div>

        {/* THIS MONTH */}
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

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                This Month
              </p>

              <h2 className="text-4xl font-black text-blue-600 mt-2">
                $4,200
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-blue-500
                to-cyan-500
                text-white
                flex
                items-center
                justify-center
              "
            >

              <ArrowUpRight className="w-7 h-7" />

            </div>

          </div>

        </div>

        {/* PENDING */}
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

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Pending Payouts
              </p>

              <h2 className="text-4xl font-black text-orange-500 mt-2">
                $1,350
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-orange-500
                to-yellow-500
                text-white
                flex
                items-center
                justify-center
              "
            >

              <ArrowDownLeft className="w-7 h-7" />

            </div>

          </div>

        </div>

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

          <div>

            <h2 className="text-2xl font-black dark:text-white">
              Recent Transactions
            </h2>

            <p className="text-gray-500 mt-1">
              Latest payment activities
            </p>

          </div>

        </div>

        <div className="space-y-4">

          {earningsData.map((item) => (

            <div
              key={item.id}
              className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-4
                p-5
                rounded-2xl
                bg-gray-50
                dark:bg-gray-800
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >

                  <CreditCard className="w-6 h-6" />

                </div>

                <div>

                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.date}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <h3 className="font-black text-lg text-green-600">
                  {item.amount}
                </h3>

                <span
                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    ${
                      item.status === 'Paid'
                        ? 'bg-green-100 text-green-600'
                        : item.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-blue-100 text-blue-600'
                    }
                  `}
                >
                  {item.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
};

export default Earnings;