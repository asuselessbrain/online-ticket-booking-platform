import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Fetch users
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allUsers", { page, limit, searchTerm, roleFilter }],
    queryFn: async () => {
      const res = await api.get("/api/v1/users", {
        params: {
          page,
          limit,
          searchTerm: searchTerm || undefined,
          role: roleFilter || undefined,
        },
      });
      const payload = res.data?.data;
      return payload || { data: [], meta: { page: 1, limit, total: 0 } };
    },
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const res = await api.patch(`/api/v1/users/${userId}`, { role });
      return res.data;
    },
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update role");
    },
  });

  // Mark as fraud mutation
  const markFraudMutation = useMutation({
    mutationFn: async ({ userId, isFraud }) => {
      const res = await api.patch(`/api/v1/users/${userId}/fraud`, { isFraud });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Fraud status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update fraud status");
    },
  });

  const handleMakeAdmin = (user) => {
    if (window.confirm(`Make ${user.name} an Admin?`)) {
      updateRoleMutation.mutate({ userId: user._id || user.id, role: "admin" });
    }
  };

  const handleMakeVendor = (user) => {
    if (window.confirm(`Make ${user.name} a Vendor?`)) {
      updateRoleMutation.mutate({ userId: user._id || user.id, role: "vendor" });
    }
  };

  const handleMarkAsFraud = (user) => {
    const newFraudStatus = !user.isFraud;
    const action = newFraudStatus ? "mark as fraud" : "remove fraud status from";
    
    if (window.confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      markFraudMutation.mutate({ userId: user._id || user.id, isFraud: newFraudStatus });
    }
  };

  const users = data?.data || [];
  const total = data?.meta?.total || 0;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="border rounded px-3 py-2"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
        <button
          className="border rounded px-3 py-2 bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            setSearchTerm("");
            setRoleFilter("");
            setPage(1);
          }}
        >
          Clear Filters
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-600">
          <span className="inline-block w-4 h-4 border-2 border-[#01602a] border-r-transparent rounded-full animate-spin" />
          Loading users...
        </div>
      )}

      {isError && <p className="text-red-600">Failed to load users.</p>}

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id || user.id} className="border-t">
                <td className="p-3">
                  <img
                    src={user.imageUrl || "https://via.placeholder.com/40"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded capitalize ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "vendor"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td className="p-3">
                  {user.role === "vendor" && user.isFraud && (
                    <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                      Fraud
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        disabled={updateRoleMutation.isPending}
                        className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role !== "vendor" && (
                      <button
                        onClick={() => handleMakeVendor(user)}
                        disabled={updateRoleMutation.isPending}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Make Vendor
                      </button>
                    )}
                    {user.role === "vendor" && (
                      <button
                        onClick={() => handleMarkAsFraud(user)}
                        disabled={markFraudMutation.isPending}
                        className={`px-3 py-1 text-xs rounded disabled:opacity-50 ${
                          user.isFraud
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {user.isFraud ? "Remove Fraud" : "Mark as Fraud"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && !isLoading && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span>
            Page {page} of {Math.ceil(total / limit) || 1}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total}
          >
            Next
          </button>
        </div>
        <select
          className="border rounded px-2 py-1"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </section>
  );
};

export default ManageUsers;
