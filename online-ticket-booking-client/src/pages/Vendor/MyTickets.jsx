import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import api from "../../lib/axios";
import { AuthContext } from "../../providers/AuthContext";
import { toast } from "react-toastify";

const MyTickets = () => {
  const { user } = use(AuthContext);
  const queryClient = useQueryClient();
  const vendorEmail = user?.email;

  // Query/filter state
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
      "vendorTickets",
      vendorEmail,
      { page, limit, sort, searchTerm, transportType, verificationStatus, fromLoc, toLoc, minPrice, maxPrice }
    ],
    queryFn: async () => {
      if (!vendorEmail) return { data: [], meta: { page: 1, limit: 0, total: 0 } };
      const res = await api.get(`/api/v1/tickets/vendor/${vendorEmail}`, {
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
        }
      });
      const payload = res.data?.data;
      return payload || { data: [], meta: { page: 1, limit: 0, total: 0 } };
    },
    enabled: !!vendorEmail,
  });
  console.log(data)

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/v1/tickets/${id}` , { data: { vendorEmail } });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ticket deleted");
      queryClient.invalidateQueries({ queryKey: ["vendorTickets", vendorEmail] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.message || "Failed to delete";
      toast.error(message);
    }
  });

  const handleDelete = (id, status) => {
    if (status === "rejected") return;
    deleteMutation.mutate(id);
  };

  const handleUpdate = (ticket) => {
    if (ticket?.verificationStatus === "rejected") return;
    setEditing(ticket);
  };

  // Update modal state and form
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit: submitUpdate, reset: resetUpdate } = useForm();

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await api.patch(`/api/v1/tickets/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ticket updated");
      setEditing(null);
      resetUpdate();
      queryClient.invalidateQueries({ queryKey: ["vendorTickets", vendorEmail] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.message || "Failed to update";
      toast.error(message);
    }
  });

  const onUpdateSubmit = (values) => {
    if (!editing) return;
    const id = editing._id || editing.id;
    const payload = { vendorEmail, ...values };
    updateMutation.mutate({ id, payload });
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">My Added Tickets</h1>
      {isLoading && <p>Loading tickets...</p>}
      {isError && <p className="text-red-600">Failed to load tickets.</p>}
      {!isLoading && ((data?.data?.length ?? 0) === 0) && (
        <p>No tickets found.</p>
      )}
      {/* Controls */}
      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Search"
            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} />
          <select className="border rounded px-3 py-2" value={transportType}
            onChange={(e) => { setTransportType(e.target.value); setPage(1); }}>
            <option value="">All transport</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="air">Air</option>
            <option value="ship">Ship</option>
          </select>
          <select className="border rounded px-3 py-2" value={verificationStatus}
            onChange={(e) => { setVerificationStatus(e.target.value); setPage(1); }}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select className="border rounded px-3 py-2" value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}>
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input className="border rounded px-3 py-2" placeholder="From"
            value={fromLoc} onChange={(e) => { setFromLoc(e.target.value); setPage(1); }} />
          <input className="border rounded px-3 py-2" placeholder="To"
            value={toLoc} onChange={(e) => { setToLoc(e.target.value); setPage(1); }} />
          <input type="number" min="0" className="border rounded px-3 py-2" placeholder="Min price"
            value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} />
          <input type="number" min="0" className="border rounded px-3 py-2" placeholder="Max price"
            value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} />
        </div>

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        {data?.data?.map((t) => {
          const status = t.verificationStatus || "pending";
          const disabled = status === "rejected";
          return (
            <div key={t.id || t._id} className="border rounded overflow-hidden p-3 flex flex-col gap-3">
              {t.image && (
                <img src={t.image} alt={t.title} className="w-full h-40 object-cover rounded" />
              )}
              <div className="space-y-2 flex-1">
                <h2 className="text-lg font-semibold">{t.title}</h2>
                <p className="text-sm text-gray-600">{t.from} → {t.to}</p>
                <p className="text-sm">Type: {t.transportType}</p>
                <p className="text-sm">Price: {t.price} | Qty: {t.quantity}</p>
                <p className="text-sm">Departure: {t.departureDate} {t.departureTime}</p>
                {Array.isArray(t.perks) && t.perks.length > 0 && (
                  <p className="text-sm">Perks: {t.perks.join(", ")}</p>
                )}
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${status === "approved"
                    ? "bg-green-100 text-green-700"
                    : status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {status}
                </span>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate(t)}
                    disabled={disabled}
                    className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id || t._id, status)}
                    disabled={disabled || deleteMutation.isPending}
                    className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
          <option value={6}>6</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
        </select>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-xl rounded shadow p-4">
            <h3 className="text-xl font-semibold mb-3">Update Ticket</h3>
            <form onSubmit={submitUpdate(onUpdateSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-sm">Title</label>
                <input className="border rounded px-3 py-2 w-full" defaultValue={editing.title || editing.ticketTitle} {...register("title")} />
              </div>
              <div>
                <label className="text-sm">From</label>
                <input className="border rounded px-3 py-2 w-full" defaultValue={editing.from} {...register("from")} />
              </div>
              <div>
                <label className="text-sm">To</label>
                <input className="border rounded px-3 py-2 w-full" defaultValue={editing.to} {...register("to")} />
              </div>
              <div>
                <label className="text-sm">Transport Type</label>
                <input className="border rounded px-3 py-2 w-full" defaultValue={editing.transportType} {...register("transportType")} />
              </div>
              <div>
                <label className="text-sm">Price</label>
                <input type="number" min="0" className="border rounded px-3 py-2 w-full" defaultValue={editing.price} {...register("price")} />
              </div>
              <div>
                <label className="text-sm">Quantity</label>
                <input type="number" min="0" className="border rounded px-3 py-2 w-full" defaultValue={editing.quantity} {...register("quantity")} />
              </div>
              <div>
                <label className="text-sm">Departure Date</label>
                <input type="date" className="border rounded px-3 py-2 w-full" defaultValue={editing.departureDate} {...register("departureDate")} />
              </div>
              <div>
                <label className="text-sm">Departure Time</label>
                <input type="time" className="border rounded px-3 py-2 w-full" defaultValue={editing.departureTime} {...register("departureTime")} />
              </div>
              <div className="md:col-span-2 flex items-center justify-end gap-2 mt-2">
                <button type="button" onClick={() => setEditing(null)} className="px-3 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={updateMutation.isPending} className="px-3 py-2 rounded bg-[#01602a] text-white">
                  {updateMutation.isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyTickets;
