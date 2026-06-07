import React,
{
  useEffect,
  useState,
} from 'react';

import {
  Loader2,
  MapPin,
} from 'lucide-react';

import {
  getRequests,
  updateRequestStatus,
}
from '../../services/requestService';

const Requests = () => {

  const [requests,
    setRequests] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchRequests();

  }, []);

  const fetchRequests =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        const data =
          await getRequests(
            token
          );

        setRequests(
          data.requests || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const handleStatus =
    async (
      id,
      status
    ) => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        await updateRequestStatus(

          id,

          status,

          token

        );

        fetchRequests();

      } catch (error) {

        console.log(error);

      }

    };

  if (loading) {

    return (

      <div className="
        flex
        justify-center
        py-20
      ">
        <Loader2
          className="
            animate-spin
            w-8
            h-8
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
          dark:text-white
        ">
          Trip Requests
        </h1>

        <p className="
          text-gray-500
          mt-1
        ">
          Custom requests from travelers
        </p>

      </div>

      <div className="grid gap-5">

        {requests.map(
          (request) => (

            <div
              key={
                request._id
              }
              className="
                bg-white
                dark:bg-gray-900
                rounded-3xl
                p-6
                border
                border-gray-200
                dark:border-gray-800
              "
            >

              <div className="
                flex
                justify-between
                gap-4
                flex-wrap
              ">

                <div>

                  <h2 className="
                    text-xl
                    font-bold
                  ">
                    {
                      request.destination
                    }
                  </h2>

                  <p className="
                    text-gray-500
                  ">
                    {
                      request.user
                        ?.email
                    }
                  </p>

                </div>

                <span className="
                  px-4
                  py-2
                  rounded-full
                  bg-blue-100
                  text-blue-700
                  font-semibold
                ">
                  {
                    request.status
                  }
                </span>

              </div>

              <div className="
                mt-4
                grid
                md:grid-cols-3
                gap-4
              ">

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Travelers
                  </p>

                  <p>
                    {
                      request.travelers
                    }
                  </p>

                </div>

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Budget
                  </p>

                  <p>
                    {
                      request.budget
                    }
                  </p>

                </div>

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Accommodation
                  </p>

                  <p>
                    {
                      request.accommodation
                    }
                  </p>

                </div>

              </div>

              <p className="
                mt-4
                text-gray-600
              ">
                {
                  request.specialRequests
                }
              </p>

              {request.status ===
                'pending' && (

                <div className="
                  flex
                  gap-3
                  mt-5
                ">

                  <button

                    onClick={() =>
                      handleStatus(
                        request._id,
                        'accepted'
                      )
                    }

                    className="
                      px-5
                      py-2
                      bg-green-600
                      text-white
                      rounded-xl
                    "
                  >

                    Accept

                  </button>

                  <button

                    onClick={() =>
                      handleStatus(
                        request._id,
                        'rejected'
                      )
                    }

                    className="
                      px-5
                      py-2
                      bg-red-600
                      text-white
                      rounded-xl
                    "
                  >

                    Reject

                  </button>

                </div>

              )}

            </div>

          )
        )}

      </div>

    </div>

  );

};

export default Requests;