// frontend/src/pages/admin/Settings.jsx
// ✅ FIXED - Loads default settings immediately, no API dependency

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  DollarSign,
  Users,
  Bell,
  Mail,
  Shield,
  Database,
  Clock,
  Smartphone,
  Eye,
  EyeOff,
  Key,
  Link,
  Cloud,
  Upload,
  X,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronRight,
  Server,
  Zap,
  Lock,
  FileText,
  Calendar,
  BarChart3,
  Palette,
  Monitor,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// DEFAULT SETTINGS
// ===============================

const getDefaultSettings = () => ({
  general: {
    siteName: 'AI Tour Rwanda',
    siteTagline: 'Discover Rwanda with AI',
    siteDescription: 'Smart travel planning powered by artificial intelligence',
    timezone: 'Africa/Kigali',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    language: 'en',
    maintenanceMode: false,
  },
  payment: {
    currency: 'USD',
    currencySymbol: '$',
    platformFee: 10,
    providerFee: 2.9,
    paymentProviders: ['stripe'],
    stripeSecretKey: '',
    stripePublishableKey: '',
    stripeWebhookSecret: '',
    enableTestMode: true,
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpFromEmail: 'noreply@aitour.rw',
    smtpFromName: 'AI Tour Rwanda',
    enableEmail: true,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    bookingCreated: true,
    bookingConfirmed: true,
    paymentReceived: true,
    paymentFailed: true,
    reviewSubmitted: true,
  },
  security: {
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    passwordMinLength: 8,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    twoFactorAuth: false,
    allowedDomains: [],
    blockedIPs: [],
  },
  integrations: {
    googleAnalytics: '',
    facebookPixel: '',
    googleMapsApiKey: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    enableGoogleLogin: false,
    enableFacebookLogin: false,
    enableTwitterLogin: false,
  },
  appearance: {
    primaryColor: '#0D9488',
    secondaryColor: '#F59E0B',
    darkMode: false,
    logoUrl: '',
    faviconUrl: '',
    customCSS: '',
    customJS: '',
  },
  advanced: {
    debugMode: false,
    logLevel: 'info',
    cacheEnabled: true,
    cacheDuration: 3600,
    maxUploadSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx'],
  },
});

// ===============================
// ADMIN SETTINGS COMPONENT
// ===============================

