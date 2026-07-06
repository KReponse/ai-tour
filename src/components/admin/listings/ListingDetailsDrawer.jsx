// src/components/admin/listings/ListingDetailsDrawer.jsx

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Trash2,
  Eye,
  Image,
  Video,
  Building2,
  Mail,
  Phone,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import ListingStatusBadge from '../../listing/ListingStatusBadge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return image;
  return `${API_URL}/uploads/${image}`;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const InfoRow = ({ label, value, link }) => {
  if (!value) return null;
  return (
    <div className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      {link ? (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#0D9488] hover:underline flex items-center gap-1 break-all"
        >
          {value.replace(/^https?:\/\//, '')}
        </a>
      ) : (
        <p className="text-sm font-medium text-[#374151] dark:text-white break-words">{value}</p>
      )}
    </div>
  );
};

const Section = ({ title, icon: Icon, children, expanded: defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#0D9488]" />
          <span className="font-bold text-[#374151] dark:text-white">{title}</span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {expanded && <div className="p-4 pt-0">{children}</div>}
    </div>
  );
};

const ListingDetailsDrawer = ({
  isOpen,
  onClose,
  listing,
  onApprove,
  onReject,
  onSuspend,
  onDelete,
  actionLoading,
}) => {
  if (!isOpen || !listing) return null;

  const isPending = listing.status === 'pending';
  const isApproved = listing.status === 'approved';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-white dark:bg-gray-950 shadow-2xl overflow-y-auto animate-slideInRight">
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#374151] dark:text-white">
              Listing Details
            </h2>
            <p className="text-sm text-gray-500">{listing.businessType?.replace('_', ' ')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ── Status Banner ── */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <ListingStatusBadge status={listing.status} size="lg" />
            <span className="text-sm text-gray-500">
              Created {formatDate(listing.createdAt)}
            </span>
            {listing.updatedAt !== listing.createdAt && (
              <span className="text-sm text-gray-400">
                • Updated {formatDate(listing.updatedAt)}
              </span>
            )}
          </div>

          {/* ── Basic Info ── */}
          <Section title="Basic Information" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Title" value={listing.title} />
              <InfoRow label="Location" value={listing.location} />
              <InfoRow label="Price" value={listing.price ? `$${listing.price}` : null} />
              <InfoRow label="Duration" value={listing.duration} />
              <InfoRow label="Capacity" value={listing.capacity ? `${listing.capacity} people` : null} />
              <InfoRow label="Listing Type" value={listing.listingType} />
              <InfoRow label="Category" value={listing.category} />
            </div>
          </Section>

          {/* ── Description ── */}
          {listing.description && (
            <Section title="Description" icon={MapPin}>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {listing.description}
              </p>
            </Section>
          )}

          {/* ── Highlights ── */}
          {listing.highlights && (
            <Section title="Highlights" icon={Star}>
              <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                {listing.highlights}
              </div>
            </Section>
          )}

          {/* ── Included / Excluded ── */}
          {(listing.included || listing.excluded) && (
            <Section title="Included & Excluded" icon={CheckCircle}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.included && (
                  <div>
                    <p className="text-sm font-semibold text-[#0D9488] mb-1">Included</p>
                    <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {listing.included}
                    </div>
                  </div>
                )}
                {listing.excluded && (
                  <div>
                    <p className="text-sm font-semibold text-red-500 mb-1">Excluded</p>
                    <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {listing.excluded}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* ── Requirements & Policies ── */}
          {(listing.requirements || listing.cancellationPolicy || listing.meetingPoint) && (
            <Section title="Requirements & Policies" icon={Clock}>
              <div className="space-y-3">
                {listing.meetingPoint && <InfoRow label="Meeting Point" value={listing.meetingPoint} />}
                {listing.requirements && <InfoRow label="Requirements" value={listing.requirements} />}
                {listing.cancellationPolicy && <InfoRow label="Cancellation Policy" value={listing.cancellationPolicy} />}
              </div>
            </Section>
          )}

          {/* ── Business-Specific Fields ── */}
          {(listing.amenities || listing.menu || listing.vehicleType || listing.seats) && (
            <Section title="Business Details" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.amenities && <InfoRow label="Amenities" value={listing.amenities} />}
                {listing.menu && <InfoRow label="Menu" value={listing.menu} />}
                {listing.vehicleType && <InfoRow label="Vehicle Type" value={listing.vehicleType} />}
                {listing.seats > 0 && <InfoRow label="Seats" value={listing.seats} />}
              </div>
            </Section>
          )}

          {/* ── Provider Info ── */}
          {listing.provider && (
            <Section title="Provider" icon={Users}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Name" value={listing.provider.name} />
                <InfoRow label="Email" value={listing.provider.email} link />
              </div>
            </Section>
          )}

          {/* ── Media ── */}
          <Section title="Media" icon={Image}>
            {listing.coverImage && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-[#0D9488] mb-2">Cover Image</p>
                <img
                  src={getImageUrl(listing.coverImage)}
                  alt={listing.title}
                  className="w-full max-h-64 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
            {listing.galleryImages?.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-[#0D9488] mb-2">Gallery ({listing.galleryImages.length})</p>
                <div className="grid grid-cols-3 gap-2">
                  {listing.galleryImages.slice(0, 6).map((img, i) => (
                    <img
                      key={i}
                      src={getImageUrl(img)}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  ))}
                  {listing.galleryImages.length > 6 && (
                    <div className="w-full h-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-500">
                      +{listing.galleryImages.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            )}
            {listing.videos?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[#0D9488] mb-2">Videos ({listing.videos.length})</p>
                <div className="space-y-2">
                  {listing.videos.slice(0, 3).map((video, i) => (
                    <video
                      key={i}
                      src={getImageUrl(video)}
                      controls
                      className="w-full max-h-48 rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  ))}
                  {listing.videos.length > 3 && (
                    <p className="text-sm text-gray-500">+{listing.videos.length - 3} more videos</p>
                  )}
                </div>
              </div>
            )}
          </Section>

          {/* ── Admin Actions ── */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <p className="text-sm font-bold text-[#374151] dark:text-white mb-4">Admin Actions</p>
            <div className="flex flex-wrap gap-3">
              {isPending && (
                <>
                  <button
                    onClick={() => onApprove(listing._id)}
                    disabled={actionLoading === listing._id}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D9488] text-white font-medium hover:bg-[#0D9488]/80 transition disabled:opacity-50"
                  >
                    {actionLoading === listing._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Approve
                  </button>

                  <button
                    onClick={() => onReject(listing._id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}

              {isApproved && (
                <button
                  onClick={() => onSuspend(listing._id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] text-white font-medium hover:bg-[#F59E0B]/80 transition"
                >
                  <Ban className="w-4 h-4" />
                  Suspend
                </button>
              )}

              <button
                onClick={() => onDelete(listing._id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ListingDetailsDrawer;