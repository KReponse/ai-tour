import React from 'react';

import {
  Star,
  MessageCircle,
} from 'lucide-react';

const Reviews = () => {

  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      country: 'USA',
      rating: 5,
      comment:
        'Amazing experience with AI Tour Rwanda. Professional service and unforgettable trip!',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      country: 'Canada',
      rating: 4,
      comment:
        'Very good tour planning and communication. Highly recommended.',
    },
    {
      id: 3,
      name: 'Ali Hassan',
      country: 'UAE',
      rating: 5,
      comment:
        'Excellent hospitality and smooth booking experience.',
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Reviews
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Traveler feedback and ratings
        </p>

      </div>

      {/* REVIEW STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          border
          border-gray-200
          dark:border-gray-800
          p-6
          shadow-sm
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Total Reviews
              </p>

              <h2 className="text-4xl font-black dark:text-white mt-2">
                128
              </h2>

            </div>

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-yellow-500
              to-orange-500
              text-white
              flex
              items-center
              justify-center
            ">

              <MessageCircle className="w-7 h-7" />

            </div>

          </div>

        </div>

        <div className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          border
          border-gray-200
          dark:border-gray-800
          p-6
          shadow-sm
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Average Rating
              </p>

              <h2 className="text-4xl font-black dark:text-white mt-2">
                4.9
              </h2>

            </div>

            <div className="
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
            ">

              <Star className="w-7 h-7" />

            </div>

          </div>

        </div>

        <div className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          border
          border-gray-200
          dark:border-gray-800
          p-6
          shadow-sm
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Positive Feedback
              </p>

              <h2 className="text-4xl font-black text-green-600 mt-2">
                96%
              </h2>

            </div>

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-green-500
              to-emerald-500
              text-white
              flex
              items-center
              justify-center
            ">

              <Star className="w-7 h-7" />

            </div>

          </div>

        </div>

      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-5">

        {reviews.map((review) => (

          <div
            key={review.id}
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

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              {/* USER */}
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
                  font-black
                  text-2xl
                ">
                  {review.name.charAt(0)}
                </div>

                <div>

                  <h2 className="text-lg font-bold dark:text-white">
                    {review.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {review.country}
                  </p>

                </div>

              </div>

              {/* RATING */}
              <div className="flex items-center gap-1">

                {[...Array(review.rating)].map((_, i) => (

                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />

                ))}

              </div>

            </div>

            {/* COMMENT */}
            <p className="mt-5 text-gray-600 dark:text-gray-300 leading-relaxed">
              {review.comment}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Reviews;