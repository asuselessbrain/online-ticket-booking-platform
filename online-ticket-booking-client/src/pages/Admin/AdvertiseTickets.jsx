import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useState } from "react";
import { toast } from "react-toastify";

const AdvertiseTickets = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch admin-approved tickets
  const { data, isLoading, isError } = useQuery({
    queryKey: ["approvedTickets", { page, limit }],
    queryFn: async () => {
      const res = await api.get("/api/v1/tickets", {
        params: { page, limit, verificationStatus: "approved" },
      });
      const payload = res.data?.data;
      return payload || { data: [], meta: { page: 1, limit, total: 0 } };
    },
  });

  // Mutation to toggle advertisement flag
  const toggleMutation = useMutation({
    mutationFn: async ({ id, advertise }) => {
      const res = await api.patch(`/api/v1/tickets/advertisement/${id}`, { advertise });
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
  const totalAdvertised = list.filter((t) => t.isAdvertised).length;

  const handleToggle = (ticket) => {
    const next = !ticket.isAdvertised;
    if (next && totalAdvertised >= 6) {
      toast.warn("You can advertise at most 6 tickets");
      return;
    }
    toggleMutation.mutate({ id: ticket._id || ticket.id, advertise: next });
  };

  const total = data?.meta?.total || 0;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Advertise Tickets</h1>

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-600">
          <span className="inline-block w-4 h-4 border-2 border-[#01602a] border-r-transparent rounded-full animate-spin" />
          Loading approved tickets...
        </div>
      )}
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
                      checked={!!t.isAdvertised}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked && totalAdvertised >= 6 && !t.isAdvertised) {
                          toast.warn("You can advertise at most 6 tickets");
                          return;
                        }
                        toggleMutation.mutate({ id: t._id || t.id, advertise: checked });
                      }}
                      disabled={toggleMutation.isPending}
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
