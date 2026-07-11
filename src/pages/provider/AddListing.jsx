// src/pages/provider/AddListing.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Video,
  FileText,
  PlusCircle,
  X,
  AlertCircle,
  CheckCircle,
  Upload,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Loader2,
  Utensils,
  Bed,
  Car,
  Music,
  ShoppingBag,
  Globe,
  ChevronDown,
  Info,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import { createListing } from "../../services/listingService";
import { getMyProviderProfile } from "../../services/providerService";
import { useAuth } from "../../contexts/AuthContext";
import {
  BIZ_CONFIG,
  SECTION_LABELS,
  getBusinessConfig,
  getBusinessTypeFromProvider,
  getDefaultListingType,
} from "../../config/listingConfigs";

// ── Brand tokens ─────────────────────────────────────────────────
const TEAL = "#0D9488";
const GOLD = "#F59E0B";
const SLATE = "#374151";

// ── Helpers ──────────────────────────────────────────────────────
const Label = ({ children, required, hint }) => (
  <div style={{ marginBottom: 6 }}>
    <label className="block text-sm font-bold text-[#374151] dark:text-white">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
    {hint && (
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
        {hint}
      </p>
    )}
  </div>
);

const Err = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle size={12} /> {msg}
    </p>
  ) : null;

// ── Input styles using CSS classes ─────────────────────────────
const inputClassName = (err) => `
  w-full h-12 px-3.5
  border-2 rounded-xl text-sm outline-none
  bg-white dark:bg-gray-800
  text-[#374151] dark:text-white
  ${err 
    ? 'border-red-500 dark:border-red-500' 
    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
  }
  focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488]
  transition-all duration-200
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  font-sans
`;

const selectClassName = (err) => `
  w-full h-12 pl-3.5 pr-10
  border-2 rounded-xl text-sm outline-none
  bg-white dark:bg-gray-800
  text-[#374151] dark:text-white
  ${err 
    ? 'border-red-500 dark:border-red-500' 
    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
  }
  focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488]
  transition-all duration-200
  appearance-none cursor-pointer
  font-sans
`;

const textareaClassName = (err) => `
  w-full px-3.5 py-3
  border-2 rounded-xl text-sm outline-none
  bg-white dark:bg-gray-800
  text-[#374151] dark:text-white
  ${err 
    ? 'border-red-500 dark:border-red-500' 
    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
  }
  focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488]
  transition-all duration-200
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  font-sans leading-relaxed resize-vertical min-h-[100px]
`;

const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
    {children}
  </div>
);

const SectionCard = ({ id, config, children }) => {
  const [open, setOpen] = useState(true);
  const cfg = SECTION_LABELS[id] || { label: id, icon: FileText };
  const Icon = cfg.icon;
  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer p-0 mb-5 dark:text-white"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center bg-[#0D9488]/10 dark:bg-[#0D9488]/20">
            <Icon size={17} color={config.accent} />
          </div>
          <span className="text-sm font-extrabold text-[#374151] dark:text-white">
            {cfg.label}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && children}
    </Card>
  );
};

// ── Upload zone ───────────────────────────────────────────────────
const UploadZone = ({
  label,
  hint,
  accept,
  multiple,
  onChange,
  icon: Icon,
  color = TEAL,
}) => (
  <label className={`
    flex items-center gap-3 p-3.5 rounded-xl
    border-2 border-dashed cursor-pointer transition-all duration-200
    ${color === TEAL ? 'border-[#0D9488]/30 dark:border-[#0D9488]/30 hover:border-[#0D9488] dark:hover:border-[#0D9488] bg-[#0D9488]/5 dark:bg-[#0D9488]/5 hover:bg-[#0D9488]/10 dark:hover:bg-[#0D9488]/10' : ''}
    ${color === GOLD ? 'border-[#F59E0B]/30 dark:border-[#F59E0B]/30 hover:border-[#F59E0B] dark:hover:border-[#F59E0B] bg-[#F59E0B]/5 dark:bg-[#F59E0B]/5 hover:bg-[#F59E0B]/10 dark:hover:bg-[#F59E0B]/10' : ''}
  `}>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[color]/15 dark:bg-[color]/20">
      <Icon size={20} color={color} />
    </div>
    <div>
      <div className="text-sm font-bold text-[#374151] dark:text-white">{label}</div>
      {hint && (
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{hint}</div>
      )}
    </div>
    <input
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={onChange}
      className="hidden"
    />
  </label>
);

