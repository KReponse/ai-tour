// src/pages/provider/AddTour.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, DollarSign, Clock, Users, Video, FileText,
  PlusCircle, X, AlertCircle, CheckCircle, Upload,
  Sparkles, Camera, Image as ImageIcon, Loader2
} from "lucide-react";
import { createTour } from "../../services/tourService";
import { useAuth } from "../../contexts/AuthContext";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const AddTour = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [videoPreview, setVideoPreview] = useState([]);
  const [formData, setFormData] = useState({
    title: "", location: "", category: "", price: "",
    duration: "", travelers: "", description: "",
    highlights: "", included: "", excluded: "",
    meetingPoint: "", cancellationPolicy: "",
    requirements: "", // ✅ ADDED
    coverImage: null, galleryImages: [], videos: []
  });

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
      case "coverImage":
        if (!value) return "Cover image is required";
        if (!value.type?.startsWith("image/")) return "File must be an image";
        if (value.size > 5 * 1024 * 1024) return "Image must be below 5MB";
        return "";
      case "galleryImages":
        if (value.length > 15) return "Maximum 15 images allowed";
        for (const img of value) {
          if (img.size > 5 * 1024 * 1024) return "Each image must be below 5MB";
        }
        return "";
      case "videos":
        if (value.length > 3) return "Maximum 3 videos allowed";
        for (const video of value) {
          if (video.size > 100 * 1024 * 1024) return "Each video must be below 100MB";
        }
        return "";
      default:
        return "";
    }
  };

  // ============= VIDEO DURATION =============
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

  // ============= HANDLE TEXT INPUT =============
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  // ============= BLUR VALIDATION =============
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // ============= COVER IMAGE =============
  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    const error = validateField("coverImage", file);
    if (error) {
      setErrors({ ...errors, coverImage: error });
      return;
    }
    setFormData({ ...formData, coverImage: file });
    setCoverPreview(URL.createObjectURL(file));
  };

  // ============= GALLERY =============
  const handleGallery = (e) => {
    const files = Array.from(e.target.files);
    const error = validateField("galleryImages", files);
    if (error) {
      setErrors({ ...errors, galleryImages: error });
      return;
    }
    setFormData({ ...formData, galleryImages: files });
    setGalleryPreview(files.map(f => URL.createObjectURL(f)));
  };

  // ============= VIDEOS =============
  const handleVideos = async (e) => {
    const files = Array.from(e.target.files);
    const error = validateField("videos", files);
    if (error) {
      setErrors({ ...errors, videos: error });
      return;
    }
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
    setFormData({ ...formData, videos: files });
    setVideoPreview(files.map(f => URL.createObjectURL(f)));
  };

  // ============= REMOVE FILE =============
  const removeFile = (type, index) => {
    if (type === "cover") {
      setCoverPreview(null);
      setFormData({ ...formData, coverImage: null });
    }
    if (type === "gallery") {
      const newGallery = [...formData.galleryImages];
      newGallery.splice(index, 1);
      setFormData({ ...formData, galleryImages: newGallery });
      setGalleryPreview(newGallery.map(f => URL.createObjectURL(f)));
    }
    if (type === "video") {
      const newVideos = [...formData.videos];
      newVideos.splice(index, 1);
      setFormData({ ...formData, videos: newVideos });
      setVideoPreview(newVideos.map(f => URL.createObjectURL(f)));
    }
  };

  // ============= SUBMIT =============
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
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
      setLoading(true);
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
      data.append("coverImage", formData.coverImage);

      formData.galleryImages.forEach(img => data.append("galleryImages", img));
      formData.videos.forEach(vid => data.append("videos", vid));

      // ✅ Backend will set provider from req.user and status to pending
      const response = await createTour(data, token, (progress) => {
        setUploadProgress(progress);
      });

      console.log("✅ Tour created:", response);

      setUploadProgress(100);
      alert("✅ Tour created successfully. Waiting for admin approval.");
      
      // ✅ Navigate to My Tours
      navigate("/provider/tours");

      // Reset form
      setFormData({
        title: "", location: "", category: "", price: "",
        duration: "", travelers: "", description: "",
        highlights: "", included: "", excluded: "",
        meetingPoint: "", cancellationPolicy: "",
        requirements: "", // ✅ ADDED
        coverImage: null, galleryImages: [], videos: []
      });
      setCoverPreview(null);
      setGalleryPreview([]);
      setVideoPreview([]);
      setErrors({});
      setTouched({});

    } catch (error) {
      console.error("❌ Create Tour Error:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to create tour"
      });
    } finally {
      setLoading(false);
    }
  };

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
            Create New Tour
          </h1>
          <p className="text-gray-500 mt-2">
            Share amazing Rwanda experiences with travelers
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
                Cover Image *
              </label>
              <div className="mt-2">
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#0D9488] transition-all duration-300">
                  <Upload className="w-5 h-5 text-[#0D9488]" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Click to upload cover image
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
              {coverPreview && (
                <div className="relative mt-4">
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
            </div>

            {/* GALLERY */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Gallery Images (Maximum 15)
              </label>
              <div className="mt-2">
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#0D9488] transition-all duration-300">
                  <ImageIcon className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Click to upload gallery images
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
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
            </div>

            {/* VIDEOS */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Videos (Maximum 3 / 5 Minutes)
              </label>
              <div className="mt-2">
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#0D9488] transition-all duration-300">
                  <Video className="w-5 h-5 text-[#0D9488]" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Click to upload videos
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
              <div className="space-y-4 mt-4">
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
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full h-14 rounded-2xl overflow-hidden bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-black text-lg shadow-xl shadow-[#0D9488]/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading {uploadProgress}%
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Publish Tour
                </>
              )}
            </span>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddTour;