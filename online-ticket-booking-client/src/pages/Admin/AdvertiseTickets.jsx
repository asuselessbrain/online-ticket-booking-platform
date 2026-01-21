import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from '../../components/shared/Loading';

const AdvertiseTickets = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [transportType, setTransportType] = useState("");
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["approvedTickets", { page, limit, sort, searchTerm, transportType, fromLoc, toLoc, minPrice, maxPrice }],
    queryFn: async () => {
      const res = await api.get("/api/v1/tickets", {
        params: { 
          page, 
          limit, 
          verificationStatus: "approved",
          sort,
          searchTerm: searchTerm || undefined,
          transportType: transportType || undefined,
          from: fromLoc || undefined,
          to: toLoc || undefined,
          minPrice: minPrice !== "" ? Number(minPrice) : undefined,
          maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
        },
      });
      const payload = res.data?.data;
      return payload || { data: [], meta: { page: 1, limit, total: 0 } };
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isAdvertised }) => {
      const res = await api.patch(`/api/v1/tickets/advertisement/${id}`, { isAdvertised });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvedTickets"] });
      toast.success("Advertisement status updated");
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.message || "Update failed";
      toast.error(message);
    },
  });

  const list = data?.data || [];

  const handleToggle = (e, ticket) => {
    const updatedStatus = e.target.checked;
    toggleMutation.mutate({ id: ticket._id || ticket.id, isAdvertised: updatedStatus });
  };


  const total = data?.meta?.total || 0;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Advertise Tickets</h1>

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
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
          <button
            className="border rounded px-3 py-2 bg-gray-100 hover:bg-gray-200"
            onClick={() => {
              setSearchTerm("");
              setTransportType("");
              setFromLoc("");
              setToLoc("");
              setMinPrice("");
              setMaxPrice("");
              setSort("desc");
              setPage(1);
            }}
          >
            Clear Filters
          </button>
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

      {isLoading && <Loading message="Loading approved tickets..." />}
      {isError && (
        <p className="text-red-600">Failed to load tickets.</p>
      )}

      <div className="overflow-x-auto border rounded mt-3">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Route</th>
              <th className="p-3">Type</th>
              <th className="p-3">Price</th>
              <th className="p-3">Advertised</th>
              <th className="p-3">Toggle</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t._id || t.id} className="border-t">
                <td className="p-3 font-medium">{t.ticketTitle || t.title}</td>
                <td className="p-3">{t.from} → {t.to}</td>
                <td className="p-3 capitalize">{t.transportType}</td>
                <td className="p-3">{t.price}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded ${t.isAdvertised ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {t.isAdvertised ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="advertised"
                      checked={t.isAdvertised}
                      onChange={(e) => handleToggle(e, t)}
                      className="accent-[#01602a] w-5 h-5"
                    />
                    <span>{t.isAdvertised ? "Advertised" : "Not Advertised"}</span>
                  </label>
                </td>

              </tr>
            ))}
            {list.length === 0 && !isLoading && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>No approved tickets available.</td>
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

export default AdvertiseTickets;
