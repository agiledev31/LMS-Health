import React, { useEffect, useState } from "react";
import Search from "../../components/main/Search";
import Filter from "../../components/main/Filter";
import Breadcrumb from "../../components/main/Breadcrumb";
import Label from "../../components/common/Label";
import { Link } from "react-router-dom";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { format } from "date-fns";

function Users() {
  const authHttpClient = useAuthHttpClient();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const pages = [{ name: "Users", current: true }];

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await authHttpClient.get("auth/");
        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="-mt-4 mb-6">
        <Breadcrumb pages={pages} />
      </div>
      <div className="flex justify-between">
        <div className="text-3xl font-bold">Users</div>
      </div>
      <div className="mt-4 -mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 p-4 bg-gray-50  border-t-2 border-gray-200">
        {/* <div className="p-4 flex flex-row-reverse gap-4">
          <div className="bg-white">
            <Filter />
          </div>
          <Search />
        </div> */}

        <table className="min-w-full divide-y divide-gray-300">
          <thead className="divide-y divide-gray-200 bg-white">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 flex items-center gap-2"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Verification
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Created at
              </th>
              {/* <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Progress rate
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user._id} className="even:bg-gray-50">
                <td className="whitespace-wrap font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 flex items-center gap-2">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <Label>{user.verified ? "Verified":"Not verified"}</Label>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {format(new Date(user.createdAt), "MMM dd, yyyy")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
