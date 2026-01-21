import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import Loading from "../../components/shared/Loading";

const TicketCard = ({ t }) => {
  const departureDateTime = t.departureDate && t.departureTime 
    ? `${t.departureDate} ${t.departureTime}` 
    : null;
  
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden ring-1 ring-slate-100">
      <div className="relative h-44 w-full overflow-hidden">
        <img 
          src={t.ticketImage || t.image || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60&auto=format&fit=crop'} 
          alt={t.ticketTitle || t.title} 
          className="object-cover w-full h-full" 
        />
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur capitalize">
          {t.transportType || t.transport}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{t.ticketTitle || t.title}</h3>

        <div className="text-sm text-slate-600">{t.from} → {t.to}</div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Price</div>
            <div className="text-base font-bold text-slate-900">
              ${Number(t.price).toFixed(2)} <span className="text-sm font-medium text-slate-500">/ seat</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-500">Available</div>
            <div className="text-base font-semibold text-slate-900">{t.quantity}</div>
          </div>
        </div>

        {t.facilities && t.facilities.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 mt-1">
            {t.facilities.map((f, i) => (
              <span key={i} className="bg-slate-50 px-2 py-1 rounded-md">{f}</span>
            ))}
          </div>
        )}

        {departureDateTime && (
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-slate-500">Departs</div>
            <div className="text-sm font-medium text-slate-900">{departureDateTime}</div>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-slate-500">Vendor</div>
          <div className="text-sm font-medium text-slate-900">{t.vendorName}</div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Link to={`/tickets/${t._id || t.id}`} className="text-sm font-semibold text-[#01602a] hover:underline">
            See details
          </Link>
        </div>
      </div>
    </article>
  );
};

const AllTickets = () => {
  const [searchParams] = useSearchParams();
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('searchTerm') ?? "");
  const [transportType, setTransportType] = useState(() => searchParams.get('transportType') ?? "");
  const [fromLoc, setFromLoc] = useState(() => searchParams.get('from') ?? "");
  const [toLoc, setToLoc] = useState(() => searchParams.get('to') ?? "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [departureDate, setDepartureDate] = useState(() => searchParams.get('departureDate') ?? "");

  // Fetch distinct locations (from/to) from backend
  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await api.get('/api/v1/tickets/locations');
      return res.data?.data || { from: [], to: [] };
    },
  });
  const fromLocations = locationsData?.from || [];
  const toLocations = locationsData?.to || [];
  // States are initialized from URL params on mount via lazy initializers above.

  const { data, isLoading, isError } = useQuery({
    queryKey: ["approvedTickets", { page, limit, sort, searchTerm, transportType, fromLoc, toLoc, departureDate, minPrice, maxPrice }],
    queryFn: async () => {
      const res = await api.get("/api/v1/tickets/approved/list", {
        params: {
          page,
          limit,
          sort,
          searchTerm: searchTerm || undefined,
          transportType: transportType || undefined,
          from: fromLoc || undefined,
          to: toLoc || undefined,
          departureDate: departureDate || undefined,
          minPrice: minPrice !== "" ? Number(minPrice) : undefined,
          maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
        },
      });
      return res.data?.data || { data: [], meta: { page: 1, limit, total: 0 } };
    },
  });

  const tickets = data?.data || [];
  const total = data?.meta?.total || 0;

  return (
    <main className="py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">All Tickets</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
              <select
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                value={transportType}
                onChange={(e) => { setTransportType(e.target.value); setPage(1); }}
              >
                <option value="">All Transport</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="air">Air</option>
                <option value="launch">Launch</option>
              </select>
              <select
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
              <button
                className="border rounded px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => {
                  setSearchTerm("");
                  setTransportType("");
                  setFromLoc("");
                  setToLoc("");
                  setMinPrice("");
                  setMaxPrice("");
                  setDepartureDate("");
                  setSort("desc");
                  setPage(1);
                }}
              >
                Clear Filters
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <select
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                value={fromLoc}
                onChange={(e) => { setFromLoc(e.target.value); setPage(1); }}
              >
                <option value="">From — City / Station</option>
                {fromLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <select
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                value={toLoc}
                onChange={(e) => { setToLoc(e.target.value); setPage(1); }}
              >
                <option value="">To — City / Station</option>
                {toLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              />
              <input
                type="number"
                min="0"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              />
              <input
                type="date"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                value={departureDate}
                onChange={(e) => { setDepartureDate(e.target.value); setPage(1); }}
              />
            </div>
          </div>
        </div>

        {isLoading && <Loading message="Loading tickets..." fullPage={false} />}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-600">
            Failed to load tickets. Please try again.
          </div>
        )}

        {!isLoading && !isError && tickets.length === 0 && (
          <div className="bg-white rounded-lg p-6 text-center text-gray-600">
            No approved tickets available.
          </div>
        )}

        {!isLoading && !isError && tickets.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map(t => <TicketCard key={t._id || t.id} t={t} />)}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {Math.ceil(total / limit) || 1}
                </span>
                <button
                  className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= total}
                >
                  Next
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AllTickets;
