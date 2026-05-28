import React, {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
} from 'react-router-dom';

import {
  MapPin,
  Clock,
  Users,
  Star,
  PlayCircle,
  Loader2,
} from 'lucide-react';

import {
  getTourById,
} from '../services/tourService';

const TourDetails = () => {

  const { id } =
    useParams();

  const [tour, setTour] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchTour();

  }, []);

  const fetchTour =
    async () => {

      try {
       
        const data =
  await getTourById(id);
       
        setTour(data.tour);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />

      </div>

    );

  }

  if (!tour) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-2xl font-bold">
          Tour Not Found
        </h1>

      </div>

    );

  }

  const imageUrl =
    tour.image
      ? `http://localhost:5000/uploads/${tour.image}`
      : 'https://via.placeholder.com/1200x600';

  const videoUrl =
    tour.video
      ? `http://localhost:5000/uploads/${tour.video}`
      : null;

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* HERO IMAGE */}

      <div className="relative h-[400px] md:h-[550px] overflow-hidden">

        <img
          src={imageUrl}
          alt={tour.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">

          <div className="max-w-6xl mx-auto">

            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {tour.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-400" />
                <span>{tour.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>{tour.duration}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                <span>
                  {tour.travelers} Travelers
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>4.8 Rating</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-8">

          {/* DESCRIPTION */}

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              About This Tour
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {tour.description}
            </p>

          </div>

          {/* VIDEO */}

          {videoUrl && (

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                Tour Video
              </h2>

              <video
                controls
                className="w-full rounded-2xl"
              >
                <source
                  src={videoUrl}
                  type="video/mp4"
                />
              </video>

            </div>

          )}

        </div>

        {/* RIGHT BOOKING CARD */}

        <div>

          <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800">

            <div className="mb-6">

              <h2 className="text-4xl font-bold text-blue-600">
                ${tour.price}
              </h2>

              <p className="text-gray-500">
                per person
              </p>

            </div>

            <button className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-xl">

              Book Now

            </button>

            <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300">

              <div className="flex justify-between">
                <span>Location</span>
                <span>{tour.location}</span>
              </div>

              <div className="flex justify-between">
                <span>Duration</span>
                <span>{tour.duration}</span>
              </div>

              <div className="flex justify-between">
                <span>Travelers</span>
                <span>{tour.travelers}</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default TourDetails;