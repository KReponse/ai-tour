// src/pages/ProviderRequest.jsx

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Loader2, CheckCircle, ArrowRight, ArrowLeft, Sparkles,
  Building2, User, Phone, MapPin, DollarSign, Clock,
  AlertCircle, FileText, Globe, Shield, BadgeCheck,
  ChevronDown, Briefcase, CreditCard, Languages,
  Mail, Instagram, Facebook, Linkedin, Youtube, Twitter,
  Upload, Camera, Image as ImageIcon, X, Calendar,
  BookOpen, Info, CheckSquare,
  Trash2, Eye, Download, Video,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { createProviderRequest, getMyProviderRequest } from "../services/providerService";
import { useNavigate } from "react-router-dom";

// ── Brand tokens ─────────────────────────────────────────────────
const TEAL = "#0D9488";
const GOLD = "#F59E0B";
const SLATE = "#374151";

// ── Static options ──────────────────────────────────────────────
const BUSINESS_TYPES = [
  { value: "tour_operator", label: "Tour Operator" },
  { value: "hotel", label: "Hotel" },
  { value: "lodge", label: "Lodge / Eco-Camp" },
  { value: "restaurant", label: "Restaurant" },
  { value: "transport", label: "Transport / Transfer" },
  { value: "guide", label: "Tour Guide" },
  { value: "events", label: "Events & Activities" },
  { value: "cafe", label: "Café / Coffee Shop" },
  { value: "shop", label: "Souvenir / Craft Shop" },
  { value: "other", label: "Other" },
];

const AVAILABILITY_OPTIONS = [
  { value: "Monday-Friday", label: "Monday – Friday" },
  { value: "Monday-Saturday", label: "Monday – Saturday" },
  { value: "Monday-Sunday", label: "Every Day (Mon – Sun)" },
  { value: "Weekends", label: "Weekends Only" },
  { value: "Weekdays", label: "Weekdays Only" },
  { value: "24/7", label: "24 / 7" },
];

const CURRENCIES = [
  { value: "USD", label: "USD – US Dollar" },
  { value: "EUR", label: "EUR – Euro" },
  { value: "GBP", label: "GBP – British Pound" },
  { value: "RWF", label: "RWF – Rwandan Franc" },
];

const LANGUAGES_LIST = ["English", "French", "Kinyarwanda", "Swahili", "German", "Spanish", "Chinese", "Arabic"];
const SPECIALIZATIONS = ["Wildlife & Safari", "Mountain Trekking", "Cultural Tours", "City Tours", "Water Activities", "Photography Tours", "Family Tours", "Luxury Travel", "Budget Travel", "Adventure Sports"];

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Business", icon: Building2 },
  { id: 3, label: "Legal", icon: Shield },
  { id: 4, label: "Profile", icon: Sparkles },
  { id: 5, label: "Payment", icon: CreditCard },
  { id: 6, label: "Terms", icon: BadgeCheck },
];

// ── EMPTY FORM ──────────────────────────────────────────────────
const EMPTY_FORM = {
  fullName: "",
  phone: "",
  whatsapp: "",
  nationality: "",
  businessEmail: "",
  alternatePhone: "",
  businessName: "",
  businessType: "",
  country: "Rwanda",
  province: "",
  district: "",
  city: "",
  street: "",
  googleMaps: "",
  businessPhone: "",
  businessAddress: "",
  price: "",
  currency: "USD",
  availability: "",
  website: "",
  nationalId: "",
  tinNumber: "",
  rdbRegistration: "",
  tourismLicense: "",
  nationalIdFile: null,
  passportFile: null,
  rdbCertificateFile: null,
  tinCertificateFile: null,
  tourismLicenseFile: null,
  businessRegistrationFile: null,
  insuranceFile: null,
  description: "",
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
  paymentMethod: "mobile_money",
  bankName: "",
  accountName: "",
  accountNumber: "",
  swiftCode: "",
  mobileMoney: "",
  paymentCurrency: "USD",
  agreeToTerms: false,
  agreeToPrivacy: false,
  agreeToConduct: false,
  agreeToCommission: false,
  agreeToTourism: false,
  agreeToAccurate: false,
};

// ── Components ──────────────────────────────────────────────────

