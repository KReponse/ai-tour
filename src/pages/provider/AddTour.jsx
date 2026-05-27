import React, { useState } from 'react';
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Image,
  Video,
  FileText,
  PlusCircle,
  X,
  AlertCircle,
  CheckCircle,
  Upload,
} from 'lucide-react';
import { createTour } from '../../services/tourService';
import { useAuth } from '../../contexts/AuthContext';

const AddTour = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    duration: '',
    travelers: '',
    description: '',
    image: null,
    video: null,
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length < 5) return 'Title must be at least 5 characters';
        if (value.length > 100) return 'Title must be less than 100 characters';
        return '';
      case 'location':
        if (!value.trim()) return 'Location is required';
        return '';
      case 'price':
        if (!value) return 'Price is required';
        if (value <= 0) return 'Price must be greater than 0';
        if (value > 100000) return 'Price must be less than 100,000';
        return '';
      case 'duration':
        if (!value.trim()) return 'Duration is required';
        return '';
      case 'travelers':
        if (!value) return 'Number of travelers is required';
        if (value < 1) return 'Must have at least 1 traveler';
        if (value > 100) return 'Maximum 100 travelers allowed';
        return '';
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length < 20) return 'Description must be at least 20 characters';
        if (value.length > 2000) return 'Description must be less than 2000 characters';
        return '';
      case 'image':
        if (!value) return 'Tour image is required';
        if (value && !value.type.startsWith('image/')) return 'File must be an image';
        if (value && value.size > 5 * 1024 * 1024) return 'Image must be less than 5MB';
        return '';
      case 'video':
        if (value && !value.type.startsWith('video/')) return 'File must be a video';
        if (value && value.size > 100 * 1024 * 1024) return 'Video must be less than 100MB';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files[0]) {
      const file = files[0];
      const error = validateField(name, file);
      if (!error) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
      setFormData({ ...formData, image: file });
      setErrors({ ...errors, image: error });
    } 
    else if (name === 'video' && files[0]) {
      const file = files[0];
      const error = validateField(name, file);
      if (!error) {
        setVideoPreview(URL.createObjectURL(file));
      } else if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
      }
      setFormData({ ...formData, video: file });
      setErrors({ ...errors, video: error });
    } 
    else {
      setFormData({ ...formData, [name]: value });
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      // Simulate upload progress (replace with actual progress from API if available)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await createTour(data, token);
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success message
      setTimeout(() => {
        setFormData({
          title: '',
          location: '',
          price: '',
          duration: '',
          travelers: '',
          description: '',
          image: null,
          video: null,
        });
        setImagePreview(null);
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
        setErrors({});
        setTouched({});
        setUploadProgress(0);
        
        // Show success toast (you can replace with your toast library)
        alert('✅ Tour uploaded successfully! Your tour is now live.');
      }, 500);

    } catch (error) {
      console.error(error);
      setUploadProgress(0);
      const errorMessage = error.response?.data?.message || 'Failed to upload tour';
      setErrors({ submit: errorMessage });
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (fileType) => {
    if (fileType === 'image') {
      setFormData({ ...formData, image: null });
      setImagePreview(null);
    } else if (fileType === 'video') {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setFormData({ ...formData, video: null });
      setVideoPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <PlusCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Create New Tour
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Share amazing Rwandan experiences with the world
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-200">{errors.submit}</p>
              </div>
              <button
                type="button"
                onClick={() => setErrors({ ...errors, submit: '' })}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {loading && uploadProgress > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Uploading tour...</span>
                <span className="font-semibold text-blue-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tour Title *
                </label>
                <div className="relative">
                  <PlusCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Amazing Gorilla Trekking Adventure"
                    required
                    className={`w-full h-12 pl-12 pr-4 rounded-xl border ${
                      errors.title && touched.title
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } dark:bg-gray-700 dark:text-white transition-all duration-200 focus:ring-2 focus:outline-none`}
                  />
                </div>
                {errors.title && touched.title && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Volcanoes National Park"
                    required
                    className={`w-full h-12 pl-12 pr-4 rounded-xl border ${
                      errors.location && touched.location
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } dark:bg-gray-700 dark:text-white transition-all duration-200 focus:ring-2 focus:outline-none`}
                  />
                </div>
                {errors.location && touched.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              {/* Price & Duration Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Price (USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="500"
                      required
                      className={`w-full h-12 pl-12 pr-4 rounded-xl border ${
                        errors.price && touched.price
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } dark:bg-gray-700 dark:text-white transition-all duration-200 focus:ring-2 focus:outline-none`}
                    />
                  </div>
                  {errors.price && touched.price && (
                    <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Duration *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., 3 Days, 2 Nights"
                      required
                      className={`w-full h-12 pl-12 pr-4 rounded-xl border ${
                        errors.duration && touched.duration
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } dark:bg-gray-700 dark:text-white transition-all duration-200 focus:ring-2 focus:outline-none`}
                    />
                  </div>
                  {errors.duration && touched.duration && (
                    <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
                  )}
                </div>
              </div>

              {/* Travelers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Max Travelers *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="10"
                    required
                    className={`w-full h-12 pl-12 pr-4 rounded-xl border ${
                      errors.travelers && touched.travelers
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } dark:bg-gray-700 dark:text-white transition-all duration-200 focus:ring-2 focus:outline-none`}
                  />
                </div>
                {errors.travelers && touched.travelers && (
                  <p className="mt-1 text-sm text-red-500">{errors.travelers}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Describe the experience in detail..."
                    rows={6}
                    required
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      errors.description && touched.description
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } dark:bg-gray-700 dark:text-white transition-all duration-200 focus:ring-2 focus:outline-none resize-none`}
                  />
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  {errors.description && touched.description ? (
                    <p className="text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </p>
                  ) : (
                    <span className="text-gray-500">
                      {formData.description.length}/2000 characters
                    </span>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tour Image *
                </label>
                <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  errors.image
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                }`}>
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('image')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Click or drag to upload image
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.image}
                  </p>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tour Video (Optional)
                </label>
                <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  errors.video
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                }`}>
                  {videoPreview ? (
                    <div className="relative">
                      <video 
                        src={videoPreview} 
                        controls 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('video')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Click or drag to upload video (optional)
                      </p>
                      <p className="text-sm text-gray-500">
                        MP4, WebM up to 100MB
                      </p>
                      <input
                        type="file"
                        name="video"
                        accept="video/*"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
                {errors.video && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.video}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading Tour...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Publish Tour
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            By publishing, you agree to our terms and conditions
          </p>
        </form>
      </div>
    </div>
  );
};

export default AddTour;