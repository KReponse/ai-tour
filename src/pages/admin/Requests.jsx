import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, MapPin, DollarSign, User } from "lucide-react";

const Requests = () => {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data.requests || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* STATUS COLORS */
  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    rejected:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Travel Requests
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage traveler trip requests
        </p>
      </div>

      {/* EMPTY STATE */}
      {requests.length === 0 ? (

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 text-center">

          <MapPin className="mx-auto mb-3 text-gray-400" size={40} />

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            No Requests Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Travel requests will appear here once users submit them.
          </p>

        </div>

      ) : (

        <div className="overflow-x-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg">

          <table className="w-full">

            {/* HEADER */}
            <thead>

              <tr className="border-b border-gray-200 dark:border-gray-800">

                <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                  Traveler
                </th>

                <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                  Destination
                </th>

                <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                  Budget
                </th>

                <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                  Status
                </th>

              </tr>

            </thead>

            {/* BODY */}
            <tbody>

              {requests.map((request) => (

                <tr
                  key={request._id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                >

                  {/* TRAVELER */}
                  <td className="p-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    {request.user?.name}
                  </td>

                  {/* DESTINATION */}
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {request.destination}
                  </td>

                  {/* BUDGET */}
                  <td className="p-4 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <DollarSign size={16} />
                    ${request.budget}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[request.status] ||
                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {request.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

};

export default Requests;