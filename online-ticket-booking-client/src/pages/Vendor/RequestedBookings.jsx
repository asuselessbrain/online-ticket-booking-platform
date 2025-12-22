import { use, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";
import { AuthContext } from "../../providers/AuthContext";
import { toast } from "react-toastify";

const statusPill = (status) => {
  const map = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const cls = map[status] || "bg-gray-50 text-gray-700 border-gray-200";
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>{label}</span>;
};

const RequestedBookings = () => {
  const { user } = use(AuthContext);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // all | pending | confirmed | cancelled
  const [sort, setSort] = useState("-createdAt"); // -createdAt | createdAt | -total | total | -qty | qty
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Page reset handled inline in change handlers to avoid setState in effects

  const { data, isLoading, isError, error, refetch } = useQuery({
    enabled: !!user?.email,
    queryKey: [
      "vendorRequests",
      user?.email,
      { search, status, sort, page, limit },
    ],
    queryFn: async () => {
      const sortBy =
        sort === "-createdAt" ? "createdAt" :
        sort === "createdAt" ? "createdAt" :
        sort === "-total" ? "total" :
        sort === "total" ? "total" :
        sort === "-qty" ? "quantity" :
        "quantity";
      const sortOrder = sort.startsWith("-") ? "desc" : "asc";

      const params = {
        searchTerm: search || undefined,
        status: status === "all" ? undefined : status,
        sortBy,
        sortOrder,
        page,
        limit,
      };

      const res = await api.get(`/api/v1/bookings/vendor/${user.email}`, { params });
      return res.data;
    },
    keepPreviousData: true,
  });

  const rows = data?.data || [];
  const meta = data?.meta || { total: rows.length, page, limit };
  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / (meta.limit || limit)));
  const from = meta.total === 0 ? 0 : (meta.page - 1) * (meta.limit || limit) + 1;
  const to = meta.total === 0 ? 0 : Math.min(meta.page * (meta.limit || limit), meta.total);

  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.patch(`/api/v1/bookings/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Booking status updated");
      refetch();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
  });

  const handleAccept = (id) => mutation.mutate({ id, status: "confirmed" });
  const handleReject = (id) => mutation.mutate({ id, status: "cancelled" });

  // server-side filtering/sorting, so no client compute now

  return (
    <section>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Requested Bookings</h1>
          <div className="text-sm text-gray-600">
            {rows.length} of {meta.total} record{meta.total !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search user or ticket..."
            className="w-full sm:w-64 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Accepted</option>
            <option value="cancelled">Rejected</option>
          </select>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
          >
            <option value="-createdAt">Newest first</option>
            <option value="createdAt">Oldest first</option>
            <option value="-total">Total: high → low</option>
            <option value="total">Total: low → high</option>
            <option value="-qty">Quantity: high → low</option>
            <option value="qty">Quantity: low → high</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-gray-600">Loading...</div>
      )}

      {isError && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-rose-600">
          Failed to load requests: {error?.message}
        </div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No booking requests yet</h2>
          <p className="text-gray-600">New requests from users will appear here.</p>
        </div>
      )}

      {!isLoading && !isError && rows.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => {
                const isPending = row.status === 'pending';
                return (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div className="font-semibold text-gray-900">{row.userName}</div>
                      <div className="text-gray-600">{row.userEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{row.ticket?.ticketTitle || row.ticketId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">${(row.totalPrice || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">{statusPill(row.status)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleAccept(row._id)}
                          disabled={!isPending || mutation.isPending}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(row._id)}
                          disabled={!isPending || mutation.isPending}
                          className="px-3 py-1.5 bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Showing {from}-{to} of {meta.total}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">Page {meta.page} of {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={meta.page >= totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50"
            >
              Next
            </button>
            <select
              value={meta.limit || limit}
              onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
              className="ml-2 px-3 py-2 border border-gray-200 rounded-lg bg-white"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      )}
    </section>
  );
};

export default RequestedBookings;
