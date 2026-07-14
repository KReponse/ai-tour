// src/pages/provider/ProfileEdit.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Loader2,
  ArrowLeft,
  Save,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  Clock,
  Languages,
  Award,
  Sparkles,
  AlertCircle,
  CheckCircle,
  XCircle,
  Upload,
  X,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// ===============================
// AI TOUR COLORS
// ===============================
const TEAL = "#0D9488";
const GOLD = "#F59E0B";
const SLATE = "#374151";

// ✅ FIX: API_URL should NOT include /api at the end
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Static options ──────────────────────────────────────────────
const LANGUAGES_LIST = ["English", "French", "Kinyarwanda", "Swahili", "German", "Spanish", "Chinese", "Arabic"];
const SPECIALIZATIONS = ["Wildlife & Safari", "Mountain Trekking", "Cultural Tours", "City Tours", "Water Activities", "Photography Tours", "Family Tours", "Luxury Travel", "Budget Travel", "Adventure Sports"];

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ✅ Only editable fields
const EMPTY_FORM = {
  description: "",
  city: "",
  languages: [],
  specializations: [],
  yearsOfExperience: "",
  logo: null,
  coverImage: null,
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  youtube: "",
  tiktok: "",
  businessHours: {
    monday: { open: "08:00", close: "18:00", closed: false },
    tuesday: { open: "08:00", close: "18:00", closed: false },
    wednesday: { open: "08:00", close: "18:00", closed: false },
    thursday: { open: "08:00", close: "18:00", closed: false },
    friday: { open: "08:00", close: "18:00", closed: false },
    saturday: { open: "08:00", close: "18:00", closed: false },
    sunday: { open: "08:00", close: "18:00", closed: false }
  },
  phone: "",
  email: "",
  existingLogo: "",
  existingCoverImage: "",
};

const ProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      // ✅ FIX: API_URL already has http://localhost:5000, don't add /api twice
      const response = await axios.get(`${API_URL}/api/provider-profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const profile = response.data.profile;
        
        // ✅ Store non-editable fields separately (display only)
        setBusinessName(profile.businessName || '');
        setBusinessType(profile.businessType || '');
        setCountry(profile.country || 'Rwanda');
        
        // ✅ Only editable fields
        setForm({
          description: profile.description || "",
          city: profile.city || "",
          languages: profile.languages || [],
          specializations: profile.specializations || [],
          yearsOfExperience: profile.yearsOfExperience || "",
          logo: null,
          coverImage: null,
          facebook: profile.socialLinks?.facebook || "",
          instagram: profile.socialLinks?.instagram || "",
          twitter: profile.socialLinks?.twitter || "",
          linkedin: profile.socialLinks?.linkedin || "",
          youtube: profile.socialLinks?.youtube || "",
          tiktok: profile.socialLinks?.tiktok || "",
          businessHours: profile.businessHours || EMPTY_FORM.businessHours,
          phone: profile.phone || "",
          email: profile.email || "",
          existingLogo: profile.logo || "",
          existingCoverImage: profile.coverImage || "",
        });

        if (profile.logo) {
          setLogoPreview(`${API_URL}/uploads/${profile.logo}`);
        }
        if (profile.coverImage) {
          setCoverPreview(`${API_URL}/uploads/${profile.coverImage}`);
        }
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 404) {
        setError('Provider profile not found. Please complete your application first.');
      } else {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
  };

  const handleChange = (e) => {
    set(e.target.name, e.target.value);
  };

  const handleCheckboxGroup = (key, value) => {
    const current = form[key] || [];
    if (current.includes(value)) {
      set(key, current.filter(v => v !== value));
    } else {
      set(key, [...current, value]);
    }
  };

  const handleBusinessHours = (day, field, value) => {
    setForm(f => ({
      ...f,
      businessHours: {
        ...f.businessHours,
        [day]: { ...f.businessHours[day], [field]: value }
      }
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, coverImage: file });
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setForm({ ...form, logo: null });
  };

  const removeCover = () => {
    setCoverPreview(null);
    setForm({ ...form, coverImage: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // ✅ Only send editable fields
      const editableFields = [
        'description', 'city', 'yearsOfExperience',
        'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok',
        'phone', 'email'
      ];

      editableFields.forEach(key => {
        if (form[key] !== undefined && form[key] !== null && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });

      // ✅ Arrays - send as JSON strings
      formData.append('languages', JSON.stringify(form.languages));
      formData.append('specializations', JSON.stringify(form.specializations));
      formData.append('businessHours', JSON.stringify(form.businessHours));

      // ✅ Files
      if (form.logo instanceof File) {
        formData.append('logo', form.logo);
      }
      if (form.coverImage instanceof File) {
        formData.append('coverImage', form.coverImage);
      }

      // ✅ DO NOT send businessName, businessType, country - they are NOT editable

      // ✅ FIX: API_URL already has http://localhost:5000, don't add /api twice
      const response = await axios.put(
        `${API_URL}/api/provider-profiles/me`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ✅ Do NOT set Content-Type - axios will set it for FormData
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/provider/profile');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
            {error.includes('application') ? 'Application Required' : 'Error Loading Profile'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {error.includes('application') ? (
              <button
                onClick={() => navigate('/provider/request')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold hover:scale-[1.02] transition"
              >
                Complete Application
              </button>
            ) : (
              <button
                onClick={fetchProfile}
                className="px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-bold hover:bg-[#0D9488]/80 transition"
              >
                Retry
              </button>
            )}
            <button
              onClick={() => navigate('/provider/profile')}
              className="px-6 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#374151] dark:text-white">Edit Business Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Update your business information</p>
        </div>
        <button
          onClick={() => navigate('/provider/profile')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-[#0D9488]/10 border border-[#0D9488]/20 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#0D9488]" />
          <span className="text-[#0D9488] font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="mb-6 p-4 rounded-2xl bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-600 dark:text-red-400">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ─── NON-EDITABLE INFO (Display Only) ─── */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#9CA3AF]" />
            Business Identity <span className="text-sm font-normal text-gray-400">(Read Only)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Business Name</p>
              <p className="font-semibold text-[#374151] dark:text-white">{businessName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Business Type</p>
              <p className="font-semibold text-[#374151] dark:text-white capitalize">{businessType?.replace('_', ' ') || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Country</p>
              <p className="font-semibold text-[#374151] dark:text-white">{country || '—'}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Contact your admin to change these details.</p>
        </div>

        {/* ─── BASIC INFORMATION ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0D9488]" />
            Business Description
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#374151] dark:text-white mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition resize-vertical"
                placeholder="Describe your business and services..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#374151] dark:text-white mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition"
                placeholder="Kigali"
              />
            </div>
          </div>
        </div>

        {/* ─── CONTACT INFORMATION ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#F59E0B]" />
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#374151] dark:text-white mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition"
                  placeholder="info@yourbusiness.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#374151] dark:text-white mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition"
                  placeholder="+250 7XX XXX XXX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── LANGUAGES & SPECIALIZATIONS ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-6 flex items-center gap-2">
            <Languages className="w-5 h-5 text-[#0D9488]" />
            Skills & Expertise
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#374151] dark:text-white mb-2">
                Languages Spoken
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES_LIST.map(lang => {
                  const active = form.languages?.includes(lang) || false;
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleCheckboxGroup('languages', lang)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        active
                          ? 'bg-[#0D9488] text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {active && '✓ '}{lang}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#374151] dark:text-white mb-2">
                Specializations
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map(spec => {
                  const active = form.specializations?.includes(spec) || false;
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => handleCheckboxGroup('specializations', spec)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        active
                          ? 'bg-[#F59E0B] text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {active && '✓ '}{spec}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#374151] dark:text-white mb-1.5">
                Years of Experience
              </label>
              <select
                name="yearsOfExperience"
                value={form.yearsOfExperience}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition"
              >
                <option value="">Select...</option>
                {["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years"].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ─── BRANDING ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0D9488]" />
            Branding
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div>
              <label className="block text-sm font-bold text-[#374151] dark:text-white mb-2">
                Logo
              </label>
              <div className="relative">
                {logoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.alt = 'No logo';
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#0D9488] transition">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-bold text-[#374151] dark:text-white mb-2">
                Cover Image
              </label>
              <div className="relative">
                {coverPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={coverPreview}
                      alt="Cover"
                      className="w-48 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.alt = 'No cover';
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeCover}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-48 h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#0D9488] transition">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── SOCIAL MEDIA ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#0D9488]" />
            Social Media
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'facebook', icon: Facebook, label: 'Facebook' },
              { key: 'instagram', icon: Instagram, label: 'Instagram' },
              { key: 'twitter', icon: Twitter, label: 'X / Twitter' },
              { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
              { key: 'youtube', icon: Youtube, label: 'YouTube' },
              { key: 'tiktok', icon: Youtube, label: 'TikTok' },
            ].map(({ key, icon: Icon, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    name={key}
                    value={form[key] || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition"
                    placeholder={`https://${key}.com/your-profile`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── BUSINESS HOURS ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#F59E0B]" />
            Business Hours
          </h2>

          <div className="space-y-3">
            {DAYS.map((day, idx) => {
              const hours = form.businessHours?.[day] || { open: "08:00", close: "18:00", closed: false };
              return (
                <div key={day} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-wrap">
                  <span className="font-semibold text-sm text-[#374151] dark:text-white w-[85px]">
                    {DAY_LABELS[idx]}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={hours.closed}
                      onChange={() => handleBusinessHours(day, "closed", !hours.closed)}
                      className="accent-[#0D9488]"
                    />
                    Closed
                  </label>
                  {!hours.closed && (
                    <>
                      <input
                        type="time"
                        value={hours.open || "08:00"}
                        onChange={(e) => handleBusinessHours(day, "open", e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white text-sm focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition"
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">to</span>
                      <input
                        type="time"
                        value={hours.close || "18:00"}
                        onChange={(e) => handleBusinessHours(day, "close", e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white text-sm focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── SUBMIT BUTTON ─── */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/provider/profile')}
            className="h-14 px-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;