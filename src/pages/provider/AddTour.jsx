import React, {
  useState,
} from 'react';

import {
  Image,
  Video,
  MapPin,
  DollarSign,
  Users,
  Clock3,
} from 'lucide-react';

const AddTour = () => {

  const [formData, setFormData] =
    useState({
      title: '',
      location: '',
      price: '',
      duration: '',
      travelers: '',
      category: '',
      description: '',
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log(formData);

  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Add New Tour
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Create and publish a new destination experience
        </p>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-3xl
          p-8
          shadow-sm
          space-y-8
        "
      >

        {/* TITLE */}
        <div>

          <label className="text-sm text-gray-500">
            Tour Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Volcanoes Gorilla Trek"
            className="
              mt-2
              w-full
              h-14
              px-5
              rounded-2xl
              border
              border-gray-200
              dark:border-gray-700
              bg-gray-50
              dark:bg-gray-800
              dark:text-white
              outline-none
            "
          />

        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* LOCATION */}
          <div>

            <label className="text-sm text-gray-500">
              Location
            </label>

            <div className="relative mt-2">

              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Musanze, Rwanda"
                className="
                  w-full
                  h-14
                  pl-12
                  pr-4
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-gray-800
                  dark:text-white
                  outline-none
                "
              />

            </div>

          </div>

          {/* PRICE */}
          <div>

            <label className="text-sm text-gray-500">
              Price
            </label>

            <div className="relative mt-2">

              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="1200"
                className="
                  w-full
                  h-14
                  pl-12
                  pr-4
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-gray-800
                  dark:text-white
                  outline-none
                "
              />

            </div>

          </div>

          {/* DURATION */}
          <div>

            <label className="text-sm text-gray-500">
              Duration
            </label>

            <div className="relative mt-2">

              <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="3 Days"
                className="
                  w-full
                  h-14
                  pl-12
                  pr-4
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-gray-800
                  dark:text-white
                  outline-none
                "
              />

            </div>

          </div>

          {/* TRAVELERS */}
          <div>

            <label className="text-sm text-gray-500">
              Max Travelers
            </label>

            <div className="relative mt-2">

              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="number"
                name="travelers"
                value={formData.travelers}
                onChange={handleChange}
                placeholder="10"
                className="
                  w-full
                  h-14
                  pl-12
                  pr-4
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-gray-800
                  dark:text-white
                  outline-none
                "
              />

            </div>

          </div>

        </div>

        {/* CATEGORY */}
        <div>

          <label className="text-sm text-gray-500">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="
              mt-2
              w-full
              h-14
              px-5
              rounded-2xl
              border
              border-gray-200
              dark:border-gray-700
              bg-gray-50
              dark:bg-gray-800
              dark:text-white
              outline-none
            "
          >

            <option value="">
              Select Category
            </option>

            <option>
              Wildlife
            </option>

            <option>
              Adventure
            </option>

            <option>
              Cultural
            </option>

            <option>
              Luxury
            </option>

          </select>

        </div>

        {/* DESCRIPTION */}
        <div>

          <label className="text-sm text-gray-500">
            Description
          </label>

          <textarea
            rows="6"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the tour experience..."
            className="
              mt-2
              w-full
              p-5
              rounded-2xl
              border
              border-gray-200
              dark:border-gray-700
              bg-gray-50
              dark:bg-gray-800
              dark:text-white
              outline-none
              resize-none
            "
          />

        </div>

        {/* UPLOADS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* IMAGE */}
          <div
            className="
              border-2
              border-dashed
              border-gray-300
              dark:border-gray-700
              rounded-3xl
              p-8
              text-center
            "
          >

            <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />

            <h3 className="font-bold dark:text-white">
              Upload Images
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG up to 10MB
            </p>

            <input
              type="file"
              multiple
              className="mt-5"
            />

          </div>

          {/* VIDEO */}
          <div
            className="
              border-2
              border-dashed
              border-gray-300
              dark:border-gray-700
              rounded-3xl
              p-8
              text-center
            "
          >

            <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />

            <h3 className="font-bold dark:text-white">
              Upload Short Video
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              MP4 up to 1 minute
            </p>

            <input
              type="file"
              className="mt-5"
            />

          </div>

        </div>

        {/* BUTTON */}
        <div className="flex justify-end">

          <button
            type="submit"
            className="
              px-8
              h-14
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
            Publish Tour
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddTour;