
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
} from 'lucide-react';

const API =
  'http://localhost:5000/api/admin';

const Tours = () => {

  const [tours, setTours] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const token =
    localStorage.getItem('token');

  const fetchTours =
    async () => {

      try {

        const { data } =
          await axios.get(
            `${API}/tours`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setTours(
          data.tours || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchTours();

  }, []);

  const approveTour =
    async (id) => {

      try {

        await axios.put(
          `${API}/tours/${id}/approve`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchTours();

      } catch (error) {

        console.log(error);

      }

    };

  const rejectTour =
    async (id) => {

      try {

        await axios.put(
          `${API}/tours/${id}/reject`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchTours();

      } catch (error) {

        console.log(error);

      }

    };

  const deleteTour =
    async (id) => {

      if (
        !window.confirm(
          'Delete this tour?'
        )
      ) return;

      try {

        await axios.delete(
          `${API}/tours/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchTours();

      } catch (error) {

        console.log(error);

      }

    };

  if (loading) {

    return (

      <div className="flex justify-center items-center h-[300px]">

        <Loader2
          className="
            w-8 h-8
            animate-spin
            text-blue-600
          "
        />

      </div>

    );

  }

  return (

    <div className="p-6">

      <div className="mb-6">

        <h1
          className="
            text-3xl
            font-bold
            text-gray-900
            dark:text-white
          "
        >

          Tours Management

        </h1>

        <p
          className="
            text-gray-500
            dark:text-gray-400
            mt-2
          "
        >

          Manage all tourism provider tours

        </p>

      </div>

      <div
        className="
          overflow-x-auto
          bg-white
          dark:bg-gray-900
          rounded-3xl
          shadow-lg
          border
          border-gray-100
          dark:border-gray-800
        "
      >

        <table className="w-full">

          <thead>

            <tr
              className="
                border-b
                border-gray-200
                dark:border-gray-800
              "
            >

              <th
                className="
                  p-4 text-left
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Tour
              </th>

              <th
                className="
                  p-4 text-left
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Provider
              </th>

              <th
                className="
                  p-4 text-left
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Price
              </th>

              <th
                className="
                  p-4 text-left
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Status
              </th>

              <th
                className="
                  p-4 text-left
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {tours.map((tour) => (

              <tr
                key={tour._id}
                className="
                  border-b
                  border-gray-100
                  dark:border-gray-800
                  hover:bg-gray-50
                  dark:hover:bg-gray-800/50
                  transition-colors
                "
              >

                <td
                  className="
                    p-4
                    font-medium
                    text-gray-900
                    dark:text-white
                  "
                >

                  {tour.title}

                </td>

                <td
                  className="
                    p-4
                    text-gray-600
                    dark:text-gray-300
                  "
                >

                  {tour.provider?.name}

                </td>

                <td
                  className="
                    p-4
                    text-gray-600
                    dark:text-gray-300
                  "
                >

                  ${tour.price}

                </td>

                <td className="p-4">

                  <span
                    className={`
                      px-3 py-1
                      rounded-full
                      text-sm
                      font-semibold
                      ${
                        tour.status ===
                        'approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : tour.status ===
                            'rejected'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }
                    `}
                  >

                    {tour.status}

                  </span>

                </td>

                <td className="p-4">

                  <div className="flex gap-2 flex-wrap">

                    <button
                      onClick={() =>
                        approveTour(
                          tour._id
                        )
                      }
                      className="
                        flex items-center gap-2
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        px-3 py-2
                        rounded-xl
                        transition-colors
                      "
                    >

                      <CheckCircle size={16} />

                      Approve

                    </button>

                    <button
                      onClick={() =>
                        rejectTour(
                          tour._id
                        )
                      }
                      className="
                        flex items-center gap-2
                        bg-yellow-500
                        hover:bg-yellow-600
                        text-white
                        px-3 py-2
                        rounded-xl
                        transition-colors
                      "
                    >

                      <XCircle size={16} />

                      Reject

                    </button>

                    <button
                      onClick={() =>
                        deleteTour(
                          tour._id
                        )
                      }
                      className="
                        flex items-center gap-2
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        px-3 py-2
                        rounded-xl
                        transition-colors
                      "
                    >

                      <Trash2 size={16} />

                      Delete

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Tours;

