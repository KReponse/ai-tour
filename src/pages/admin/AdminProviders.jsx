import React,
{
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

const AdminProviders = () => {

  const [providers,
    setProviders] =
    useState([]);

  const fetchProviders =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        const { data } =
          await axios.get(

            'http://localhost:5000/api/admin/providers',

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );

        setProviders(
          data.providers
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchProviders();

  }, []);

  const suspendProvider =
    async (id) => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        await axios.put(

          `http://localhost:5000/api/admin/providers/${id}/suspend`,

          {},

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );

        fetchProviders();

      } catch (error) {

        console.log(error);

      }

    };

  const activateProvider =
    async (id) => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        await axios.put(

          `http://localhost:5000/api/admin/providers/${id}/activate`,

          {},

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );

        fetchProviders();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Providers Management
      </h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="bg-gray-100">

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {providers.map(
              (provider) => (

                <tr
                  key={provider._id}
                  className="border-t"
                >

                  <td className="p-4">
                    {provider.name}
                  </td>

                  <td className="p-4">
                    {provider.email}
                  </td>

                  <td className="p-4">

                    <span
                      className={`
                        px-3 py-1 rounded-full text-sm
                        ${
                          provider.status ===
                          'active'

                            ? 'bg-green-100 text-green-700'

                            : 'bg-red-100 text-red-700'
                        }
                      `}
                    >

                      {provider.status}

                    </span>

                  </td>

                  <td className="p-4 flex gap-2">

                    {provider.status ===
                    'active' ? (

                      <button
                        onClick={() =>
                          suspendProvider(
                            provider._id
                          )
                        }
                        className="
                          px-4 py-2
                          bg-red-500
                          text-white
                          rounded-lg
                        "
                      >

                        Suspend

                      </button>

                    ) : (

                      <button
                        onClick={() =>
                          activateProvider(
                            provider._id
                          )
                        }
                        className="
                          px-4 py-2
                          bg-green-500
                          text-white
                          rounded-lg
                        "
                      >

                        Activate

                      </button>

                    )}

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

export default AdminProviders;