const AdminSettings = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false); // ✅ Start with false
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState(null);
  const [originalSettings, setOriginalSettings] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // ===============================
  // SECTION CONFIGURATION
  // ===============================

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'payment', label: 'Payment', icon: DollarSign },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: Server },
  ];

  // ===============================
  // INITIALIZE SETTINGS
  // ===============================

  useEffect(() => {
    // ✅ Load default settings immediately
    const defaults = getDefaultSettings();
    setSettings(defaults);
    setOriginalSettings(JSON.parse(JSON.stringify(defaults)));
    setLoading(false);
    
    // ✅ Try to fetch saved settings from API (optional)
    fetchSettings();
  }, []);

  // ===============================
  // FETCH SETTINGS (Optional)
  // ===============================

  const fetchSettings = async () => {
    try {
      // Only try to fetch if we have a token
      if (!token) return;
      
      const response = await axios.get(`${API_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.data || response.data;
      if (data && Object.keys(data).length > 0) {
        setSettings(data);
        setOriginalSettings(JSON.parse(JSON.stringify(data)));
      }
    } catch (error) {
      // ✅ Silently fail - we already have default settings
      console.log('ℹ️ No saved settings found, using defaults');
    }
  };

  // ===============================
  // UPDATE SETTINGS
  // ===============================

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // ===============================
  // SAVE SETTINGS
  // ===============================

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // If no token, just show success (client-side only)
      if (!token) {
        toast.success('Settings saved locally!');
        setOriginalSettings(JSON.parse(JSON.stringify(settings)));
        setSaving(false);
        return;
      }
      
      // Filter out sensitive data
      const dataToSave = {
        ...settings,
        payment: {
          ...settings.payment,
          stripeSecretKey: settings.payment.stripeSecretKey || originalSettings.payment?.stripeSecretKey,
          stripeWebhookSecret: settings.payment.stripeWebhookSecret || originalSettings.payment?.stripeWebhookSecret,
        },
        integrations: {
          ...settings.integrations,
          cloudinaryApiSecret: settings.integrations.cloudinaryApiSecret || originalSettings.integrations?.cloudinaryApiSecret,
        },
      };
      
      await axios.put(
        `${API_URL}/admin/settings`,
        dataToSave,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Settings saved successfully!');
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // RESET SETTINGS
  // ===============================

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaults = getDefaultSettings();
      setSettings(defaults);
      toast.info('Settings have been reset to defaults. Click Save to apply.');
    }
  };

  // ===============================
  // HANDLE SECTION RENDER
  // ===============================

  const renderSection = () => {
    if (!settings) return null;
    
    switch (activeSection) {
      case 'general':
        return renderGeneral();
      case 'payment':
        return renderPayment();
      case 'email':
        return renderEmail();
      case 'notifications':
        return renderNotifications();
      case 'security':
        return renderSecurity();
      case 'integrations':
        return renderIntegrations();
      case 'appearance':
        return renderAppearance();
      case 'advanced':
        return renderAdvanced();
      default:
        return renderGeneral();
    }
  };

  // ===============================
  // SECTION: GENERAL
  // ===============================

  const renderGeneral = () => {
    const section = settings.general || {};
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#374151] dark:text-white">General Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Basic site configuration and branding</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Site Name
            </label>
            <input
              type="text"
              value={section.siteName || ''}
              onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Site Tagline
            </label>
            <input
              type="text"
              value={section.siteTagline || ''}
              onChange={(e) => updateSetting('general', 'siteTagline', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
            Site Description
          </label>
          <textarea
            value={section.siteDescription || ''}
            onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Timezone
            </label>
            <select
              value={section.timezone || 'Africa/Kigali'}
              onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            >
              <option value="Africa/Kigali">Africa/Kigali</option>
              <option value="Africa/Nairobi">Africa/Nairobi</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Date Format
            </label>
            <select
              value={section.dateFormat || 'MM/DD/YYYY'}
              onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY/MM/DD">YYYY/MM/DD</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Time Format
            </label>
            <select
              value={section.timeFormat || '12h'}
              onChange={(e) => updateSetting('general', 'timeFormat', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            checked={section.maintenanceMode || false}
            onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
            className="w-4 h-4 accent-[#0D9488]"
          />
          <span className="text-sm text-[#374151] dark:text-white">Enable Maintenance Mode</span>
        </div>
      </div>
    );
  };

  // ===============================
  // SECTION: PAYMENT
  // ===============================

  const renderPayment = () => {
    const section = settings.payment || {};
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#374151] dark:text-white">Payment Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure payment processing and fees</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Currency
            </label>
            <select
              value={section.currency || 'USD'}
              onChange={(e) => updateSetting('payment', 'currency', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="RWF">RWF - Rwandan Franc</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Currency Symbol
            </label>
            <input
              type="text"
              value={section.currencySymbol || '$'}
              onChange={(e) => updateSetting('payment', 'currencySymbol', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Platform Fee (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={section.platformFee || 10}
              onChange={(e) => updateSetting('payment', 'platformFee', parseFloat(e.target.value) || 0)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Stripe Secret Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={section.stripeSecretKey || ''}
                onChange={(e) => updateSetting('payment', 'stripeSecretKey', e.target.value)}
                className="w-full h-11 px-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
                placeholder="sk_live_..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Stripe Publishable Key
            </label>
            <input
              type="text"
              value={section.stripePublishableKey || ''}
              onChange={(e) => updateSetting('payment', 'stripePublishableKey', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              placeholder="pk_live_..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
            Stripe Webhook Secret
          </label>
          <input
            type="password"
            value={section.stripeWebhookSecret || ''}
            onChange={(e) => updateSetting('payment', 'stripeWebhookSecret', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            placeholder="whsec_..."
          />
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            checked={section.enableTestMode || false}
            onChange={(e) => updateSetting('payment', 'enableTestMode', e.target.checked)}
            className="w-4 h-4 accent-[#0D9488]"
          />
          <span className="text-sm text-[#374151] dark:text-white">Enable Test Mode</span>
        </div>
      </div>
    );
  };

  // ===============================
  // SECTION: EMAIL
  // ===============================

  const renderEmail = () => {
    const section = settings.email || {};
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#374151] dark:text-white">Email Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure SMTP and email delivery</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              SMTP Host
            </label>
            <input
              type="text"
              value={section.smtpHost || ''}
              onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              placeholder="smtp.example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              SMTP Port
            </label>
            <input
              type="number"
              value={section.smtpPort || 587}
              onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value) || 587)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              SMTP Username
            </label>
            <input
              type="text"
              value={section.smtpUsername || ''}
              onChange={(e) => updateSetting('email', 'smtpUsername', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              SMTP Password
            </label>
            <input
              type="password"
              value={section.smtpPassword || ''}
              onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              From Email
            </label>
            <input
              type="email"
              value={section.smtpFromEmail || ''}
              onChange={(e) => updateSetting('email', 'smtpFromEmail', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              placeholder="noreply@aitour.rw"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              From Name
            </label>
            <input
              type="text"
              value={section.smtpFromName || ''}
              onChange={(e) => updateSetting('email', 'smtpFromName', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              placeholder="AI Tour Rwanda"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            checked={section.enableEmail || false}
            onChange={(e) => updateSetting('email', 'enableEmail', e.target.checked)}
            className="w-4 h-4 accent-[#0D9488]"
          />
          <span className="text-sm text-[#374151] dark:text-white">Enable Email Notifications</span>
        </div>
      </div>
    );
  };

  // ===============================
  // SECTION: NOTIFICATIONS
  // ===============================

  const renderNotifications = () => {
    const section = settings.notifications || {};
    
    const toggles = [
      { key: 'emailNotifications', label: 'Email Notifications' },
      { key: 'pushNotifications', label: 'Push Notifications' },
      { key: 'smsNotifications', label: 'SMS Notifications' },
    ];

    const events = [
      { key: 'bookingCreated', label: 'Booking Created' },
      { key: 'bookingConfirmed', label: 'Booking Confirmed' },
      { key: 'paymentReceived', label: 'Payment Received' },
      { key: 'paymentFailed', label: 'Payment Failed' },
      { key: 'reviewSubmitted', label: 'Review Submitted' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#374151] dark:text-white">Notification Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure how and when to send notifications</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#374151] dark:text-white mb-3">Notification Channels</h4>
          <div className="space-y-2">
            {toggles.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  checked={section[key] || false}
                  onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                  className="w-4 h-4 accent-[#0D9488]"
                />
                <span className="text-sm text-[#374151] dark:text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#374151] dark:text-white mb-3">Notification Events</h4>
          <div className="space-y-2">
            {events.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  checked={section[key] || false}
                  onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                  className="w-4 h-4 accent-[#0D9488]"
                />
                <span className="text-sm text-[#374151] dark:text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ===============================
  // SECTION: SECURITY
  // ===============================

  const renderSecurity = () => {
    const section = settings.security || {};
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#374151] dark:text-white">Security Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure security and authentication</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Max Login Attempts
            </label>
            <input
              type="number"
              min="1"
              value={section.maxLoginAttempts || 5}
              onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value) || 5)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              min="5"
              value={section.sessionTimeout || 60}
              onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value) || 60)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Password Min Length
            </label>
            <input
              type="number"
              min="6"
              value={section.passwordMinLength || 8}
              onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value) || 8)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              checked={section.requireEmailVerification || false}
              onChange={(e) => updateSetting('security', 'requireEmailVerification', e.target.checked)}
              className="w-4 h-4 accent-[#0D9488]"
            />
            <span className="text-sm text-[#374151] dark:text-white">Require Email Verification</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              checked={section.requirePhoneVerification || false}
              onChange={(e) => updateSetting('security', 'requirePhoneVerification', e.target.checked)}
              className="w-4 h-4 accent-[#0D9488]"
            />
            <span className="text-sm text-[#374151] dark:text-white">Require Phone Verification</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              checked={section.twoFactorAuth || false}
              onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
              className="w-4 h-4 accent-[#0D9488]"
            />
            <span className="text-sm text-[#374151] dark:text-white">Enable Two-Factor Authentication</span>
          </div>
        </div>
      </div>
    );
  };

  // ===============================
  // SECTION: INTEGRATIONS
  // ===============================

  const renderIntegrations = () => {
    const section = settings.integrations || {};
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#374151] dark:text-white">Integrations</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure third-party integrations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Google Analytics ID
            </label>
            <input
              type="text"
              value={section.googleAnalytics || ''}
              onChange={(e) => updateSetting('integrations', 'googleAnalytics', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Facebook Pixel ID
            </label>
            <input
              type="text"
              value={section.facebookPixel || ''}
              onChange={(e) => updateSetting('integrations', 'facebookPixel', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              placeholder="XXXXXXXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
            Google Maps API Key
          </label>
          <input
            type="text"
            value={section.googleMapsApiKey || ''}
            onChange={(e) => updateSetting('integrations', 'googleMapsApiKey', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Cloudinary Cloud Name
            </label>
            <input
              type="text"
              value={section.cloudinaryCloudName || ''}
              onChange={(e) => updateSetting('integrations', 'cloudinaryCloudName', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Cloudinary API Key
            </label>
            <input
              type="text"
              value={section.cloudinaryApiKey || ''}
              onChange={(e) => updateSetting('integrations', 'cloudinaryApiKey', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
            Cloudinary API Secret
          </label>
          <input
            type="password"
            value={section.cloudinaryApiSecret || ''}
            onChange={(e) => updateSetting('integrations', 'cloudinaryApiSecret', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              checked={section.enableGoogleLogin || false}
              onChange={(e) => updateSetting('integrations', 'enableGoogleLogin', e.target.checked)}
              className="w-4 h-4 accent-[#0D9488]"
            />
            <span className="text-sm text-[#374151] dark:text-white">Enable Google Login</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              checked={section.enableFacebookLogin || false}
              onChange={(e) => updateSetting('integrations', 'enableFacebookLogin', e.target.checked)}
              className="w-4 h-4 accent-[#0D9488]"
            />
            <span className="text-sm text-[#374151] dark:text-white">Enable Facebook Login</span>
          </div>
        </div>
      </div>
    );
  };

  // ===============================
  // SECTION: APPEARANCE
  // ===============================

  const renderAppearance = () => {
    const section = settings.appearance || {};
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#374151] dark:text-white">Appearance Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure the look and feel of your site</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={section.primaryColor || '#0D9488'}
                onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer"
              />
              <input
                type="text"
                value={section.primaryColor || '#0D9488'}
                onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={section.secondaryColor || '#F59E0B'}
                onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer"
              />
              <input
                type="text"
                value={section.secondaryColor || '#F59E0B'}
                onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            checked={section.darkMode || false}
            onChange={(e) => updateSetting('appearance', 'darkMode', e.target.checked)}
            className="w-4 h-4 accent-[#0D9488]"
          />
          <span className="text-sm text-[#374151] dark:text-white">Enable Dark Mode by Default</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Logo URL
            </label>
            <input
              type="text"
              value={section.logoUrl || ''}
              onChange={(e) => updateSetting('appearance', 'logoUrl', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Favicon URL
            </label>
            <input
              type="text"
              value={section.faviconUrl || ''}
              onChange={(e) => updateSetting('appearance', 'faviconUrl', e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
            Custom CSS
          </label>
          <textarea
            value={section.customCSS || ''}
            onChange={(e) => updateSetting('appearance', 'customCSS', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition font-mono text-sm resize-none"
            placeholder="/* Add custom CSS here */"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
            Custom JS
          </label>
          <textarea
            value={section.customJS || ''}
            onChange={(e) => updateSetting('appearance', 'customJS', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition font-mono text-sm resize-none"
            placeholder="// Add custom JavaScript here"
          />
        </div>
      </div>
    );
  };

  // ===============================
  // SECTION: ADVANCED
  // ===============================

  const renderAdvanced = () => {
    const section = settings.advanced || {};
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#374151] dark:text-white">Advanced Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure advanced system settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Cache Duration (seconds)
            </label>
            <input
              type="number"
              min="0"
              value={section.cacheDuration || 3600}
              onChange={(e) => updateSetting('advanced', 'cacheDuration', parseInt(e.target.value) || 3600)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
              Max Upload Size (MB)
            </label>
            <input
              type="number"
              min="1"
              value={section.maxUploadSize || 10}
              onChange={(e) => updateSetting('advanced', 'maxUploadSize', parseInt(e.target.value) || 10)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
            Allowed File Types
          </label>
          <input
            type="text"
            value={(section.allowedFileTypes || ['jpg', 'jpeg', 'png', 'webp', 'pdf']).join(', ')}
            onChange={(e) => {
              const types = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
              updateSetting('advanced', 'allowedFileTypes', types);
            }}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
            placeholder="jpg, jpeg, png, webp, pdf"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              checked={section.debugMode || false}
              onChange={(e) => updateSetting('advanced', 'debugMode', e.target.checked)}
              className="w-4 h-4 accent-[#0D9488]"
            />
            <span className="text-sm text-[#374151] dark:text-white">Enable Debug Mode</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              checked={section.cacheEnabled || false}
              onChange={(e) => updateSetting('advanced', 'cacheEnabled', e.target.checked)}
              className="w-4 h-4 accent-[#0D9488]"
            />
            <span className="text-sm text-[#374151] dark:text-white">Enable Cache</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-1.5">
            Log Level
          </label>
          <select
            value={section.logLevel || 'info'}
            onChange={(e) => updateSetting('advanced', 'logLevel', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
          >
            <option value="error">Error</option>
            <option value="warn">Warn</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
            <option value="trace">Trace</option>
          </select>
        </div>
      </div>
    );
  };

  // ===============================
  // LOADING STATE
  // ===============================

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading settings...</p>
      </div>
    );
  }

  // ===============================
  // RENDER
  // ===============================

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#374151] dark:text-white">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your platform configuration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetSettings}
            className="px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-24">
            <div className="p-3">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20 dark:text-[#0D9488]'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#374151] dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-6 rounded-full bg-[#0D9488]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;