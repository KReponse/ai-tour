import React, {
  useEffect,
  useState,
} from "react";

import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  getProviderRequests,
  updateProviderRequest,
} from "../../services/adminService";

const ProviderRequests = () => {
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const fetchRequests =
    async () => {
      try {
        const data =
          await getProviderRequests();

        setRequests(
          data.requests || []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatus =
    async (id, status) => {
      try {
        await updateProviderRequest(
          id,
          status
        );

        fetchRequests();
      } catch (error) {
        console.log(error);
      }
    };

  const filteredRequests =
    requests.filter((req) => {
      const term =
        search.toLowerCase();

      return (
        req.businessName
          ?.toLowerCase()
          .includes(term) ||
        req.email
          ?.toLowerCase()
          .includes(term) ||
        req.country
          ?.toLowerCase()
          .includes(term)
      );
    });

  const statusBadge = (
    status
  ) => {
    switch (status) {
      case "approved":
        return (
          <span
            className="
            px-3 py-1
            rounded-full
            text-sm font-semibold
            bg-green-100
            text-green-700
          "
          >
            Approved
          </span>
        );

      case "rejected":
        return (
          <span
            className="
            px-3 py-1
            rounded-full
            text-sm font-semibold
            bg-red-100
            text-red-700
          "
          >
            Rejected
          </span>
        );

      case "needs_information":
        return (
          <span
            className="
            px-3 py-1
            rounded-full
            text-sm font-semibold
            bg-yellow-100
            text-yellow-700
          "
          >
            Needs Info
          </span>
        );

      default:
        return (
          <span
            className="
            px-3 py-1
            rounded-full
            text-sm font-semibold
            bg-blue-100
            text-blue-700
          "
          >
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div
        className="
        flex
        justify-center
        items-center
        py-20
      "
      >
        <Loader2
          className="
          animate-spin
          w-10
          h-10
          text-blue-600
        "
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1
          className="
          text-3xl
          font-black
          dark:text-white
        "
        >
          Provider Requests
        </h1>

        <p
          className="
          text-gray-500
          mt-1
        "
        >
          Manage provider applications
        </p>
      </div>

      {/* Search */}

      <div
        className="
        bg-white
        dark:bg-gray-900
        rounded-2xl
        border
        border-gray-200
        dark:border-gray-800
        p-4
      "
      >
        <div className="relative">
          <Search
            className="
            absolute
            left-3
            top-3
            w-5
            h-5
            text-gray-400
          "
          />

          <input
            type="text"
            placeholder="Search provider..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full
              pl-10
              pr-4
              py-3
              border
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>
      </div>

      {/* Requests */}

      <div className="grid gap-5">

        {filteredRequests.map(
          (request) => (
            <div
              key={request._id}
              className="
                bg-white
                dark:bg-gray-900
                rounded-3xl
                border
                border-gray-200
                dark:border-gray-800
                p-6
                shadow-sm
              "
            >
              <div
                className="
                flex
                justify-between
                flex-wrap
                gap-4
              "
              >
                <div>

                  <div
                    className="
                    flex
                    items-center
                    gap-2
                  "
                  >
                    <Building2
                      className="
                      w-5 h-5
                      text-blue-600
                    "
                    />

                    <h2
                      className="
                      text-xl
                      font-bold
                    "
                    >
                      {
                        request.businessName
                      }
                    </h2>
                  </div>

                  <div
                    className="
                    mt-3
                    space-y-2
                    text-gray-600
                  "
                  >
                    <p className="flex items-center gap-2">
                      <Mail size={16} />
                      {request.email}
                    </p>

                    <p className="flex items-center gap-2">
                      <Phone size={16} />
                      {request.phone}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {request.city},{" "}
                      {request.country}
                    </p>
                  </div>
                </div>

                {statusBadge(
                  request.status
                )}
              </div>

              <div className="mt-5">
                <h3
                  className="
                  font-semibold
                  mb-2
                "
                >
                  Description
                </h3>

                <p
                  className="
                  text-gray-600
                "
                >
                  {
                    request.description
                  }
                </p>
              </div>

              {request.status ===
                "pending" && (
                <div
                  className="
                  flex
                  flex-wrap
                  gap-3
                  mt-6
                "
                >
                  <button
                    onClick={() =>
                      handleStatus(
                        request._id,
                        "approved"
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-5
                      py-2
                      rounded-xl
                      bg-green-600
                      text-white
                      hover:bg-green-700
                    "
                  >
                    <CheckCircle
                      size={18}
                    />
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleStatus(
                        request._id,
                        "rejected"
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-5
                      py-2
                      rounded-xl
                      bg-red-600
                      text-white
                      hover:bg-red-700
                    "
                  >
                    <XCircle
                      size={18}
                    />
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      handleStatus(
                        request._id,
                        "needs_information"
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-5
                      py-2
                      rounded-xl
                      bg-yellow-500
                      text-white
                      hover:bg-yellow-600
                    "
                  >
                    <AlertCircle
                      size={18}
                    />
                    Need Info
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {filteredRequests.length ===
          0 && (
          <div
            className="
            text-center
            py-16
            bg-white
            rounded-3xl
            border
          "
          >
            <h3
              className="
              text-lg
              font-semibold
            "
            >
              No Provider Requests Found
            </h3>

            <p
              className="
              text-gray-500
              mt-2
            "
            >
              Try another search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderRequests;