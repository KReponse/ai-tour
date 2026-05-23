// src/pages/provider/AddTour.jsx

import React, {
  useState,
} from 'react';

import {
  ImagePlus,
  Video,
  MapPin,
  DollarSign,
  Users,
  Clock3,
  Tag,
  FileText,
  UploadCloud,
  Sparkles,
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

  const [images, setImages] =
    useState([]);

  const [video, setVideo] =
    useState(null);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleImageUpload = (e) => {

    const files =
      Array.from(e.target.files);

    setImages(files);

  };

  const handleVideoUpload = (e) => {

    const file =
      e.target.files[0];

    setVideo(file);

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log({
      ...formData,
      images,
      video,
    });

  };

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <div className="flex items-center gap-3">

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                flex
                items-center
                justify-center
                text-white
                shadow-lg
              "
            >

              <Sparkles className="w-7 h-7" />

            </div>

            <div>

              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Create New Tour
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Publish a professional travel experience
              </p>

            </div>

          </div>

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
            font-bold
            shadow-lg
            hover:scale-105
            transition-all
          "
        >
          Preview Tour
        </button>

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
          rounded-[2rem]
          p-8
          shadow-sm
          space-y-10
        "
      >

        {/* BASIC INFO */}
        <div className="space-y-6">

          <div>

            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Basic Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Fill in your tour details carefully
            </p>

          </div>

          {/* TITLE */}
          <div>

            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Tour Title
            </label>

            <div className="relative mt-2">

              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Volcanoes Gorilla Trek"
                className="
                  w-full
                  h-14
                  pl-12
                  pr-5
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-gray-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>

          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* LOCATION */}
            <div>

              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
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
                    pr-5
                    rounded-2xl
                    border
                    border-gray-200
                    dark:border-gray-700
                    bg-gray-50
                    dark:bg-gray-800
                    dark:text-white
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>

            </div>

            {/* PRICE */}
            <div>

              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
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
                    pr-5
                    rounded-2xl
                    border
                    border-gray-200
                    dark:border-gray-700
                    bg-gray-50
                    dark:bg-gray-800
                    dark:text-white
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>

            </div>

            {/* DURATION */}
            <div>

              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
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
                    pr-5
                    rounded-2xl
                    border
                    border-gray-200
                    dark:border-gray-700
                    bg-gray-50
                    dark:bg-gray-800
                    dark:text-white
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>

            </div>

            {/* TRAVELERS */}
            <div>

              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
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
                    pr-5
                    rounded-2xl
                    border
                    border-gray-200
                    dark:border-gray-700
                    bg-gray-50
                    dark:bg-gray-800
                    dark:text-white
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>

            </div>

          </div>

          {/* CATEGORY */}
          <div>

            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
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
                focus:ring-2
                focus:ring-blue-500
              "
            >

              <option value="">
                Select Category
              </option>

              <option value="Wildlife">
                Wildlife
              </option>

              <option value="Adventure">
                Adventure
              </option>

              <option value="Cultural">
                Cultural
              </option>

              <option value="Luxury">
                Luxury
              </option>

            </select>

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Description
            </label>

            <div className="relative mt-2">

              <FileText className="absolute left-4 top-5 w-5 h-5 text-gray-400" />

              <textarea
                rows="6"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the complete travel experience..."
                className="
                  w-full
                  pl-12
                  pr-5
                  py-4
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-gray-800
                  dark:text-white
                  outline-none
                  resize-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>

          </div>

        </div>

        {/* MEDIA SECTION */}
        <div className="space-y-6">

          <div>

            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Tour Media
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Upload beautiful photos and promotional videos
            </p>

          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* IMAGES */}
            <div
              className="
                border-2
                border-dashed
                border-gray-300
                dark:border-gray-700
                rounded-3xl
                p-8
                text-center
                bg-gray-50
                dark:bg-gray-800/50
              "
            >

              <div
                className="
                  w-20
                  h-20
                  mx-auto
                  rounded-3xl
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                  flex
                  items-center
                  justify-center
                  text-white
                  shadow-lg
                "
              >

                <ImagePlus className="w-10 h-10" />

              </div>

              <h3 className="font-black text-xl mt-5 dark:text-white">
                Upload Images
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG • Maximum 10MB
              </p>

              <label
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  px-6
                  h-12
                  rounded-2xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                  cursor-pointer
                  transition
                "
              >

                <UploadCloud className="w-5 h-5" />

                Select Images

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />

              </label>

              {images.length > 0 && (

                <div className="mt-5 space-y-2 text-left">

                  {images.map(
                    (img, index) => (

                      <div
                        key={index}
                        className="
                          text-sm
                          text-gray-600
                          dark:text-gray-300
                          truncate
                        "
                      >
                        • {img.name}
                      </div>

                    )
                  )}

                </div>

              )}

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
                bg-gray-50
                dark:bg-gray-800/50
              "
            >

              <div
                className="
                  w-20
                  h-20
                  mx-auto
                  rounded-3xl
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-500
                  flex
                  items-center
                  justify-center
                  text-white
                  shadow-lg
                "
              >

                <Video className="w-10 h-10" />

              </div>

              <h3 className="font-black text-xl mt-5 dark:text-white">
                Upload Short Video
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                MP4 • Maximum 1 minute
              </p>

              <label
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  px-6
                  h-12
                  rounded-2xl
                  bg-purple-600
                  hover:bg-purple-700
                  text-white
                  font-semibold
                  cursor-pointer
                  transition
                "
              >

                <UploadCloud className="w-5 h-5" />

                Select Video

                <input
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={handleVideoUpload}
                />

              </label>

              {video && (

                <div className="mt-5 text-sm text-gray-600 dark:text-gray-300 truncate">
                  • {video.name}
                </div>

              )}

            </div>

          </div>

        </div>

        {/* SUBMIT */}
        <div className="flex justify-end pt-4">

          <button
            type="submit"
            className="
              px-10
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              text-white
              font-black
              shadow-xl
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