"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorRoles, setErrorRoles] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const { user } = useAuth();

  // Update `isAdmin` whenever `user` changes
  useEffect(() => {
    setIsAdmin(user?.role === "Admin");
  }, [user]);

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/role/getRole");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setRoles(data.map((role) => role.name)); // Extract role names
        setLoadingRoles(false);
      } catch (error) {
        setErrorRoles(error.message);
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/getUser");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
        setLoadingUsers(false);
      } catch (error) {
        setErrorUsers(error.message);
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const updateRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/role/updateRole`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const updatedUser = await response.json();

      // Update the user's role in the UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? { ...user, role: updatedUser.role } : user
        )
      );
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/user/deleteUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const { user } = await response.json();

      // Remove the user from the UI
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users List</h2>

        {loadingUsers || loadingRoles ? (
          <p className="text-gray-600">Loading...</p>
        ) : errorUsers || errorRoles ? (
          <p className="text-red-500">{errorUsers || errorRoles}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-4">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{user.email}</td>
                    <td className="py-4 px-6 text-gray-700">
                      {isAdmin ? (
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user._id, e.target.value)}
                          className="bg-gray-200 border border-gray-300 rounded p-1"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-700">{user.status}</td>
                    <td className="py-4 px-6 text-center">
                      {isAdmin && (
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
