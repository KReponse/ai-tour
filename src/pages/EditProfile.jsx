import React, {
  useState,
} from 'react';

import {
  Camera,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

const EditProfile = () => {

  const { user } = useAuth();

  const [formData, setFormData] =
    useState({
      fullName:
        user?.fullName || '',
      email:
        user?.email || '',
      phone:
        user?.phone || '',
      country:
        user?.country || '',
      avatar:
        user?.avatar || '',
    });

  const [loading, setLoading] =
    useState(false);
    const handleImageUpload = (
  e
) => {

  const file =
    e.target.files[0];

  if (!file) return;

  const reader =
    new FileReader();

  reader.onloadend = () => {

    setFormData({
      ...formData,
      avatar:
        reader.result,
    });
  };

  reader.readAsDataURL(file);
};

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      // UPDATE LOCAL USER
      const updatedUser = {
        ...user,
        ...formData,
      };

      // SAVE TO LOCAL STORAGE
      localStorage.setItem(
        'user',
        JSON.stringify(
          updatedUser
        )
      );

      alert(
        'Profile updated successfully!'
      );

      window.location.reload();

    } catch (error) {

      console.log(error);

      alert(
        'Failed to update profile'
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Edit Profile
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Update your account information
          </p>
        </div>

        {/* AVATAR */}
        <div className="flex justify-center mb-8">

          <div className="relative">

            <img
              src={
                formData.avatar ||
                `https://ui-avatars.com/api/?name=${formData.fullName}`
              }
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />

            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-3 rounded-full cursor-pointer transition">

              <Camera className="w-5 h-5 text-white" />

              <input
  type="file"
  accept="image/*"
  onChange={
    handleImageUpload
  }
  className="hidden"
/>
            </label>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* FULL NAME */}
          <div>

            <label className="block mb-2 text-sm font-medium dark:text-white">
              Full Name
            </label>

            <div className="relative">

              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                name="fullName"
                value={
                  formData.fullName
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>

            <label className="block mb-2 text-sm font-medium dark:text-white">
              Email
            </label>

            <div className="relative">

              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* PHONE */}
          <div>

            <label className="block mb-2 text-sm font-medium dark:text-white">
              Phone
            </label>

            <div className="relative">

              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                name="phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* COUNTRY */}
          <div>

            <label className="block mb-2 text-sm font-medium dark:text-white">
              Country
            </label>

            <div className="relative">

              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                name="country"
                value={
                  formData.country
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
          >

            <Save className="w-5 h-5" />

            {loading
              ? 'Saving...'
              : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;