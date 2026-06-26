// src/pages/ProviderRequest.jsx

import React, {
  useEffect,
  useState
} from "react";

import {
  Loader2,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Building2,
  User,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";

import {
  createProviderRequest,
  getMyProviderRequest
} from "../services/providerService";

import {
  useNavigate
} from "react-router-dom";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const ProviderRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [existing, setExisting] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    businessName: "",
    businessType: "",
    description: "",
    country: "",
    city: "",
    price: "",
    currency: "",
    availability: []
  });

  useEffect(() => {
    checkRequest();
  }, []);

  const checkRequest = async () => {
    try {
      const data = await getMyProviderRequest();
      setExisting(data.request);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!form.businessType.trim()) newErrors.businessType = 'Business type is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.price) newErrors.price = 'Price is required';
    if (form.price && Number(form.price) <= 0) newErrors.price = 'Price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        availability: form.availability
          .split(",")
          .map(item => item.trim())
          .filter(item => item)
      };

      await createProviderRequest(payload);
      setSubmitted(true);
      checkRequest();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || 'Failed to submit application');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // AFTER SUBMIT SUCCESS
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#0D9488]/10 dark:bg-[#0D9488]/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20 animate-ping" />
              <CheckCircle className="w-10 h-10 text-[#0D9488]" />
            </div>
          </div>

          <h1 className="text-3xl font-black mt-6 text-[#374151] dark:text-white">
            Application Submitted! 🎉
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-3">
            Your provider application has been sent to our team for review.
            You'll receive a notification once it's processed.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] font-bold border border-[#F59E0B]/20">
            <Clock className="w-4 h-4" />
            Pending Review
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-[#0D9488]">💡 What's next?</span><br />
              Our admin team will review your application within 24-48 hours.
              You can check your status anytime from your dashboard.
            </p>
          </div>

          <button
            onClick={() => navigate("/provider/status")}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300"
          >
            View Application Status
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // EXISTING REQUEST
  if (existing) {
    const statusColors = {
      pending: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
      approved: 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20',
      rejected: 'bg-red-100 text-red-600 border-red-200',
    };

    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#374151] dark:text-white">
                Provider Application
              </h1>
              <p className="text-sm text-gray-500">Status overview</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <span className="text-gray-500">Business</span>
              <span className="font-semibold text-[#374151] dark:text-white">
                {existing.businessName}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <span className="text-gray-500">Status</span>
              <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold capitalize border ${statusColors[existing.status] || statusColors.pending}`}>
                {existing.status}
              </span>
            </div>

            {existing.adminNotes && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  <span className="font-medium">Admin Notes:</span> {existing.adminNotes}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/provider/status")}
            className="mt-8 w-full bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300"
          >
            Check Status
          </button>
        </div>
      </div>
    );
  }

  // FORM
  const inputFields = [
    { name: 'fullName', label: 'Full Name', icon: User, placeholder: 'John Doe' },
    { name: 'phone', label: 'Phone', icon: Phone, placeholder: '+250 7XX XXX XXX' },
    { name: 'businessName', label: 'Business Name', icon: Building2, placeholder: 'Your Business Name' },
    { name: 'businessType', label: 'Business Type', icon: Building2, placeholder: 'Tour Operator, Hotel, etc.' },
    { name: 'country', label: 'Country', icon: MapPin, placeholder: 'Rwanda' },
    { name: 'city', label: 'City', icon: MapPin, placeholder: 'Kigali' },
    { name: 'price', label: 'Price (USD)', icon: DollarSign, placeholder: '100' },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#374151] dark:text-white">
              Become A Provider
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Grow your travel business with AI Tour Rwanda.
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={submit} className="mt-8 space-y-5 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl">
        {/* Input Fields */}
        {inputFields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-[#374151] dark:text-white mb-1.5">
                {field.label} {field.name !== 'currency' && '*'}
              </label>
              <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  } focus:ring-2 focus:ring-[#0D9488] focus:border-transparent dark:bg-gray-800 dark:text-white transition outline-none`}
                />
              </div>
              {errors[field.name] && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-[#374151] dark:text-white mb-1.5">
            Currency
          </label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent dark:bg-gray-800 dark:text-white transition outline-none"
          >
            <option value="">Select Currency</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="RWF">RWF - Rwandan Franc</option>
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-[#374151] dark:text-white mb-1.5">
            Availability
          </label>
          <input
            name="availability"
            placeholder="e.g. Monday, Tuesday, Wednesday"
            value={form.availability}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent dark:bg-gray-800 dark:text-white transition outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">Separate days with commas (e.g. Monday, Wednesday, Friday)</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#374151] dark:text-white mb-1.5">
            Description *
          </label>
          <textarea
            name="description"
            placeholder="Describe your travel service or business..."
            value={form.description}
            onChange={handleChange}
            rows="5"
            className={`w-full px-4 py-3.5 rounded-2xl border ${
              errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
            } h-32 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent dark:bg-gray-800 dark:text-white transition outline-none resize-none`}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300 text-lg flex items-center justify-center gap-2"
        >
          Submit Application
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ProviderRequest;