const Label = ({ children, required }) => (
  <label className="block text-sm font-bold text-[#374151] dark:text-white mb-1.5">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const ErrMsg = ({ msg }) => msg ? (
  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
    <AlertCircle size={12} /> {msg}
  </p>
) : null;

const inputClassName = (hasErr) => `
  w-full h-12 pl-11 pr-4
  border-2 rounded-xl text-sm outline-none
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  ${hasErr 
    ? 'border-red-500 dark:border-red-500' 
    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
  }
  focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488]
  transition-all duration-200
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  font-sans
`;

const selectClassName = (hasErr) => `
  w-full h-12 pl-11 pr-10
  border-2 rounded-xl text-sm outline-none
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  ${hasErr 
    ? 'border-red-500 dark:border-red-500' 
    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
  }
  focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488]
  transition-all duration-200
  appearance-none cursor-pointer
  font-sans
`;

const textareaClassName = (hasErr) => `
  w-full px-4 py-3
  border-2 rounded-xl text-sm outline-none
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  ${hasErr 
    ? 'border-red-500 dark:border-red-500' 
    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
  }
  focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488]
  transition-all duration-200
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  font-sans leading-relaxed resize-vertical min-h-[100px]
`;

const IconWrap = ({ icon: Icon }) => (
  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
    <Icon size={17} />
  </div>
);

const Field = ({ label, icon, error, required, children }) => (
  <div>
    <Label required={required}>{label}</Label>
    <div className="relative">
      {icon && <IconWrap icon={icon} />}
      {children}
    </div>
    <ErrMsg msg={error} />
  </div>
);

const TextInput = ({ icon, error, className = "", ...props }) => (
  <Field label={props.label} icon={icon} error={error} required={props.required}>
    <input 
      {...props} 
      label={undefined} 
      required={undefined} 
      className={`${inputClassName(!!error)} ${className}`}
    />
  </Field>
);

const TextArea = ({ error, className = "", ...props }) => (
  <div>
    <Label required={props.required}>{props.label}</Label>
    <textarea 
      {...props} 
      label={undefined} 
      required={undefined} 
      className={`${textareaClassName(!!error)} ${className}`}
    />
    <ErrMsg msg={error} />
  </div>
);

const SelectInput = ({ label, icon, error, required, children, className = "", ...props }) => (
  <Field label={label} icon={icon} error={error} required={required}>
    <select {...props} className={`${selectClassName(!!error)} ${className}`}>
      {children}
    </select>
    <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
  </Field>
);

const CheckboxGroup = ({ label, options, selected, onChange, required }) => (
  <div>
    <Label required={required}>{label}</Label>
    <div className="flex flex-wrap gap-2 mt-1">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button 
            key={opt} 
            type="button" 
            onClick={() => onChange(active ? selected.filter(s => s !== opt) : [...selected, opt])}
            className={`
              px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
              ${active 
                ? 'bg-[#0D9488]/15 dark:bg-[#0D9488]/25 text-[#0D9488] dark:text-[#0D9488] border-2 border-[#0D9488]' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            {active && "✓ "}{opt}
          </button>
        );
      })}
    </div>
  </div>
);

// ── FileUpload Component with Debug Logs ──────────────────────
const FileUpload = ({ label, name, value, onChange, error, accept = "image/*", required }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [value]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log("📁 File dropped:", e.dataTransfer.files[0].name);
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log("📁 File selected:", e.target.files[0].name);
      console.log("📁 File type:", e.target.files[0].type);
      console.log("📁 File size:", e.target.files[0].size);
      onChange(e.target.files[0]);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  const isImage = value && value.type?.startsWith("image/");
  const isPDF = value && value.type === "application/pdf";

  return (
    <div>
      <Label required={required}>{label}</Label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer
          transition-all duration-200 min-h-[120px]
          ${dragActive 
            ? 'border-[#0D9488] bg-[#0D9488]/5 dark:bg-[#0D9488]/10' 
            : error 
              ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
          }
        `}
      >
        {value ? (
          <div>
            {preview && isImage && (
              <img src={preview} alt="Preview" className="max-h-[100px] rounded-lg object-contain mx-auto mb-2" />
            )}
            {isPDF && (
              <FileText size={40} className="text-[#0D9488] mx-auto mb-2" />
            )}
            <p className="text-sm font-semibold text-[#374151] dark:text-white">{value.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{(value.size / 1024).toFixed(1)} KB</p>
            <button
              type="button"
              onClick={removeFile}
              className="mt-2 px-3 py-1 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-xs font-medium"
            >
              <X size={14} className="inline mr-1" /> Remove
            </button>
          </div>
        ) : (
          <div>
            <Upload size={40} className="text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag & drop your file here, or <span className="text-[#0D9488] font-semibold">browse</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">JPG, PNG, PDF • Max 10MB</p>
          </div>
        )}
        <input
          type="file"
          name={name}
          onChange={handleChange}
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <ErrMsg msg={error} />
    </div>
  );
};

const TermBox = ({ checked, onChange, children, error }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`
      flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200
      border-2
      ${checked 
        ? 'border-[#0D9488] bg-[#0D9488]/5 dark:bg-[#0D9488]/10' 
        : error 
          ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
      }
    `}
  >
    <div className={`
      w-5.5 h-5.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 mt-0.5
      ${checked 
        ? 'bg-[#0D9488] border-[#0D9488]' 
        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'
      }
    `}>
      {checked && <CheckCircle size={13} className="text-white" />}
    </div>
    <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</span>
  </div>
);

// ── Step Indicator ─────────────────────────────────────────────
const StepBar = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {STEPS.map((s, i) => {
      const done = s.id < current;
      const active = s.id === current;
      const Icon = s.icon;
      return (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
              ${done 
                ? 'bg-[#0D9488] border-2 border-[#0D9488]' 
                : active 
                  ? 'bg-gradient-to-br from-[#0D9488] to-[#F59E0B] border-2 border-[#0D9488] shadow-lg shadow-[#0D9488]/30' 
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
              }
            `}>
              {done
                ? <CheckCircle size={18} className="text-white" />
                : <Icon size={17} className={active ? "text-white" : "text-gray-400 dark:text-gray-500"} />}
            </div>
            <span className={`
              text-xs font-bold transition-colors duration-200
              ${active 
                ? 'text-[#0D9488] dark:text-[#0D9488]' 
                : done 
                  ? 'text-gray-600 dark:text-gray-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }
            `}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`
              flex-1 h-0.5 min-w-[20px] mb-5 transition-colors duration-300
              ${s.id < current ? 'bg-[#0D9488]' : 'bg-gray-200 dark:bg-gray-700'}
            `} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ── MAIN COMPONENT ─────────────────────────────────────────────
const ProviderRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [existing, setExisting] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { checkRequest(); }, []);

  const checkRequest = async () => {
    try {
      const data = await getMyProviderRequest();
      setExisting(data.request);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const handle = (e) => set(e.target.name, e.target.value);

  const handleFileChange = (key, file) => {
    console.log(`📁 handleFileChange: ${key}`, file);
    set(key, file);
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

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.fullName.trim()) e.fullName = "Full name is required";
      if (!form.phone.trim()) e.phone = "Phone number is required";
      if (!form.nationality.trim()) e.nationality = "Nationality is required";
      if (!form.businessEmail.trim()) e.businessEmail = "Business email is required";
      if (form.businessEmail && !/\S+@\S+\.\S+/.test(form.businessEmail)) e.businessEmail = "Valid email required";
    }
    if (s === 2) {
      if (!form.businessName.trim()) e.businessName = "Business name is required";
      if (!form.businessType) e.businessType = "Please select a business type";
      if (!form.city.trim()) e.city = "City is required";
      if (!form.district.trim()) e.district = "District is required";
      if (!form.price || Number(form.price) <= 0) e.price = "Valid price is required";
      if (!form.availability) e.availability = "Please select availability";
      if (!form.businessPhone.trim()) e.businessPhone = "Business phone is required";
    }
    if (s === 3) {
      if (!form.nationalId.trim()) e.nationalId = "National ID number is required";
      if (!form.tinNumber.trim()) e.tinNumber = "TIN number is required";
      if (!form.rdbRegistration.trim()) e.rdbRegistration = "RDB registration is required";
      if (!form.nationalIdFile) e.nationalIdFile = "Please upload National ID";
    }
    if (s === 4) {
      if (!form.description.trim()) e.description = "Please describe your business";
      if (!form.languages.length) e.languages = "Select at least one language";
      if (!form.yearsOfExperience) e.yearsOfExperience = "Years of experience is required";
    }
    if (s === 5) {
      if (!form.paymentMethod) e.paymentMethod = "Please select payment method";
      if ((form.paymentMethod === "bank_transfer" || form.paymentMethod === "both") && !form.bankName.trim()) e.bankName = "Bank name is required";
      if ((form.paymentMethod === "bank_transfer" || form.paymentMethod === "both") && !form.accountName.trim()) e.accountName = "Account name is required";
      if ((form.paymentMethod === "bank_transfer" || form.paymentMethod === "both") && !form.accountNumber.trim()) e.accountNumber = "Account number is required";
      if ((form.paymentMethod === "mobile_money" || form.paymentMethod === "both") && !form.mobileMoney.trim()) e.mobileMoney = "Mobile money number is required";
    }
    if (s === 6) {
      if (!form.agreeToTerms) e.agreeToTerms = "You must agree to the Terms of Service";
      if (!form.agreeToPrivacy) e.agreeToPrivacy = "You must agree to the Privacy Policy";
      if (!form.agreeToConduct) e.agreeToConduct = "You must agree to the Code of Conduct";
      if (!form.agreeToCommission) e.agreeToCommission = "You must agree to the Commission Agreement";
      if (!form.agreeToTourism) e.agreeToTourism = "You must agree to Tourism Compliance";
      if (!form.agreeToAccurate) e.agreeToAccurate = "You must confirm all information is accurate";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  // ── Submit ────────────────────────────────────────────────────
  const submit = async () => {
    if (!validateStep(6)) return;
    try {
      setSubmitting(true);
      const formData = new FormData();

      const simpleFields = [
        "fullName", "phone", "whatsapp", "nationality", "businessEmail", "alternatePhone",
        "businessName", "businessType", "country", "province", "district", "city", "street",
        "googleMaps", "businessPhone", "businessAddress", "price", "currency", "availability",
        "website", "nationalId", "tinNumber", "rdbRegistration", "tourismLicense",
        "description", "yearsOfExperience", "facebook", "instagram", "twitter", "linkedin",
        "youtube", "tiktok", "paymentMethod", "bankName", "accountName", "accountNumber",
        "swiftCode", "mobileMoney", "paymentCurrency",
        "agreeToTerms", "agreeToPrivacy", "agreeToConduct", "agreeToCommission",
        "agreeToTourism", "agreeToAccurate"
      ];

      simpleFields.forEach(key => {
        if (form[key] !== undefined && form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      formData.append("languages", JSON.stringify(form.languages));
      formData.append("specializations", JSON.stringify(form.specializations));
      formData.append("businessHours", JSON.stringify(form.businessHours));

      // ── FILE FIELDS WITH DEBUG ─────────────────────────────────
      const fileFields = [
        { key: "logo", name: "logo" },
        { key: "coverImage", name: "coverImage" },
        { key: "nationalIdFile", name: "nationalId" },
        { key: "passportFile", name: "passport" },
        { key: "rdbCertificateFile", name: "rdbCertificate" },
        { key: "tinCertificateFile", name: "tinCertificate" },
        { key: "tourismLicenseFile", name: "tourismLicense" },
        { key: "businessRegistrationFile", name: "businessRegistration" },
        { key: "insuranceFile", name: "insurance" },
      ];

      // ✅ DEBUG: Log all file fields before appending
      console.log("📁 ===== FILE DEBUG =====");
      fileFields.forEach(({ key, name }) => {
        console.log(`📁 ${key}:`, form[key]);
        console.log(`📁 ${key} is File:`, form[key] instanceof File);
      });

      // ✅ Append files to FormData
      fileFields.forEach(({ key, name }) => {
        if (form[key] && form[key] instanceof File) {
          console.log(`✅ Appending ${name}:`, form[key].name, `(${form[key].size} bytes)`);
          formData.append(name, form[key]);
        } else {
          console.log(`⚠️ No file for ${name}:`, form[key]);
          // ❌ DO NOT append empty strings for file fields
        }
      });

      // ✅ DEBUG: Log all FormData entries
      console.log("📁 ===== FORMDATA ENTRIES =====");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`📁 ${pair[0]}: ${pair[1].name} (${pair[1].size} bytes)`);
        } else {
          console.log(`📝 ${pair[0]}: ${pair[1]}`);
        }
      }
      console.log("📁 ===== END FORMDATA =====");

      // ✅ Check if FormData has files
      console.log("📁 FormData has logo:", formData.has('logo'));
      console.log("📁 FormData has coverImage:", formData.has('coverImage'));
      console.log("📁 FormData has nationalId:", formData.has('nationalId'));

      await createProviderRequest(formData);
      setSubmitted(true);
      await checkRequest();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Submission failed. Please try again.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
        <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Success ──────────────────────────────────────────────────
  if (submitted) return (
    <div className="max-w-[500px] mx-auto my-10 px-5">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-black/30 p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 dark:bg-[#0D9488]/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-[#0D9488]" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#374151] dark:text-white mb-3">Application Submitted! 🎉</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          Your provider application has been received. Our team will review your legal documents and business details within <strong>24–48 hours</strong>.
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 text-[#B45309] dark:text-[#F59E0B] font-bold text-xs border border-[#F59E0B]/30 dark:border-[#F59E0B]/20 mb-7">
          <Clock size={15} /> Pending Review
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left mb-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <span className="text-[#0D9488] dark:text-[#0D9488] font-bold">💡 What's next?</span><br />
          Our admin team will review your application. You will receive a notification via email and on your dashboard once your request is processed.
        </div>
        <button onClick={() => navigate("/provider/status")} className="w-full h-12 border-none rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-extrabold text-sm cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] transition">
          View Application Status <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  // ── Existing Application ─────────────────────────────────────
  if (existing) {
    const sc = {
      pending: { 
        bg: "bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20", 
        color: "text-[#B45309] dark:text-[#F59E0B]", 
        border: "border-[#F59E0B]/30 dark:border-[#F59E0B]/20",
        icon: Clock,
        action: null,
      },
      approved: { 
        bg: "bg-[#0D9488]/10 dark:bg-[#0D9488]/20", 
        color: "text-[#0D9488]", 
        border: "border-[#0D9488]/30 dark:border-[#0D9488]/20",
        icon: CheckCircle,
        action: null,
      },
      rejected: { 
        bg: "bg-red-100 dark:bg-red-900/20", 
        color: "text-red-600 dark:text-red-400", 
        border: "border-red-200 dark:border-red-800",
        icon: XCircle,
        action: "reapply",
      }
    };
    
    const s = sc[existing.status] || sc.pending;
    const StatusIcon = s.icon;

    return (
      <div className="max-w-[500px] mx-auto my-10 px-5">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-black/30 p-8">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#374151] dark:text-white m-0">Provider Application</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Status overview</p>
            </div>
          </div>

          {[
            { label: "Business", value: existing.businessName },
            { label: "Business Type", value: existing.businessType?.replace("_", " ") },
            { label: "Location", value: `${existing.city}, ${existing.country}` },
            { label: "Submitted", value: existing.createdAt ? new Date(existing.createdAt).toLocaleDateString() : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-sm font-bold text-[#374151] dark:text-white capitalize">{value}</span>
            </div>
          ))}

          <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
            <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full border capitalize flex items-center gap-1.5 ${s.bg} ${s.color} ${s.border}`}>
              <StatusIcon size={14} />
              {existing.status}
            </span>
          </div>

          {existing.adminNotes && (
            <div className="mt-2 p-3.5 rounded-xl bg-[#FFFBEB] dark:bg-[#F59E0B]/10 border border-[#FDE68A] dark:border-[#F59E0B]/20">
              <p className="text-sm text-[#92400E] dark:text-[#F59E0B] m-0">
                <strong>Admin Notes:</strong> {existing.adminNotes}
              </p>
            </div>
          )}

          {/* ✅ REAPPLY SECTION FOR REJECTED STATUS */}
          {s.action === "reapply" && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300 mb-3 leading-relaxed">
                <strong>Your application was rejected.</strong> Please review the admin notes above and submit a new application with updated information.
              </p>
              <button
                onClick={() => {
                  // ✅ Reset form and allow reapplication
                  setForm(EMPTY_FORM);
                  setStep(1);
                  setExisting(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full h-12 border-none rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-extrabold text-sm cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/40 hover:scale-[1.02] transition"
              >
                <RefreshCw size={16} />
                Reapply Now
              </button>
            </div>
          )}

          {/* ✅ CHECK STATUS BUTTON (for non-rejected statuses) */}
          {s.action !== "reapply" && (
            <button 
              onClick={() => navigate("/provider/status")} 
              className="mt-6 w-full h-12 border-none rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-extrabold text-sm cursor-pointer hover:scale-[1.02] transition"
            >
              Check Status
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────
  const cardClassName = "bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-black/30 p-8";
  const sectionTitle = (text, sub) => (
    <div className="mb-6">
      <h2 className="text-lg font-extrabold text-[#374151] dark:text-white m-0">{text}</h2>
      {sub && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
    </div>
  );

  return (
    <div className="max-w-[720px] mx-auto px-5 py-8 pb-20 font-sans bg-gray-50 dark:bg-gray-950 min-h-screen">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box}`}</style>

      <div className="flex items-center gap-3.5 mb-8">
        <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#0D9488]/40">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#374151] dark:text-white m-0">Become A Provider</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Grow your travel business with AI Tour Rwanda</p>
        </div>
      </div>

      <StepBar current={step} />

      {/* STEP 1 — Personal Information */}
      {step === 1 && (
        <div className={cardClassName}>
          {sectionTitle("Personal Information", "Your personal details")}
          <div className="flex flex-col gap-4">
            <TextInput label="Full Name" name="fullName" icon={User} placeholder="As shown on your ID" value={form.fullName} onChange={handle} error={errors.fullName} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <TextInput label="Personal Phone" name="phone" icon={Phone} placeholder="+250 7XX XXX XXX" value={form.phone} onChange={handle} error={errors.phone} required />
              <TextInput label="WhatsApp (optional)" name="whatsapp" icon={Phone} placeholder="+250 7XX XXX XXX" value={form.whatsapp} onChange={handle} error={errors.whatsapp} />
            </div>
            <TextInput label="Nationality" name="nationality" icon={Globe} placeholder="Rwandan, Kenyan, etc." value={form.nationality} onChange={handle} error={errors.nationality} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <TextInput label="Business Email" name="businessEmail" icon={Mail} placeholder="info@yourbusiness.com" value={form.businessEmail} onChange={handle} error={errors.businessEmail} required />
              <TextInput label="Alternate Phone (optional)" name="alternatePhone" icon={Phone} placeholder="+250 7XX XXX XXX" value={form.alternatePhone} onChange={handle} error={errors.alternatePhone} />
            </div>
          </div>
          <div className="mt-5 p-3.5 rounded-xl bg-[#0D9488]/5 dark:bg-[#0D9488]/10 border border-[#0D9488]/20 dark:border-[#0D9488]/30 flex gap-2.5 items-start">
            <AlertCircle size={16} className="text-[#0D9488] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#374151] dark:text-gray-300 leading-relaxed m-0">
              <strong>Your information is secure.</strong> Your data will only be used to review your application and will not be shared with any third parties.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2 — Business Information */}
      {step === 2 && (
        <div className={cardClassName}>
          {sectionTitle("Business Information", "Your business details")}
          <div className="flex flex-col gap-4">
            <TextInput label="Business Name" name="businessName" icon={Building2} placeholder="Rwanda Wild Expeditions Ltd" value={form.businessName} onChange={handle} error={errors.businessName} required />
            <SelectInput label="Business Type" icon={Briefcase} error={errors.businessType} required name="businessType" value={form.businessType} onChange={handle}>
              <option value="">Select business type...</option>
              {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </SelectInput>
            <TextInput label="Business Phone" name="businessPhone" icon={Phone} placeholder="+250 7XX XXX XXX" value={form.businessPhone} onChange={handle} error={errors.businessPhone} required />
            <TextInput label="Business Address" name="businessAddress" icon={MapPin} placeholder="Building name, Street, Area" value={form.businessAddress} onChange={handle} error={errors.businessAddress} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <TextInput label="Country" name="country" icon={Globe} placeholder="Rwanda" value={form.country} onChange={handle} error={errors.country} />
              <TextInput label="Province / State" name="province" icon={MapPin} placeholder="Northern Province" value={form.province} onChange={handle} error={errors.province} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <TextInput label="District" name="district" icon={MapPin} placeholder="Musanze" value={form.district} onChange={handle} error={errors.district} required />
              <TextInput label="City" name="city" icon={MapPin} placeholder="Kigali" value={form.city} onChange={handle} error={errors.city} required />
            </div>
            <TextInput label="Street (optional)" name="street" icon={MapPin} placeholder="KN 5 St" value={form.street} onChange={handle} error={errors.street} />
            <TextInput label="Google Maps Link (optional)" name="googleMaps" icon={MapPin} placeholder="https://maps.google.com/..." value={form.googleMaps} onChange={handle} error={errors.googleMaps} />
            <TextInput label="Website (optional)" name="website" icon={Globe} placeholder="https://yourwebsite.com" value={form.website} onChange={handle} error={errors.website} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <TextInput label="Starting Price (USD)" name="price" icon={DollarSign} type="number" placeholder="150" value={form.price} onChange={handle} error={errors.price} required />
              <SelectInput label="Currency" icon={CreditCard} name="currency" value={form.currency} onChange={handle}>
                {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </SelectInput>
            </div>
            <SelectInput label="Availability" icon={Clock} error={errors.availability} required name="availability" value={form.availability} onChange={handle}>
              <option value="">Select availability...</option>
              {AVAILABILITY_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </SelectInput>
          </div>
        </div>
      )}

      {/* STEP 3 — Legal Documents */}
      {step === 3 && (
        <div className={cardClassName}>
          {sectionTitle("Legal Documents", "Upload your legal documents for verification")}
          <div className="mb-5 p-3.5 rounded-xl bg-[#FFFBEB] dark:bg-[#F59E0B]/10 border border-[#FDE68A] dark:border-[#F59E0B]/20">
            <p className="text-xs text-[#92400E] dark:text-[#F59E0B] m-0 leading-relaxed">
              ⚖️ <strong>To be approved to operate on AI Tour</strong> — your business must be registered with the Rwanda Development Board (RDB) and have a MINECOFIN TIN. All documents will be reviewed before your application is approved.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <TextInput label="National ID / Passport Number" name="nationalId" icon={FileText} placeholder="1 XXXX X XXXXXXX X XX" value={form.nationalId} onChange={handle} error={errors.nationalId} required />
            <FileUpload label="Upload National ID / Passport" name="nationalIdFile" value={form.nationalIdFile} onChange={(file) => handleFileChange("nationalIdFile", file)} error={errors.nationalIdFile} required />
            <TextInput label="TIN Number (Tax ID)" name="tinNumber" icon={FileText} placeholder="XXXXXXXXX" value={form.tinNumber} onChange={handle} error={errors.tinNumber} required />
            <FileUpload label="Upload TIN Certificate" name="tinCertificateFile" value={form.tinCertificateFile} onChange={(file) => handleFileChange("tinCertificateFile", file)} error={errors.tinCertificateFile} />
            <TextInput label="RDB Registration Number" name="rdbRegistration" icon={Building2} placeholder="RDB/XXX/XXXX" value={form.rdbRegistration} onChange={handle} error={errors.rdbRegistration} required />
            <FileUpload label="Upload RDB Certificate" name="rdbCertificateFile" value={form.rdbCertificateFile} onChange={(file) => handleFileChange("rdbCertificateFile", file)} error={errors.rdbCertificateFile} />
            <FileUpload label="Upload Business Registration Certificate" name="businessRegistrationFile" value={form.businessRegistrationFile} onChange={(file) => handleFileChange("businessRegistrationFile", file)} error={errors.businessRegistrationFile} />
            <TextInput label="Tourism License Number (optional)" name="tourismLicense" icon={BadgeCheck} placeholder="Tourism operating license" value={form.tourismLicense} onChange={handle} error={errors.tourismLicense} />
            <FileUpload label="Upload Tourism License (optional)" name="tourismLicenseFile" value={form.tourismLicenseFile} onChange={(file) => handleFileChange("tourismLicenseFile", file)} error={errors.tourismLicenseFile} />
            <FileUpload label="Upload Insurance Certificate (optional)" name="insuranceFile" value={form.insuranceFile} onChange={(file) => handleFileChange("insuranceFile", file)} error={errors.insuranceFile} accept="image/*,.pdf" />
          </div>
        </div>
      )}

      {/* STEP 4 — Business Profile */}
      {step === 4 && (
        <div className={cardClassName}>
          {sectionTitle("Business Profile", "Tell travelers about your services")}
          <div className="flex flex-col gap-4.5">
            <div>
              <Label required>Business Description</Label>
              <textarea
                name="description"
                placeholder="Describe your services, what makes you unique, your experience with tourists..."
                value={form.description}
                onChange={handle}
                rows={5}
                className={textareaClassName(!!errors.description)}
              />
              <div className="flex justify-between mt-1">
                <ErrMsg msg={errors.description} />
                <span className="text-xs text-gray-400 dark:text-gray-500">{form.description.length} characters</span>
              </div>
            </div>

            <CheckboxGroup
              label="Languages You Speak *"
              options={LANGUAGES_LIST}
              selected={form.languages}
              onChange={val => set("languages", val)}
              required
            />
            {errors.languages && <ErrMsg msg={errors.languages} />}

            <CheckboxGroup
              label="Specializations (optional)"
              options={SPECIALIZATIONS}
              selected={form.specializations}
              onChange={val => set("specializations", val)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <SelectInput label="Years of Experience" icon={Clock} error={errors.yearsOfExperience} required name="yearsOfExperience" value={form.yearsOfExperience} onChange={handle}>
                <option value="">Select...</option>
                {["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years"].map(y => <option key={y} value={y}>{y}</option>)}
              </SelectInput>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <FileUpload label="Business Logo" name="logo" value={form.logo} onChange={(file) => handleFileChange("logo", file)} accept="image/*" />
              <FileUpload label="Cover Image" name="coverImage" value={form.coverImage} onChange={(file) => handleFileChange("coverImage", file)} accept="image/*" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <TextInput label="Facebook (optional)" name="facebook" icon={Facebook} placeholder="https://facebook.com/..." value={form.facebook} onChange={handle} error={errors.facebook} />
              <TextInput label="Instagram (optional)" name="instagram" icon={Instagram} placeholder="https://instagram.com/..." value={form.instagram} onChange={handle} error={errors.instagram} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <TextInput label="X / Twitter (optional)" name="twitter" icon={Twitter} placeholder="https://twitter.com/..." value={form.twitter} onChange={handle} error={errors.twitter} />
              <TextInput label="LinkedIn (optional)" name="linkedin" icon={Linkedin} placeholder="https://linkedin.com/..." value={form.linkedin} onChange={handle} error={errors.linkedin} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <TextInput label="YouTube (optional)" name="youtube" icon={Youtube} placeholder="https://youtube.com/..." value={form.youtube} onChange={handle} error={errors.youtube} />
              <TextInput label="TikTok (optional)" name="tiktok" icon={Video} placeholder="https://tiktok.com/..." value={form.tiktok} onChange={handle} error={errors.tiktok} />
            </div>

            <div>
              <Label>Business Hours</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {DAYS.map((day, idx) => (
                  <div key={day} className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-wrap">
                    <span className="font-semibold text-sm text-[#374151] dark:text-white w-[85px]">{DAY_LABELS[idx]}</span>
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                      <input type="checkbox" checked={form.businessHours[day].closed} onChange={() => handleBusinessHours(day, "closed", !form.businessHours[day].closed)} className="accent-[#0D9488]" />
                      Closed
                    </label>
                    {!form.businessHours[day].closed && (
                      <>
                        <input type="time" value={form.businessHours[day].open} onChange={(e) => handleBusinessHours(day, "open", e.target.value)} className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white text-sm focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">to</span>
                        <input type="time" value={form.businessHours[day].close} onChange={(e) => handleBusinessHours(day, "close", e.target.value)} className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white text-sm focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5 — Payment Information */}
      {step === 5 && (
        <div className={cardClassName}>
          {sectionTitle("Payment Information", "Specify how you will receive payments")}
          <div className="flex flex-col gap-4">
            <SelectInput label="Preferred Payment Method" icon={CreditCard} error={errors.paymentMethod} required name="paymentMethod" value={form.paymentMethod} onChange={handle}>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="both">Both</option>
            </SelectInput>

            {(form.paymentMethod === "bank_transfer" || form.paymentMethod === "both") && (
              <>
                <TextInput label="Bank Name" name="bankName" icon={Building2} placeholder="Bank of Rwanda" value={form.bankName} onChange={handle} error={errors.bankName} required={form.paymentMethod !== "mobile_money"} />
                <TextInput label="Account Name" name="accountName" icon={User} placeholder="Business account name" value={form.accountName} onChange={handle} error={errors.accountName} required={form.paymentMethod !== "mobile_money"} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <TextInput label="Account Number" name="accountNumber" icon={CreditCard} placeholder="123456789" value={form.accountNumber} onChange={handle} error={errors.accountNumber} required={form.paymentMethod !== "mobile_money"} />
                  <TextInput label="SWIFT Code (optional)" name="swiftCode" icon={Globe} placeholder="SWIFT123" value={form.swiftCode} onChange={handle} error={errors.swiftCode} />
                </div>
              </>
            )}

            {(form.paymentMethod === "mobile_money" || form.paymentMethod === "both") && (
              <TextInput label="Mobile Money Number" name="mobileMoney" icon={Phone} placeholder="+250 7XX XXX XXX" value={form.mobileMoney} onChange={handle} error={errors.mobileMoney} required={form.paymentMethod !== "bank_transfer"} />
            )}

            <SelectInput label="Payment Currency" icon={DollarSign} name="paymentCurrency" value={form.paymentCurrency} onChange={handle}>
              {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </SelectInput>

            <div className="p-3.5 rounded-xl bg-[#0D9488]/5 dark:bg-[#0D9488]/10 border border-[#0D9488]/20 dark:border-[#0D9488]/30">
              <p className="text-xs text-[#374151] dark:text-gray-300 m-0 leading-relaxed">
                🔒 <strong>Your information is secure.</strong> Your payment details will only be used to process your payouts and will not be visible to travelers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6 — Terms & Agreements */}
      {step === 6 && (
        <div className={cardClassName}>
          {sectionTitle("Terms & Agreements", "Read carefully before agreeing")}
          <div className="flex flex-col gap-3">
            <TermBox checked={form.agreeToTerms} onChange={v => set("agreeToTerms", v)} error={errors.agreeToTerms}>
              <strong>Terms of Service</strong> — I agree to all terms and conditions of AI Tour Rwanda Ltd, including following traveler insurance policies, date changes, and providing accurate information.
            </TermBox>
            {errors.agreeToTerms && <ErrMsg msg={errors.agreeToTerms} />}

            <TermBox checked={form.agreeToPrivacy} onChange={v => set("agreeToPrivacy", v)} error={errors.agreeToPrivacy}>
              <strong>Privacy Policy</strong> — I agree that my information will be used in accordance with GDPR regulations and will not be shared with unauthorized third parties.
            </TermBox>
            {errors.agreeToPrivacy && <ErrMsg msg={errors.agreeToPrivacy} />}

            <TermBox checked={form.agreeToConduct} onChange={v => set("agreeToConduct", v)} error={errors.agreeToConduct}>
              <strong>Provider Code of Conduct</strong> — I will respect travelers' rights, provide services as described, and support AI Tour's mission to promote sustainable tourism.
            </TermBox>
            {errors.agreeToConduct && <ErrMsg msg={errors.agreeToConduct} />}

            <TermBox checked={form.agreeToCommission} onChange={v => set("agreeToCommission", v)} error={errors.agreeToCommission}>
              <strong>Commission Agreement</strong> — I agree that AI Tour will deduct a commission (%) on each booking made through the platform to support service development.
            </TermBox>
            {errors.agreeToCommission && <ErrMsg msg={errors.agreeToCommission} />}

            <TermBox checked={form.agreeToTourism} onChange={v => set("agreeToTourism", v)} error={errors.agreeToTourism}>
              <strong>Tourism Compliance</strong> — I agree to comply with all tourism regulations in Rwanda, including environmental policies and cultural heritage protection.
            </TermBox>
            {errors.agreeToTourism && <ErrMsg msg={errors.agreeToTourism} />}

            <TermBox checked={form.agreeToAccurate} onChange={v => set("agreeToAccurate", v)} error={errors.agreeToAccurate}>
              <strong>Accurate Information</strong> — I confirm that all information provided is true and accurate, and that the documents submitted are genuine.
            </TermBox>
            {errors.agreeToAccurate && <ErrMsg msg={errors.agreeToAccurate} />}
          </div>

          <div className="mt-6 p-4.5 rounded-xl bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-bold text-[#374151] dark:text-white mb-3">📋 Application Summary</h3>
            {[
              { label: "Full Name", value: form.fullName },
              { label: "Business", value: form.businessName },
              { label: "Business Email", value: form.businessEmail },
              { label: "Business Phone", value: form.businessPhone },
              { label: "Type", value: BUSINESS_TYPES.find(t => t.value === form.businessType)?.label || "—" },
              { label: "Location", value: `${form.city}, ${form.district}, ${form.country}` },
              { label: "Starting Price", value: `${form.currency} ${form.price}` },
              { label: "Availability", value: form.availability },
              { label: "Payment Method", value: form.paymentMethod === "bank_transfer" ? "Bank Transfer" : form.paymentMethod === "mobile_money" ? "Mobile Money" : "Both" },
              { label: "Languages", value: form.languages.join(", ") || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 dark:text-gray-500">{label}</span>
                <span className="font-semibold text-[#374151] dark:text-white text-right max-w-[55%]">{value || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-5">
        {step > 1 && (
          <button onClick={prevStep} className="flex-none h-13 px-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-[#374151] dark:text-white font-bold text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-sans">
            <ArrowLeft size={17} /> Back
          </button>
        )}

        {step < 6 ? (
          <button onClick={nextStep} className="flex-1 h-13 border-none rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-extrabold text-sm cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/40 hover:scale-[1.02] transition font-sans">
            Continue <ArrowRight size={17} />
          </button>
        ) : (
          <button onClick={submit} disabled={submitting} className={`flex-1 h-13 border-none rounded-xl font-extrabold text-sm cursor-pointer flex items-center justify-center gap-2 transition font-sans ${submitting ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white shadow-lg shadow-[#0D9488]/40 hover:scale-[1.02]'}`}>
            {submitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <>Submit Application <ArrowRight size={17} /></>}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
        Step {step} of {STEPS.length} — {STEPS[step - 1].label}
      </p>
    </div>
  );
};

export default ProviderRequest;