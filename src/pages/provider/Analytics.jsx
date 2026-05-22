import React from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

import {
  analyticsData,
} from '../../data/providerData';

const Analytics = () => {

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Analytics
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your business performance and growth
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          className="
            bg-white
            dark:bg-gray-900
            rounded-3xl
            border
            border-gray-200
            dark:border-gray-800
            p-6
            shadow-sm
          "
        >

          <p className="text-gray-500 text-sm">
            Total Revenue
          </p>

          <h2 className="text-4xl font-black text-green-600 mt-2">
            $17,900
          </h2>

        </div>

        <div
          className="
            bg-white
            dark:bg-gray-900
            rounded-3xl
            border
            border-gray-200
            dark:border-gray-800
            p-6
            shadow-sm
          "
        >

          <p className="text-gray-500 text-sm">
            Total Bookings
          </p>

          <h2 className="text-4xl font-black text-blue-600 mt-2">
            248
          </h2>

        </div>

        <div
          className="
            bg-white
            dark:bg-gray-900
            rounded-3xl
            border
            border-gray-200
            dark:border-gray-800
            p-6
            shadow-sm
          "
        >

          <p className="text-gray-500 text-sm">
            Growth Rate
          </p>

          <h2 className="text-4xl font-black text-purple-600 mt-2">
            +32%
          </h2>

        </div>

      </div>

      {/* REVENUE CHART */}
      <div
        className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          border
          border-gray-200
          dark:border-gray-800
          p-6
          shadow-sm
        "
      >

        <div className="mb-6">

          <h2 className="text-2xl font-black dark:text-white">
            Revenue Overview
          </h2>

          <p className="text-gray-500 mt-1">
            Monthly revenue performance
          </p>

        </div>

        <div className="h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={analyticsData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* BOOKINGS CHART */}
      <div
        className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          border
          border-gray-200
          dark:border-gray-800
          p-6
          shadow-sm
        "
      >

        <div className="mb-6">

          <h2 className="text-2xl font-black dark:text-white">
            Bookings Analytics
          </h2>

          <p className="text-gray-500 mt-1">
            Monthly bookings activity
          </p>

        </div>

        <div className="h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={analyticsData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="bookings"
                fill="#7c3aed"
                radius={[12, 12, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
};

export default Analytics;