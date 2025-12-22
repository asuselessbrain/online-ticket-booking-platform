import { use, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthContext";
import api from "../../lib/axios";

const normalizeStatus = (status) => {
  if (!status) return "pending";
  const lowered = status.toLowerCase();
  if (lowered === "confirmed") return "accepted";
  if (lowered === "cancelled") return "rejected";
  return lowered;
};

const badgeClasses = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  paid: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TransactionHistory = () => {
  const { user } = use(AuthContext);

  const { data, isLoading, isError } = useQuery({
    enabled: !!user?.email,
    queryKey: ["transactions", user?.email],
    queryFn: async () => {
      const res = await api.get(`/api/v1/bookings/user/${user.email}`);
      return res.data?.data || [];
    },
  });

  const rows = useMemo(() => {
    if (!data) return [];
    return [...data]
      .map((item) => ({
        ...item,
        status: normalizeStatus(item.status),
      }))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#01602a]">Transactions</p>
          <h1 className="text-3xl font-bold text-gray-900">Payment & booking history</h1>
          <p className="text-gray-600 mt-2">Track every booking request and payment attempt in one place.</p>
        </div>
        <div className="bg-gray-50 px-4 py-3 rounded-xl text-sm text-gray-700 border border-gray-100">
          {rows.length} record{rows.length !== 1 ? "s" : ""}
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-gray-600">Loading transactions...</div>
      )}

      {isError && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-rose-600">Unable to load transactions right now.</div>
      )}

      {!isLoading && !isError && !rows.length && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No transactions yet</h2>
          <p className="text-gray-600">Bookings you make will appear here along with their payment status.</p>
        </div>
      )}

      {!isLoading && !isError && rows.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{row.ticketId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-semibold">${(row.totalPrice || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${badgeClasses[row.status] || badgeClasses.pending}`}>
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
