import React from 'react';

import {
  Star,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';

import {
  reviewsData,
} from '../../data/providerData';

const Reviews = () => {

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Reviews & Ratings
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Traveler feedback and service ratings
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* OVERALL RATING */}
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
                Overall Rating
              </p>

              <h2 className="text-4xl font-black text-yellow-500 mt-2">
                4.8
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-yellow-400
                to-orange-500
                text-white
                flex
                items-center
                justify-center
              "
            >

              <Star className="w-7 h-7" />

            </div>

          </div>

        </div>

        {/* TOTAL REVIEWS */}
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
                Total Reviews
              </p>

              <h2 className="text-4xl font-black text-blue-600 mt-2">
                248
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

              <MessageCircle className="w-7 h-7" />

            </div>

          </div>

        </div>

        {/* GROWTH */}
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
                Positive Growth
              </p>

              <h2 className="text-4xl font-black text-green-600 mt-2">
                +18%
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

              <TrendingUp className="w-7 h-7" />

            </div>

          </div>

        </div>

      </div>

      {/* REVIEWS LIST */}
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

        <div className="mb-6">

          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Traveler Reviews
          </h2>

          <p className="text-gray-500 mt-1">
            Latest customer feedback
          </p>

        </div>

        <div className="space-y-5">

          {reviewsData.map((review) => (

            <div
              key={review.id}
              className="
                p-5
                rounded-2xl
                bg-gray-50
                dark:bg-gray-800
                border
                border-gray-100
                dark:border-gray-700
              "
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                {/* LEFT */}
                <div className="space-y-3">

                  <div>

                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {review.traveler}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {review.destination}
                    </p>

                  </div>

                  {/* STARS */}
                  <div className="flex items-center gap-1">

                    {[...Array(review.rating)].map((_, i) => (

                      <Star
                        key={i}
                        className="
                          w-5
                          h-5
                          fill-yellow-400
                          text-yellow-400
                        "
                      />

                    ))}

                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{review.comment}"
                  </p>

                </div>

                {/* DATE */}
                <div>

                  <span
                    className="
                      px-4
                      py-2
                      rounded-full
                      bg-blue-100
                      text-blue-600
                      text-sm
                      font-semibold
                    "
                  >
                    {review.date}
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
};

export default Reviews;