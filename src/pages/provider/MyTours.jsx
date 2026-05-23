import React from 'react';

import {
  MapPin,
  Clock3,
  Users,
  Pencil,
  Trash2,
  Eye,
  Plus,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';


const tours = [
  {
    id: 1,
    title: 'Volcano Gorilla Trek',
    location: 'Musanze, Rwanda',
    price: '$1200',
    duration: '3 Days',
    travelers: '10 People',
    image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop',
    status: 'Published',
  },

  {
    id: 2,
    title: 'Akagera Wildlife Safari',
    location: 'Akagera, Rwanda',
    price: '$850',
    duration: '2 Days',
    travelers: '6 People',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    status: 'Draft',
  },
];

const MyTours = () => {

  const navigate = useNavigate();

 const handleEdit = (id) => {
  navigate(`/provider/tours/edit/${id}`);
};
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            My Tours
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage all your published travel experiences
          </p>

        </div>

        <button
          onClick={() =>
            navigate('/provider/add-tour')
          }
          className="
            inline-flex
            items-center
            gap-2
            h-12
            px-6
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-purple-600
            text-white
            font-bold
            shadow-lg
            hover:scale-105
            transition-all
          "
        >

          <Plus className="w-5 h-5" />

          Add New Tour

        </button>

      </div>

      {/* TOURS GRID */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {tours.map((tour) => (

          <div
            key={tour.id}
            className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-3xl
              overflow-hidden
              shadow-sm
              hover:shadow-xl
              transition-all
            "
          >

            {/* IMAGE */}
            <div className="relative h-56 overflow-hidden">

              <img
                src={tour.image}
                alt={tour.title}
                className="
                  w-full
                  h-full
                  object-cover
                  hover:scale-110
                  transition-all
                  duration-500
                "
              />

              <div
                className="
                  absolute
                  top-4
                  right-4
                  px-4
                  py-2
                  rounded-full
                  text-xs
                  font-bold
                  backdrop-blur-xl
                  bg-white/90
                  dark:bg-gray-900/90
                "
              >

                {tour.status}

              </div>

            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-5">

              <div>

                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  {tour.title}
                </h2>

                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">

                  <MapPin className="w-4 h-4" />

                  {tour.location}

                </div>

              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 gap-4">

                <div
                  className="
                    p-4
                    rounded-2xl
                    bg-gray-50
                    dark:bg-gray-800
                  "
                >

                  <p className="text-xs text-gray-500">
                    Price
                  </p>

                  <h3 className="font-bold text-green-600 mt-1">
                    {tour.price}
                  </h3>

                </div>

                <div
                  className="
                    p-4
                    rounded-2xl
                    bg-gray-50
                    dark:bg-gray-800
                  "
                >

                  <div className="flex items-center gap-2 text-xs text-gray-500">

                    <Clock3 className="w-4 h-4" />

                    Duration

                  </div>

                  <h3 className="font-bold dark:text-white mt-1">
                    {tour.duration}
                  </h3>

                </div>

                <div
                  className="
                    col-span-2
                    p-4
                    rounded-2xl
                    bg-gray-50
                    dark:bg-gray-800
                    flex
                    items-center
                    gap-3
                  "
                >

                  <Users className="w-5 h-5 text-blue-600" />

                  <span className="font-semibold dark:text-white">
                    {tour.travelers}
                  </span>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 pt-2">

                <button
                  className="
                    flex-1
                    h-12
                    rounded-2xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                  "
                >

                  <Eye className="w-5 h-5" />

                  View

                </button>

                {/* EDIT BUTTON */}
                <button
                  onClick={() =>
                    handleEdit(tour.id)
                  }
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-gray-100
                    dark:bg-gray-800
                    hover:bg-gray-200
                    dark:hover:bg-gray-700
                    flex
                    items-center
                    justify-center
                    transition
                  "
                >

                  <Pencil className="w-5 h-5 dark:text-white" />

                </button>

                {/* DELETE BUTTON */}
                <button
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-red-100
                    dark:bg-red-900/20
                    hover:bg-red-200
                    dark:hover:bg-red-900/40
                    flex
                    items-center
                    justify-center
                    transition
                  "
                >

                  <Trash2 className="w-5 h-5 text-red-500" />

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default MyTours;