// ================================================================
// MAIN COMPONENT
// ================================================================
const AddListing = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [providerProfile, setProviderProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Media
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [videoPreview, setVideoPreview] = useState([]);

  const [form, setForm] = useState({
    title: "",
    location: "",
    category: "",
    price: "",
    duration: "",
    capacity: "",
    description: "",
    highlights: "",
    included: "",
    excluded: "",
    amenities: "",
    menu: "",
    meetingPoint: "",
    cancellationPolicy: "",
    requirements: "",
    refundPolicy: "",
    listingType: "",
    coverImage: null,
    galleryImages: [],
    videos: [],
  });

  // ── Fetch provider profile ────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setProfileLoading(true);
        const data = await getMyProviderProfile();
        setProviderProfile(data.provider || data.request || null);
      } catch (e) {
        console.error("Could not load provider profile:", e);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, []);

  // Derive businessType & config
  const businessType = getBusinessTypeFromProvider(providerProfile);
  const bizCfg = getBusinessConfig(businessType);
  const BizIcon = bizCfg.icon;
  const activeSections = bizCfg.sections || [];

  // Set default listing type when business type changes
  useEffect(() => {
    if (businessType && !form.listingType) {
      const defaultType = getDefaultListingType(businessType);
      setForm((f) => ({ ...f, listingType: defaultType }));
    }
  }, [businessType, form.listingType]);

  // ── Validation ────────────────────────────────────────────────
  // ✅ UPDATED: Images 15MB, Videos 500MB
  const validate = useCallback(
    (name, value) => {
      if (name === "title") {
        if (!value?.trim()) return "Title is required";
        if (value.length < 5) return "At least 5 characters";
      }
      if (name === "location") {
        if (!value?.trim()) return "Location is required";
      }
      if (name === "category") {
        if (!value) return "Select a category";
      }
      if (name === "price") {
        if (!value) return "Price is required";
        if (Number(value) <= 0) return "Must be greater than 0";
      }
      if (name === "duration") {
        if (!value?.trim()) return "Duration is required";
      }
      if (name === "capacity") {
        if (!value) return "Required";
        if (Number(value) < 1) return "Invalid number";
      }
      if (name === "description") {
        if (!value?.trim()) return "Description is required";
        if (value.length < 30) return "At least 30 characters";
      }
      
      // ✅ UPDATED: Images 15MB, Videos 500MB
      if (name === "coverImage") {
        if (!value) return "Cover image is required";
        if (!value.type?.startsWith("image/")) return "Must be an image";
        if (value.size > 15 * 1024 * 1024) return "Max 15 MB";
      }
      if (name === "galleryImages") {
        if (value.length > 15) return "Max 15 images";
        if (value.some((f) => f.size > 15 * 1024 * 1024))
          return "Each image max 15 MB";
      }
      if (name === "videos") {
        if (value.length > 3) return "Max 3 videos";
        if (value.some((f) => f.size > 500 * 1024 * 1024))
          return "Each video max 500 MB";
      }
      return "";
    },
    []
  );

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name]) setErrors((e) => ({ ...e, [name]: validate(name, value) }));
  };
  const touch = (name, value) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validate(name, value) }));
  };

  const handleChange = (e) => set(e.target.name, e.target.value);
  const handleBlur = (e) => touch(e.target.name, e.target.value);

  // ── File handlers ─────────────────────────────────────────────
  const handleCover = (e) => {
    const file = e.target.files[0];
    const err = validate("coverImage", file);
    if (err) {
      setErrors((v) => ({ ...v, coverImage: err }));
      return;
    }
    set("coverImage", file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files);
    const err = validate("galleryImages", files);
    if (err) {
      setErrors((v) => ({ ...v, galleryImages: err }));
      return;
    }
    set("galleryImages", files);
    setGalleryPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const handleVideos = async (e) => {
    const files = Array.from(e.target.files);
    const err = validate("videos", files);
    if (err) {
      setErrors((v) => ({ ...v, videos: err }));
      return;
    }
    for (const f of files) {
      const dur = await new Promise((res) => {
        const v = document.createElement("video");
        v.preload = "metadata";
        v.onloadedmetadata = () => {
          URL.revokeObjectURL(v.src);
          res(v.duration);
        };
        v.src = URL.createObjectURL(f);
      });
      if (dur > 300) {
        setErrors((v) => ({ ...v, videos: "Each video max 5 minutes" }));
        return;
      }
    }
    set("videos", files);
    setVideoPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (type, index) => {
    if (type === "cover") {
      setCoverPreview(null);
      set("coverImage", null);
    }
    if (type === "gallery") {
      const n = form.galleryImages.filter((_, i) => i !== index);
      set("galleryImages", n);
      setGalleryPreview(n.map((f) => URL.createObjectURL(f)));
    }
    if (type === "video") {
      const n = form.videos.filter((_, i) => i !== index);
      set("videos", n);
      setVideoPreview(n.map((f) => URL.createObjectURL(f)));
    }
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = [
      "title",
      "location",
      "category",
      "price",
      "duration",
      "capacity",
      "description",
      "coverImage",
    ];
    const newErr = {};
    required.forEach((k) => {
      const e = validate(k, form[k]);
      if (e) newErr[k] = e;
    });
    setErrors(newErr);
    setTouched(Object.fromEntries(required.map((k) => [k, true])));
    if (Object.keys(newErr).length > 0) {
      document.getElementById("listing-form-top")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(10);

      const data = new FormData();
      const fields = [
        "title",
        "location",
        "category",
        "price",
        "duration",
        "capacity",
        "description",
        "highlights",
        "included",
        "excluded",
        "amenities",
        "menu",
        "meetingPoint",
        "cancellationPolicy",
        "requirements",
        "refundPolicy",
        "listingType",
      ];
      fields.forEach((k) => data.append(k, form[k] || ""));

      // Attach businessType from provider profile
      data.append("businessType", businessType);

      data.append("coverImage", form.coverImage);
      form.galleryImages.forEach((img) => data.append("galleryImages", img));
      form.videos.forEach((vid) => data.append("videos", vid));

      await createListing(data, token, (p) => setUploadProgress(p));

      setUploadProgress(100);
      setTimeout(() => navigate("/provider/listings"), 600);
    } catch (err) {
      console.error(err);
      setErrors({
        submit: err.response?.data?.message || "Failed to create. Please try again.",
      });
      setLoading(false);
    }
  };

  // ── Loading profile ───────────────────────────────────────────
  if (profileLoading)
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading your provider profile...
        </p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-5 pb-20 font-sans">
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
        input:focus,select:focus,textarea:focus{border-color:#0D9488!important;box-shadow:0 0 0 3px #0D948822!important}
      `}</style>

      <div
        id="listing-form-top"
        className="max-w-[760px] mx-auto animate-[fadeUp_.35s_ease]"
      >
        {/* ── PAGE HEADER ── */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: `linear-gradient(135deg, ${bizCfg.accent}, ${GOLD})`,
              boxShadow: `0 8px 24px ${bizCfg.accent}40`,
            }}
          >
            <BizIcon size={28} color="#fff" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#374151] dark:text-white m-0">
            Create New Listing
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            {providerProfile?.businessName ? (
              <>
                Listing for{" "}
                <strong style={{ color: bizCfg.accent }}>
                  {providerProfile.businessName}
                </strong>
              </>
            ) : (
              "Share your service with travelers on AI Tour"
            )}
          </p>
        </div>

        {/* ── PROVIDER PROFILE BANNER ── */}
        {providerProfile && (
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl mb-6 bg-[#0D9488]/10 dark:bg-[#0D9488]/10 border border-[#0D9488]/30 dark:border-[#0D9488]/30">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${bizCfg.accent}, ${GOLD})` }}
            >
              <BizIcon size={20} color="#fff" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-extrabold text-[#374151] dark:text-white">
                {providerProfile.businessName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {bizCfg.label} · {providerProfile.city}, {providerProfile.country}
                {providerProfile.languages?.length
                  ? ` · ${providerProfile.languages.slice(0, 3).join(", ")}`
                  : ""}
              </div>
            </div>
            <div className="text-xs font-bold text-[#0D9488] dark:text-[#0D9488] bg-[#0D9488]/15 dark:bg-[#0D9488]/20 px-3 py-1 rounded-full border border-[#0D9488]/30 dark:border-[#0D9488]/30">
              Verified Provider ✓
            </div>
          </div>
        )}

        {/* ── TIP BANNER ── */}
        <div className="flex gap-2.5 items-start p-3 rounded-xl mb-6 bg-[#F59E0B]/10 dark:bg-[#F59E0B]/10 border border-[#F59E0B]/30 dark:border-[#F59E0B]/30">
          <Info size={16} color={GOLD} className="flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#92400E] dark:text-[#F59E0B] m-0 leading-relaxed">
            <strong>💡 Tip for {bizCfg.label}:</strong> {bizCfg.tip}
          </p>
        </div>

        {/* ── SUBMIT ERROR ── */}
        {errors.submit && (
          <div className="flex items-center gap-2 p-3 rounded-xl mb-5 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} /> {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ════════════════════════════════════
              SECTION: BASIC INFO
          ════════════════════════════════════ */}
          {activeSections.includes("basic") && (
            <SectionCard id="basic" config={bizCfg}>
              {/* Listing Type */}
              <div className="mb-4">
                <Label required hint="Select the type of listing you're creating">
                  Listing Type
                </Label>
                <div className="relative">
                  <select
                    name="listingType"
                    value={form.listingType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={selectClassName(!!errors.listingType)}
                  >
                    <option value="">Select listing type...</option>
                    {bizCfg.listingTypes?.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                  />
                </div>
                <Err msg={errors.listingType} />
              </div>

              {/* Title */}
              <div className="mb-4">
                <Label required hint="A clear, descriptive title travelers will see first">
                  Listing Title
                </Label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={`e.g. ${bizCfg.categories?.[0] || "Amazing Experience"}`}
                  className={inputClassName(!!errors.title)}
                />
                <Err msg={errors.title} />
              </div>

              {/* Location */}
              <div className="mb-4">
                <Label required>Location</Label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  />
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Musanze, Northern Rwanda"
                    className={`${inputClassName(!!errors.location)} pl-10`}
                  />
                </div>
                <Err msg={errors.location} />
              </div>

              {/* Category */}
              <div className="mb-4">
                <Label required hint={`Categories for ${bizCfg.label}`}>
                  Category
                </Label>
                <div className="relative">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={selectClassName(!!errors.category)}
                  >
                    <option value="">Select category...</option>
                    {bizCfg.categories?.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                  />
                </div>
                <Err msg={errors.category} />
              </div>

              {/* Price + Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <Label required>{bizCfg.pricingLabel || "Price"}</Label>
                  <div className="relative">
                    <DollarSign
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    />
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="150"
                      className={`${inputClassName(!!errors.price)} pl-9`}
                    />
                  </div>
                  <Err msg={errors.price} />
                </div>
                <div>
                  <Label required>{bizCfg.durationLabel || "Duration"}</Label>
                  <div className="relative">
                    <Clock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    />
                    <input
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="2 Days / 1 Night"
                      className={`${inputClassName(!!errors.duration)} pl-9`}
                    />
                  </div>
                  <Err msg={errors.duration} />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <Label required hint="Maximum number of people per booking">
                  {bizCfg.capacityLabel || "Capacity"}
                </Label>
                <div className="relative">
                  <Users
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  />
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="8"
                    className={`${inputClassName(!!errors.capacity)} pl-9`}
                  />
                </div>
                <Err msg={errors.capacity} />
              </div>
            </SectionCard>
          )}

          {/* ════════════════════════════════════
              SECTION: MEDIA
          ════════════════════════════════════ */}
          {activeSections.includes("media") && (
            <SectionCard id="media" config={bizCfg}>
              {/* Cover image */}
              <div className="mb-4.5">
                <Label required hint="Main image shown in search results (max 15 MB)">
                  Cover Image
                </Label>
                {!coverPreview ? (
                  <UploadZone
                    label="Upload Cover Image"
                    hint="JPG, PNG, WEBP · Max 15 MB"
                    accept="image/*"
                    onChange={handleCover}
                    icon={Camera}
                    color={bizCfg.accent}
                  />
                ) : (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={coverPreview}
                      alt="Cover"
                      className="w-full h-[220px] object-cover block"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("cover")}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-500 border-none cursor-pointer flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <X size={16} color="#fff" />
                    </button>
                  </div>
                )}
                <Err msg={errors.coverImage} />
              </div>

              {/* Gallery */}
              <div className="mb-4.5">
                <Label hint="Up to 15 photos showing different aspects of your listing">
                  Gallery Images
                </Label>
                <UploadZone
                  label="Upload Gallery Photos"
                  hint="Multiple selection · Max 15 images · 15 MB each"
                  accept="image/*"
                  multiple
                  onChange={handleGallery}
                  icon={ImageIcon}
                  color={GOLD}
                />
                <Err msg={errors.galleryImages} />
                {galleryPreview.length > 0 && (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2 mt-3">
                    {galleryPreview.map((img, i) => (
                      <div
                        key={i}
                        className="relative h-20 rounded-xl overflow-hidden"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFile("gallery", i)}
                          className="absolute top-1 right-1 w-5.5 h-5.5 rounded-full bg-red-500 border-none cursor-pointer flex items-center justify-center hover:bg-red-600 transition"
                        >
                          <X size={11} color="#fff" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos */}
              <div>
                <Label hint="Up to 3 videos · Max 5 min each · Max 500 MB each">
                  Videos (optional)
                </Label>
                <UploadZone
                  label="Upload Listing Videos"
                  hint="MP4, MOV · Max 3 videos · 5 min limit · 500 MB each"
                  accept="video/*"
                  multiple
                  onChange={handleVideos}
                  icon={Video}
                  color={bizCfg.accent}
                />
                <Err msg={errors.videos} />
                {videoPreview.length > 0 && (
                  <div className="flex flex-col gap-2.5 mt-3">
                    {videoPreview.map((vid, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden">
                        <video
                          src={vid}
                          controls
                          className="w-full rounded-xl max-h-[240px] bg-black"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("video", i)}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-500 border-none cursor-pointer flex items-center justify-center hover:bg-red-600 transition"
                        >
                          <X size={15} color="#fff" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* ════════════════════════════════════
              SECTION: DESCRIPTION
          ════════════════════════════════════ */}
          {activeSections.includes("description") && (
            <SectionCard id="description" config={bizCfg}>
              <Label required hint="At least 30 characters — describe the full experience">
                About This Listing
              </Label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tell travelers what makes this experience special, what they'll see and do..."
                rows={6}
                className={textareaClassName(!!errors.description)}
              />
              <div className="flex justify-between items-center mt-1">
                <Err msg={errors.description} />
                <span className={`text-xs ${form.description.length < 30 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  {form.description.length} / 30 min
                </span>
              </div>
            </SectionCard>
          )}

          {/* ════════════════════════════════════
              SECTION: HIGHLIGHTS
          ════════════════════════════════════ */}
          {activeSections.includes("highlights") && (
            <SectionCard id="highlights" config={bizCfg}>
              <Label hint="List key highlights, one per line">Key Highlights</Label>
              <textarea
                name="highlights"
                value={form.highlights}
                onChange={handleChange}
                placeholder={
                  "Gorilla permit included\nExpert ranger guide\nLunch at mountain lodge\n..."
                }
                rows={5}
                className={textareaClassName(false)}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Each line = one highlight bullet shown on the listing page
              </p>
            </SectionCard>
          )}

          {/* ════════════════════════════════════
              SECTION: AMENITIES
          ════════════════════════════════════ */}
          {activeSections.includes("amenities") && (
            <SectionCard id="amenities" config={bizCfg}>
              <Label hint="List amenities one per line — WiFi, Pool, Restaurant, etc.">
                Amenities & Features
              </Label>
              <textarea
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                placeholder={
                  "Free WiFi\nSwimming pool\nAir conditioning\nBreakfast included\nAirport shuttle\n..."
                }
                rows={5}
                className={textareaClassName(false)}
              />
            </SectionCard>
          )}

          {/* ════════════════════════════════════
              SECTION: MENU
          ════════════════════════════════════ */}
          {activeSections.includes("menu") && (
            <SectionCard id="menu" config={bizCfg}>
              <Label hint="Describe signature dishes, menu categories, or notable offerings">
                Menu & Offerings
              </Label>
              <textarea
                name="menu"
                value={form.menu}
                onChange={handleChange}
                placeholder={
                  "Signature Dish: Isombe with Ugali\nLocal Rwandan breakfast\nVegan options available\nFull bar service\n..."
                }
                rows={5}
                className={textareaClassName(false)}
              />
            </SectionCard>
          )}

          {/* ════════════════════════════════════
              SECTION: INCLUDED
          ════════════════════════════════════ */}
          {activeSections.includes("included") && (
            <SectionCard id="included" config={bizCfg}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label hint="One item per line">What's Included</Label>
                  <textarea
                    name="included"
                    value={form.included}
                    onChange={handleChange}
                    placeholder={"Gorilla permit\nRanger guide\nLunch\nTransport\n..."}
                    rows={5}
                    className={textareaClassName(false)}
                  />
                </div>
                <div>
                  <Label hint="One item per line">What's Not Included</Label>
                  <textarea
                    name="excluded"
                    value={form.excluded}
                    onChange={handleChange}
                    placeholder={
                      "International flights\nTravel insurance\nPersonal expenses\n..."
                    }
                    rows={5}
                    className={textareaClassName(false)}
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {/* ════════════════════════════════════
              SECTION: REQUIREMENTS
          ════════════════════════════════════ */}
          {activeSections.includes("requirements") && (
            <SectionCard id="requirements" config={bizCfg}>
              <Label hint="Physical fitness, visa, gear, age limits, health requirements, etc.">
                Requirements & Important Notes
              </Label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                placeholder={
                  "Moderate physical fitness required\nValid passport\nWarm clothing for mountain weather\nAge 15+ required\n..."
                }
                rows={5}
                className={textareaClassName(false)}
              />
            </SectionCard>
          )}

          {/* ════════════════════════════════════
              SECTION: LOGISTICS
          ════════════════════════════════════ */}
          {activeSections.includes("logistics") && (
            <SectionCard id="logistics" config={bizCfg}>
              <div className="mb-4">
                <Label hint={bizCfg.meetingLabel || "Meeting Point"}>
                  {bizCfg.meetingLabel || "Meeting Point"}
                </Label>
                <div className="relative">
                  <MapPin
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  />
                  <input
                    name="meetingPoint"
                    value={form.meetingPoint}
                    onChange={handleChange}
                    placeholder="e.g. Kigali Serena Hotel Lobby"
                    className={`${inputClassName(false)} pl-9`}
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {/* ════════════════════════════════════
              SECTION: POLICY
          ════════════════════════════════════ */}
          {activeSections.includes("policy") && (
            <SectionCard id="policy" config={bizCfg}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Cancellation Policy</Label>
                  <textarea
                    name="cancellationPolicy"
                    value={form.cancellationPolicy}
                    onChange={handleChange}
                    placeholder="Free cancellation 48 hours before the tour starts..."
                    rows={4}
                    className={textareaClassName(false)}
                  />
                </div>
                <div>
                  <Label>Refund Policy</Label>
                  <textarea
                    name="refundPolicy"
                    value={form.refundPolicy}
                    onChange={handleChange}
                    placeholder={
                      "Full refund if cancelled 7+ days prior. 50% refund 3–6 days prior..."
                    }
                    rows={4}
                    className={textareaClassName(false)}
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {/* ── SUBMIT ── */}
          <div className="sticky bottom-5 z-10">
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 border-none rounded-xl font-extrabold text-base flex items-center justify-center gap-2.5 transition-all duration-200 font-sans ${
                loading
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : `text-white shadow-lg hover:scale-[1.015]`
              }`}
              style={{
                background: loading 
                  ? undefined 
                  : `linear-gradient(135deg, ${bizCfg.accent} 0%, ${GOLD} 100%)`,
                boxShadow: loading 
                  ? undefined 
                  : `0 6px 24px ${bizCfg.accent}45`,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Uploading {uploadProgress}%...
                </>
              ) : (
                <>
                  <Zap size={20} /> Publish Listing — {bizCfg.label}
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
              Your listing will be reviewed by AI Tour admin before going live.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;