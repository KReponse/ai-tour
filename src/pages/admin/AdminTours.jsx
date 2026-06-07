import React,
{
  useEffect,
  useState,
} from 'react';

import {

  getAllTours,
  deleteTour,

} from '../../services/adminService';

const AdminTours = () => {

  const [tours,
    setTours] =
    useState([]);

  useEffect(() => {

    fetchTours();

  }, []);

  const fetchTours =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        const data =
          await getAllTours(
            token
          );

        setTours(
          data.tours
        );

      } catch (error) {

        console.log(error);

      }

    };

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(

          'Delete this tour?'

        );

      if (
        !confirmDelete
      ) return;

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        await deleteTour(

          id,

          token

        );

        fetchTours();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="p-8">

      <h1 className="
        text-3xl
        font-black
        mb-8
      ">
        Tours Management
      </h1>

      <div className="
        bg-white
        rounded-3xl
        shadow-lg
        overflow-hidden
      ">

        <table className="w-full">

          <thead>

            <tr className="bg-gray-100">

              <th className="p-4">
                Tour
              </th>

              <th className="p-4">
                Provider
              </th>

              <th className="p-4">
                Price
              </th>

              <th className="p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {tours.map(
              (tour) => (

                <tr
                  key={tour._id}
                  className="
                    border-t
                  "
                >

                  <td className="p-4">

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <img

                        src={
                          tour.image

                            ? `http://localhost:5000/uploads/${tour.image}`

                            : 'https://via.placeholder.com/80'
                        }

                        alt=""

                        className="
                          w-16
                          h-16
                          object-cover
                          rounded-xl
                        "
                      />

                      <div>

                        <h3 className="
                          font-bold
                        ">
                          {tour.title}
                        </h3>

                        <p className="
                          text-sm
                          text-gray-500
                        ">
                          {tour.location}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="p-4">

                    {
                      tour.provider?.name ||
                      'N/A'
                    }

                  </td>

                  <td className="p-4">

                    $
                    {
                      tour.price
                    }

                  </td>

                  <td className="p-4">

                    <button

                      onClick={() =>
                        handleDelete(
                          tour._id
                        )
                      }

                      className="
                        px-4
                        py-2
                        bg-red-500
                        text-white
                        rounded-xl
                      "
                    >

                      Delete

                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default AdminTours;