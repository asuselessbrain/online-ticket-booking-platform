import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { toast } from "react-toastify";

const ManageTickets = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [transportType, setTransportType] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "adminTickets",
      { page, limit, sort, searchTerm, transportType, verificationStatus, fromLoc, toLoc, minPrice, maxPrice }
    ],
    queryFn: async () => {
      const res = await api.get("/api/v1/tickets", {
        params: {
          page,
          limit,
          sort,
          searchTerm: searchTerm || undefined,
          transportType: transportType || undefined,
          verificationStatus: verificationStatus || undefined,
          from: fromLoc || undefined,
          to: toLoc || undefined,
          minPrice: minPrice !== "" ? Number(minPrice) : undefined,
          maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
        },
      });
      // Expect shape: { success, message, data: { data: [], meta } }
      const payload = res.data?.data;
      return payload || { data: [], meta: { page: 1, limit, total: 0 } };
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, verificationStatus }) => {
      const res = await api.patch(`/api/v1/tickets/${id}`, { verificationStatus });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.message || "Failed to update";
      toast.error(message);
    },
  });

  const handleToggleVerification = (t, checked) => {
    statusMutation.mutate({ id: t._id || t.id, verificationStatus: checked });
  };

  const total = data?.meta?.total || 0;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Manage Tickets</h1>

      {/* Filters */}
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Search title, route, type, vendor"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
          <select
            className="border rounded px-3 py-2"
            value={transportType}
            onChange={(e) => { setTransportType(e.target.value); setPage(1); }}
          >
            <option value="">All transport</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="air">Air</option>
            <option value="ship">Ship</option>
          </select>
          <select
            className="border rounded px-3 py-2"
            value={verificationStatus}
            onChange={(e) => { setVerificationStatus(e.target.value); setPage(1); }}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            className="border rounded px-3 py-2"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="From"
            value={fromLoc}
            onChange={(e) => { setFromLoc(e.target.value); setPage(1); }}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="To"
            value={toLoc}
            onChange={(e) => { setToLoc(e.target.value); setPage(1); }}
          />
          <input
            type="number"
            min="0"
            className="border rounded px-3 py-2"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
          />
          <input
            type="number"
            min="0"
            className="border rounded px-3 py-2"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">Failed to load tickets.</p>}

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Route</th>
              <th className="p-3">Type</th>
              <th className="p-3">Price</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Departure</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Status</th>
              <th className="p-3">Verify</th>
            </tr>
          </thead>
          <tbody>
            {(data?.data || []).map((t) => {
              const status = t.verificationStatus || "pending";
              return (
                <tr key={t._id || t.id} className="border-t">
                  <td className="p-3 font-medium">{t.ticketTitle || t.title}</td>
                  <td className="p-3">{t.from} → {t.to}</td>
                  <td className="p-3 capitalize">{t.transportType}</td>
                  <td className="p-3">{t.price}</td>
                  <td className="p-3">{t.quantity}</td>
                  <td className="p-3">{t.departureDate} {t.departureTime}</td>
                  <td className="p-3">
                    <div className="leading-tight">
                      <div>{t.vendorName}</div>
                      <div className="text-gray-500">{t.vendorEmail}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        status === "approved"
                          ? "bg-green-100 text-green-700"
                          : status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="p-3">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!t.verificationStatus}
                        onChange={(e) => handleToggleVerification(t, e.target.checked)}
                        disabled={statusMutation.isPending}
                        className="accent-[#01602a] w-5 h-5"
                      />
                      <span>{!!t.verificationStatus ? "Verified" : "Unverified"}</span>
                    </label>
                  </td>
                </tr>
              );
            })}
            {(data?.data || []).length === 0 && !isLoading && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={9}>No tickets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setPage((p) => p + 1)}
            disabled={(page * limit) >= total}
          >
            Next
          </button>
        </div>
        <select
          className="border rounded px-2 py-1"
          value={limit}
          onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </section>
  );
};

export default ManageTickets;
