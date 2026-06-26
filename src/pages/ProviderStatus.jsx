// src/pages/ProviderStatus.jsx

import React, {
  useEffect,
  useState
} from "react";

import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Building2,
  User,
  Mail,
} from "lucide-react";

import {
  getMyProviderRequest
} from "../services/providerService";

import {
  useAuth
} from "../contexts/AuthContext";

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

const ProviderStatus = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadRequest();
  }, []);

  const loadRequest = async () => {
    try {
      const data = await getMyProviderRequest();
      setRequest(data.request);
      await refreshUser();
    } catch (error) {
      console.log("Provider status error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "provider" && user?.verificationStatus === "approved") {
      navigate("/provider/dashboard");
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading status...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#0D9488]/10 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-[#0D9488]" />
          </div>

          <h1 className="text-3xl font-black mt-5 text-[#374151] dark:text-white">
            Become AI Tour Provider
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-3">
            You have not submitted a provider application yet.
          </p>

          <button
            onClick={() => navigate("/provider/request")}
            className="mt-6 w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-[#0D9488] to-[#F59E0B] shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300"
          >
            Apply Now
          </button>
        </div>
      </div>
    );
  }

  // Status configurations with AI Tour colors
  const statusUI = {
    pending: {
      title: "Application Pending",
      message: "Your provider application is being reviewed by AI Tour Rwanda admin team.",
      icon: <Clock className="w-16 h-16 text-[#F59E0B]" />,
      badgeClass: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20",
      action: null,
    },
    approved: {
      title: "Provider Approved! 🎉",
      message: "Congratulations! You are now an official AI Tour service provider.",
      icon: <CheckCircle className="w-16 h-16 text-[#0D9488]" />,
      badgeClass: "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20",
      action: {
        text: "Go To Provider Dashboard",
        onClick: () => navigate("/provider/dashboard"),
        gradient: "from-[#0D9488] to-[#F59E0B]",
      },
    },
    rejected: {
      title: "Application Rejected",
      message: request.adminNotes || "Your application was rejected. Please review and try again.",
      icon: <XCircle className="w-16 h-16 text-red-600" />,
      badgeClass: "bg-red-100 text-red-600 border border-red-200",
      action: {
        text: "Submit New Application",
        onClick: () => navigate("/provider/request"),
        gradient: "from-[#0D9488] to-[#F59E0B]",
      },
    },
    needs_information: {
      title: "More Information Needed",
      message: request.adminNotes || "Admin requested additional information.",
      icon: <AlertCircle className="w-16 h-16 text-[#F59E0B]" />,
      badgeClass: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20",
      action: {
        text: "Update Information",
        onClick: () => navigate("/provider/request"),
        gradient: "from-[#F59E0B] to-[#d97706]",
      },
    },
  };

  const current = statusUI[request.status] || statusUI.pending;

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20 animate-ping" />
            {current.icon}
          </div>
        </div>

        {/* Title */}
        <div className="flex justify-center items-center gap-2 mt-5">
          <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          <h1 className="text-3xl font-black text-[#374151] dark:text-white">
            {current.title}
          </h1>
        </div>

        {/* Message */}
        <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
          {current.message}
        </p>

        {/* Status Badge */}
        <div className={`mt-6 inline-block px-6 py-3 rounded-full font-bold capitalize ${current.badgeClass}`}>
          {request.status.replace("_", " ")}
        </div>

        {/* Business Info */}
        <div className="mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-left space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="w-4 h-4 text-[#0D9488]" />
            <span className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Business:</span> {request.businessName}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-[#0D9488]" />
            <span className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Owner:</span> {request.fullName}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-[#0D9488]" />
            <span className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Status:</span> {request.status}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {current.action && (
          <button
            onClick={current.action.onClick}
            className={`mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold bg-gradient-to-r ${current.action.gradient} shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300`}
          >
            {current.action.text}
            <ArrowRight size={18} />
          </button>
        )}

        {/* Help Text */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Need help?{' '}
            <a href="mailto:support@aitour.rw" className="text-[#0D9488] hover:underline font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderStatus;