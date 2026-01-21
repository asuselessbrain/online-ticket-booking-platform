import { use, useMemo, useLayoutEffect, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthContext";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown } from "lucide-react";
import Loading from "../../components/shared/Loading";

const normalizeStatus = (status) => {
  if (!status) return "pending";
  const lowered = status.toLowerCase();
  if (lowered === "confirmed") return "accepted";
  if (lowered === "cancelled") return "rejected";
  return lowered;
};

const statusClasses = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  paid: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60&auto=format&fit=crop";

const buildCountdown = (departureDate, departureTime, nowTs) => {
  if (!departureDate || !departureTime) {
    return { expired: true, label: "--:--" };
  }

  const departure = new Date(`${departureDate} ${departureTime}`);
  const diff = departure.getTime() - nowTs;

  if (diff <= 0) {
    return { expired: true, label: "Departure passed" };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const label = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  return { expired: false, label };
};

const MyBookings = () => {
  const { user } = use(AuthContext);
  const [nowTs, setNowTs] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useLayoutEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    enabled: !!user?.email,
    queryKey: ["myBookings", user?.email, page, limit, searchTerm, filterStatus, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (searchTerm) params.append("searchTerm", searchTerm);
      if (filterStatus) params.append("status", filterStatus);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

      const res = await api.get(
        `/api/v1/bookings/user/${user.email}?${params.toString()}`
      );
      
      const bookings = res.data?.data || [];
      const meta = res.data?.meta || { total: 0, page, limit };

      const enriched = await Promise.all(
        bookings.map(async (booking) => {
          try {
            const ticketRes = await api.get(`/api/v1/tickets/${booking.ticketId}`);
            return { booking, ticket: ticketRes.data?.data ?? null };
          } catch (err) {
            console.error("Ticket fetch failed", err);
            return { booking, ticket: null };
          }
        })
      );

      return { bookings: enriched, meta };
    },
  });

  const items = useMemo(() => {
    if (!data?.bookings) return [];

    return data.bookings.map(({ booking, ticket }) => {
      const status = normalizeStatus(booking.status);
      const countdown = ticket
        ? buildCountdown(ticket.departureDate, ticket.departureTime, nowTs)
        : { expired: true, label: "Departure unavailable" };

      const unitPrice = ticket?.price
        ? Number(ticket.price)
        : booking.quantity
        ? Number(booking.totalPrice || 0) / booking.quantity
        : 0;

      return {
        booking,
        ticket,
        status,
        countdown,
        unitPrice,
        isExpired: countdown.expired,
      };
    });
  }, [data, nowTs]);

  const handlePayNow = async ({ bookingId, isExpired, status }) => {
    if (isExpired) {
      toast.error("Payment unavailable: departure time has passed.");
      return;
    }

    if (status !== "accepted") {
      toast.error("Payment is allowed only after the vendor accepts your booking.");
      return;
    }

    try {
      const res = await api.post("/api/v1/payments/create-checkout-session", { bookingId });
      const url = res.data?.data?.url;

      if (url) {
        window.location.replace(url);
      } else {
        toast.error("Payment session created, but no checkout URL returned.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unable to start payment. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your bookings.</p>
          <Link
            to="/login"
            className="inline-block px-5 py-3 bg-[#01602a] text-white rounded-lg hover:bg-[#014d21] transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading fullPage message="Loading your bookings..." />;
  }

  if (isError) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Unable to load bookings</h1>
          <p className="text-gray-600 mb-4">{error?.message || "Something went wrong."}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-3 bg-[#01602a] text-white rounded-lg hover:bg-[#014d21] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">No bookings found</h1>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
          <Link
            to="/tickets"
            className="inline-block px-5 py-3 bg-[#01602a] text-white rounded-lg hover:bg-[#014d21] transition"
          >
            Browse Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-[1440px] mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#01602a]">My booked tickets</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your journeys at a glance</h1>
        </div>
        <div className="bg-gray-50 px-4 py-3 rounded-xl text-sm text-gray-700 border border-gray-100">
          {data?.meta?.total || 0} booking{(data?.meta?.total || 0) !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings by ticket name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#01602a] focus:border-transparent"
          />
        </div>

        {/* Filters and Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#01602a] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Accepted</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Rejected</option>
            </select>
          </div>

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
              <option value="createdAt">Date Booked</option>
              <option value="total">Total Price</option>
              <option value="quantity">Quantity</option>
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
        {(searchTerm || filterStatus) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {searchTerm && (
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
            )}
            {filterStatus && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm border border-green-200">
                Status: {filterStatus}
                <button
                  onClick={() => {
                    setFilterStatus("");
                    setPage(1);
                  }}
                  className="ml-1 hover:text-green-900 font-semibold"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map(({ booking, ticket, status, countdown, unitPrice, isExpired }) => {
          const showCountdown = !isExpired && status !== "rejected";
          const statusClass = statusClasses[status] || statusClasses.pending;
          const canPay = status === "accepted" && !isExpired;

          return (
            <article key={booking._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={ticket?.ticketImage || fallbackImage}
                  alt={ticket?.ticketTitle || "Ticket image"}
                  className="h-full w-full object-cover"
                />
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${statusClass}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                {showCountdown && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800 shadow">
                    {countdown.label}
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{ticket?.ticketTitle || "Ticket removed"}</h3>
                    <p className="text-sm text-gray-600">{ticket?.transportType || ""}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Quantity</div>
                    <div className="text-lg font-semibold text-gray-900">{booking.quantity}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>From</span>
                    <span className="font-semibold text-gray-900">{ticket?.from || "--"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                    <span>To</span>
                    <span className="font-semibold text-gray-900">{ticket?.to || "--"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500">Departure</div>
                    <div className="text-sm font-semibold text-gray-900">{ticket?.departureDate || "--"}</div>
                    <div className="text-sm text-gray-700">{ticket?.departureTime || "--"}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-lg font-bold text-gray-900">BDT {(booking.totalPrice || 0).toFixed(2)}</div>
                    <div className="text-xs text-gray-600">BDT {unitPrice.toFixed(2)} per seat</div>
                  </div>
                </div>

                {ticket?.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                )}

                <div className="mt-auto pt-2 flex flex-col gap-2">
                  {status === "rejected" && (
                    <div className="text-sm text-rose-600 font-semibold">This booking was rejected by the vendor.</div>
                  )}
                  {isExpired && status !== "rejected" && (
                    <div className="text-sm text-gray-500">Departure time has passed.</div>
                  )}

                  <div className="flex gap-3">
                    <Link
                      to={`/tickets/${booking.ticketId}`}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-center text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                    >
                      View Ticket
                    </Link>
                    {canPay ? (
                      <button
                        type="button"
                        onClick={() => handlePayNow({ bookingId: booking._id, isExpired, status })}
                        className="flex-1 px-4 py-2 bg-[#01602a] text-white rounded-lg text-sm font-semibold hover:bg-[#014d21] transition"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed"
                      >
                        {status === "paid" ? "Paid" : "Awaiting Approval"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          <span>Page {page}</span>
          <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => p + 1)}
            disabled={(page * limit) >= (data?.meta?.total || 0)}>Next</button>
        </div>
        <select className="border rounded px-2 py-1" value={limit}
          onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
          <option value={3}>3</option>
          <option value={6}>6</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
        </select>
      </div>
    </section>
  );
};

export default MyBookings;
