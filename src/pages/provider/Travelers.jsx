import React,
{
  useEffect,
  useState,
} from 'react';

import {
  Users,
  Loader2,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';

import {
  getProviderTravelers,
} from '../../services/bookingService';

const Travelers = () => {

  const [travelers,
    setTravelers] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchTravelers();

  }, []);

  const fetchTravelers =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        const data =
          await getProviderTravelers(
            token
          );

        setTravelers(
          data.travelers || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (

      <div className="
        flex
        justify-center
        items-center
        py-20
      ">
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

    <div className="space-y-6">

      <div>

        <h1 className="
          text-3xl
          font-black
          text-gray-900
          dark:text-white
        ">
          Travelers
        </h1>

        <p className="
          text-gray-500
          dark:text-gray-400
          mt-1
        ">
          All travelers who booked tours
        </p>

      </div>

      <div className="
        bg-white
        dark:bg-gray-900
        rounded-3xl
        border
        border-gray-200
        dark:border-gray-800
        overflow-hidden
      ">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="
                border-b
                border-gray-200
                dark:border-gray-800
              ">

                <th className="p-4 text-left">
                  Traveler
                </th>

                <th className="p-4 text-left">
                  Tour
                </th>

                <th className="p-4 text-left">
                  Travel Date
                </th>

                <th className="p-4 text-left">
                  Payment
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {travelers.map(
                (traveler) => (

                  <tr
                    key={
                      traveler._id
                    }
                    className="
                      border-b
                      border-gray-100
                      dark:border-gray-800
                    "
                  >

                    <td className="p-4">

                      <div>

                        <h3 className="
                          font-bold
                          dark:text-white
                        ">
                          {
                            traveler.fullName
                          }
                        </h3>

                        <div className="
                          text-sm
                          text-gray-500
                          mt-1
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                          ">

                            <Mail size={14} />

                            {
                              traveler.email
                            }

                          </div>

                          <div className="
                            flex
                            items-center
                            gap-2
                            mt-1
                          ">

                            <Phone size={14} />

                            {
                              traveler.phone
                            }

                          </div>

                        </div>

                      </div>

                    </td>

                    <td className="p-4">

                      {
                        traveler.tour
                          ?.title
                      }

                    </td>

                    <td className="p-4">

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <Calendar
                          size={16}
                        />

                        {
                          new Date(
                            traveler.travelDate
                          ).toLocaleDateString()
                        }

                      </div>

                    </td>

                    <td className="p-4">

                      <span className="
                        px-3
                        py-1
                        rounded-full
                        bg-green-100
                        text-green-700
                        text-sm
                        font-semibold
                      ">

                        {
                          traveler.paymentStatus
                        }

                      </span>

                    </td>

                    <td className="p-4">

                      <span className="
                        px-3
                        py-1
                        rounded-full
                        bg-blue-100
                        text-blue-700
                        text-sm
                        font-semibold
                      ">

                        {
                          traveler.status
                        }

                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};

export default Travelers;