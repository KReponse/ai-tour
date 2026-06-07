import React,
{
  useEffect,
  useState,
} from 'react';

import {
  getAllUsers,
  updateUserRole,
}
from '../../services/adminService';

const AdminUsers = () => {

  const [users,
    setUsers] =
    useState([]);

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        const data =
          await getAllUsers(
            token
          );

        setUsers(
          data.users
        );

      } catch (error) {

        console.log(error);

      }

    };

  const handleRoleChange =
    async (
      id,
      role
    ) => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        await updateUserRole(

          id,

          role,

          token

        );

        fetchUsers();

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
        Users Management
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
                Name
              </th>

              <th className="p-4">
                Email
              </th>

              <th className="p-4">
                Role
              </th>

              <th className="p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map(
              (user) => (

                <tr
                  key={user._id}
                  className="
                    border-t
                  "
                >

                  <td className="p-4">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">
                    {user.role}
                  </td>

                  <td className="p-4">

                    <select

                      value={
                        user.role
                      }

                      onChange={
                        (e) =>

                          handleRoleChange(

                            user._id,

                            e.target.value

                          )
                      }

                      className="
                        border
                        rounded-xl
                        px-3
                        py-2
                      "
                    >

                      <option value="user">
                        User
                      </option>

                      <option value="provider">
                        Provider
                      </option>

                      <option value="admin">
                        Admin
                      </option>

                    </select>

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

export default AdminUsers;