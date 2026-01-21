import { use, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthContext";
import api from "../../lib/axios";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import Loading from "../../components/shared/Loading";

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("paymentDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const { data, isLoading, isError } = useQuery({
    enabled: !!user?.email,
    queryKey: ["transactions", user?.email, page, limit, searchTerm, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (searchTerm) params.append("searchTerm", searchTerm);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

      const res = await api.get(
        `/api/v1/bookings/user/${user.email}/transactions?${params.toString()}`
      );
      return {
        data: res.data?.data || [],
        meta: res.data?.meta || { total: 0, page, limit },
      };
    },
  });

  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data;
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#01602a]">Transactions</p>
          <h1 className="text-3xl font-bold text-gray-900">Payment & booking history</h1>
          <p className="text-gray-600 mt-2">Track every successful Stripe payment tied to your bookings.</p>
        </div>
        <div className="bg-gray-50 px-4 py-3 rounded-xl text-sm text-gray-700 border border-gray-100">
          {data?.meta?.total || 0} record{(data?.meta?.total || 0) !== 1 ? "s" : ""}
        </div>
      </div>

      {isLoading && <Loading message="Loading transactions..." fullPage={false} />}

      {isError && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-rose-600">Unable to load transactions right now.</div>
      )}

      {!isLoading && !isError && !rows.length && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No transactions found</h2>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      )}

      {!isLoading && !isError && rows.length > 0 && (
        <>
          {/* Search and Sort */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions by ticket name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#01602a] focus:border-transparent"
              />
            </div>

            {/* Sort and Per Page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#01602a] focus:border-transparent"
                >
                  <option value="paymentDate">Payment Date</option>
                  <option value="amountPaid">Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                <button
                  onClick={() => {
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#01602a] focus:border-transparent flex items-center justify-between gap-2"
                >
                  {sortOrder === "desc" ? "Newest" : "Oldest"}
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {searchTerm && (
              <div className="flex gap-2 pt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-200">
                  Search: {searchTerm}
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setPage(1);
                    }}
                    className="ml-1 hover:text-blue-900 font-semibold"
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount (BDT)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{row.stripeSessionId || row.paymentIntentId || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.ticketTitle || 'Ticket'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">BDT {(row.amountPaid || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(row.paymentDate || row.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
              <span>Page {page}</span>
              <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => p + 1)}
                disabled={(page * limit) >= (data?.meta?.total || 0)}>Next</button>
            </div>
            <select className="border rounded px-2 py-1" value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
