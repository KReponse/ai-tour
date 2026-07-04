// src/pages/provider/EditTour.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin, DollarSign, Clock, Users, Video, FileText,
  PlusCircle, X, AlertCircle, CheckCircle, Upload,
  Sparkles, Camera, Image as ImageIcon, Loader2,
  Save, ArrowLeft
} from "lucide-react";
import { getTourById, updateTour } from "../../services/tourService";
import { useAuth } from "../../contexts/AuthContext";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

// ✅ FIX: Define API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EditTour = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [videoPreview, setVideoPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  
  const [formData, setFormData] = useState({
    title: "", location: "", category: "", price: "",
    duration: "", travelers: "", description: "",
    highlights: "", included: "", excluded: "",
    meetingPoint: "", cancellationPolicy: "",
    requirements: "", // ✅ ADDED
    coverImage: null, galleryImages: [], videos: []
  });

  // ============= FETCH TOUR =============
  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const data = await getTourById(id);
      const tour = data.tour;
      
      // Populate form with existing data
      setFormData({
        title: tour.title || "",
        location: tour.location || "",
        category: tour.category || "",
        price: tour.price || "",
        duration: tour.duration || "",
        travelers: tour.travelers || "",
        description: tour.description || "",
        highlights: tour.highlights || "",
        included: tour.included || "",
        excluded: tour.excluded || "",
        meetingPoint: tour.meetingPoint || "",
        cancellationPolicy: tour.cancellationPolicy || "",
        requirements: tour.requirements || "", // ✅ ADDED
        coverImage: null,
        galleryImages: [],
        videos: []
      });

      // Set existing images and videos
      if (tour.coverImage) {
        setCoverPreview(`${API_URL}/uploads/${tour.coverImage}`);
        setExistingImages([tour.coverImage]);
      }
      
      if (tour.galleryImages && tour.galleryImages.length > 0) {
        setGalleryPreview(tour.galleryImages.map(img => `${API_URL}/uploads/${img}`));
        setExistingImages(tour.galleryImages);
      }
      
      if (tour.videos && tour.videos.length > 0) {
        setVideoPreview(tour.videos.map(vid => `${API_URL}/uploads/${vid}`));
        setExistingVideos(tour.videos);
      }
      
    } catch (error) {
      console.error("❌ Error fetching tour:", error);
      alert("Failed to load tour data");
      navigate("/provider/tours");
    } finally {
      setLoading(false);
    }
  };

  // ============= VALIDATION =============
  const validateField = (name, value) => {
    switch (name) {
      case "title":
        if (!value?.trim()) return "Tour title is required";
        if (value.length < 5) return "Title must contain at least 5 characters";
        return "";
      case "location":
        if (!value?.trim()) return "Location is required";
        return "";
      case "category":
        if (!value) return "Select tour category";
        return "";
      case "price":
        if (!value) return "Price is required";
        if (Number(value) <= 0) return "Price must be greater than 0";
        return "";
      case "duration":
        if (!value?.trim()) return "Duration is required";
        return "";
      case "travelers":
        if (!value) return "Maximum travelers required";
        if (Number(value) < 1) return "Invalid travelers number";
        return "";
      case "description":
        if (!value?.trim()) return "Description is required";
        if (value.length < 30) return "Description must be at least 30 characters";
        return "";
      default:
        return "";
    }
  };

  // ============= HANDLE TEXT INPUT =============
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // ============= FILE HANDLING =============
  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, coverImage: file });
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newGallery = [...formData.galleryImages, ...files];
    setFormData({ ...formData, galleryImages: newGallery });
    setGalleryPreview([
      ...galleryPreview,
      ...files.map(f => URL.createObjectURL(f))
    ]);
  };

  const handleVideos = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    // Check duration for new videos
    for (const video of files) {
      const duration = await checkVideoDuration(video);
      if (duration > 300) {
        setErrors({
          ...errors,
          videos: "Each video must be maximum 5 minutes"
        });
        return;
      }
    }
    const newVideos = [...formData.videos, ...files];
    setFormData({ ...formData, videos: newVideos });
    setVideoPreview([
      ...videoPreview,
      ...files.map(f => URL.createObjectURL(f))
    ]);
  };

  const checkVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const removeFile = (type, index) => {
    if (type === "cover") {
      setCoverPreview(null);
      setFormData({ ...formData, coverImage: null });
      setExistingImages([]);
    }
    if (type === "gallery") {
      const newGallery = [...formData.galleryImages];
      newGallery.splice(index, 1);
      setFormData({ ...formData, galleryImages: newGallery });
      
      const newPreview = [...galleryPreview];
      newPreview.splice(index, 1);
      setGalleryPreview(newPreview);
      
      // Also remove from existing if it was an existing image
      if (index < existingImages.length) {
        const newExisting = [...existingImages];
        newExisting.splice(index, 1);
        setExistingImages(newExisting);
      }
    }
    if (type === "video") {
      const newVideos = [...formData.videos];
      newVideos.splice(index, 1);
      setFormData({ ...formData, videos: newVideos });
      
      const newPreview = [...videoPreview];
      newPreview.splice(index, 1);
      setVideoPreview(newPreview);
      
      if (index < existingVideos.length) {
        const newExisting = [...existingVideos];
        newExisting.splice(index, 1);
        setExistingVideos(newExisting);
      }
    }
  };

  // ============= SUBMIT UPDATE =============
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstError = document.querySelector(".text-red-500");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(10);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("duration", formData.duration);
      data.append("travelers", formData.travelers);
      data.append("description", formData.description);
      data.append("highlights", formData.highlights || "");
      data.append("included", formData.included || "");
      data.append("excluded", formData.excluded || "");
      data.append("meetingPoint", formData.meetingPoint || "");
      data.append("cancellationPolicy", formData.cancellationPolicy || "");
      data.append("requirements", formData.requirements || ""); // ✅ ADDED

      // New cover image
      if (formData.coverImage instanceof File) {
        data.append("coverImage", formData.coverImage);
      }

      // New gallery images
      formData.galleryImages.forEach(img => {
        if (img instanceof File) {
          data.append("galleryImages", img);
        }
      });

      // New videos
      formData.videos.forEach(vid => {
        if (vid instanceof File) {
          data.append("videos", vid);
        }
      });

      // Track which existing files to keep
      data.append("existingImages", JSON.stringify(existingImages));
      data.append("existingVideos", JSON.stringify(existingVideos));

      await updateTour(id, data, token, (progress) => {
        setUploadProgress(progress);
      });

      setUploadProgress(100);
      alert("✅ Tour updated successfully!");
      navigate("/provider/tours");

    } catch (error) {
      console.error("❌ Update Tour Error:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to update tour"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============= LOADING =============
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading tour...</p>
      </div>
    );
  }

  // ============= RENDER =============
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D9488] via-[#F59E0B] to-[#374151] shadow-xl flex items-center justify-center mx-auto">
            <PlusCircle size={40} className="text-white" />
          </div>
          <h1 className="mt-5 text-4xl font-black text-[#374151] dark:text-white">
            Edit Tour
          </h1>
          <p className="text-gray-500 mt-2">
            Update your tour details and media
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* SUBMIT ERROR */}
          {errors.submit && (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl flex gap-2 items-center">
              <AlertCircle size={20} />
              {errors.submit}
            </div>
          )}

          {/* MAIN CARD */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 space-y-6">

            {/* TITLE */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Tour Title *
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Gorilla Trekking Adventure"
                className="w-full mt-2 h-12 rounded-xl border px-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.title}
                </p>
              )}
            </div>

            {/* LOCATION */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Location *
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Volcanoes National Park"
                className="w-full mt-2 h-12 rounded-xl border px-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.location}
                </p>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full mt-2 h-12 rounded-xl border px-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option>Adventure</option>
                <option>Wildlife</option>
                <option>Culture</option>
                <option>Luxury</option>
                <option>Hiking</option>
                <option>City Tour</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.category}
                </p>
              )}
            </div>

            {/* PRICE + DURATION */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300">
                  Price USD *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="500"
                  className="w-full mt-2 h-12 rounded-xl border px-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.price}
                  </p>
                )}
              </div>
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300">
                  Duration *
                </label>
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="3 Days 2 Nights"
                  className="w-full mt-2 h-12 rounded-xl border px-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.duration}
                  </p>
                )}
              </div>
            </div>

            {/* TRAVELERS */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Maximum Travelers *
              </label>
              <input
                type="number"
                name="travelers"
                value={formData.travelers}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="10"
                className="w-full mt-2 h-12 rounded-xl border px-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
              {errors.travelers && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.travelers}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="6"
                placeholder="Describe your experience..."
                className="w-full mt-2 rounded-xl border p-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.description}
                </p>
              )}
            </div>

            {/* HIGHLIGHTS */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Tour Highlights
              </label>
              <textarea
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                placeholder="Gorilla visit, Local food, Nature walk..."
                className="w-full mt-2 rounded-xl border p-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
            </div>

            {/* INCLUDED */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Included Services
              </label>
              <textarea
                name="included"
                value={formData.included}
                onChange={handleChange}
                placeholder="Transport, Guide, Meals..."
                className="w-full mt-2 rounded-xl border p-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
            </div>

            {/* EXCLUDED */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Excluded Services
              </label>
              <textarea
                name="excluded"
                value={formData.excluded}
                onChange={handleChange}
                placeholder="Flight tickets, Personal expenses..."
                className="w-full mt-2 rounded-xl border p-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
            </div>

            {/* COVER IMAGE */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Cover Image
              </label>
              {coverPreview && (
                <div className="relative mt-2">
                  <img
                    src={coverPreview}
                    className="h-56 w-full object-cover rounded-2xl"
                    alt="Cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile("cover")}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <div className="mt-2">
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#0D9488] transition-all duration-300">
                  <Upload className="w-5 h-5 text-[#0D9488]" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {coverPreview ? 'Change cover image' : 'Upload cover image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImage}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.coverImage && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.coverImage}
                </p>
              )}
            </div>

            {/* GALLERY */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Gallery Images (Maximum 15)
              </label>
              {galleryPreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                  {galleryPreview.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        className="h-24 w-full object-cover rounded-xl"
                        alt={`Gallery ${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("gallery", index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2">
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#0D9488] transition-all duration-300">
                  <ImageIcon className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {galleryPreview.length > 0 ? 'Add more images' : 'Upload gallery images'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGallery}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.galleryImages && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.galleryImages}
                </p>
              )}
            </div>

            {/* VIDEOS */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Videos (Maximum 3 / 5 Minutes)
              </label>
              {videoPreview.length > 0 && (
                <div className="space-y-3 mt-3">
                  {videoPreview.map((video, index) => (
                    <div key={index} className="relative group">
                      <video
                        src={video}
                        controls
                        className="w-full rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("video", index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2">
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#0D9488] transition-all duration-300">
                  <Video className="w-5 h-5 text-[#0D9488]" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {videoPreview.length > 0 ? 'Add more videos' : 'Upload videos'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideos}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.videos && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.videos}
                </p>
              )}
            </div>

            {/* MEETING POINT */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Meeting Point
              </label>
              <input
                name="meetingPoint"
                value={formData.meetingPoint}
                onChange={handleChange}
                placeholder="Kigali International Airport"
                className="w-full mt-2 h-12 rounded-xl border px-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
            </div>

            {/* CANCELLATION POLICY */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Cancellation Policy
              </label>
              <textarea
                name="cancellationPolicy"
                value={formData.cancellationPolicy}
                onChange={handleChange}
                placeholder="Free cancellation 24 hours before trip"
                className="w-full mt-2 rounded-xl border p-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
            </div>

            {/* ✅ REQUIREMENTS SECTION - ADDED */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="What travelers need to know before booking (visa, health, gear, etc.)"
                className="w-full mt-2 rounded-xl border p-4 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-400">
                List any special requirements for this tour (e.g., visa, physical fitness, equipment)
              </p>
            </div>

          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate("/provider/tours")}
              className="flex-1 h-14 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-14 rounded-2xl overflow-hidden bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-black text-lg shadow-xl shadow-[#0D9488]/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating {uploadProgress}%
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  Update Tour
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditTour;