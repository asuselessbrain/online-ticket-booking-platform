import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import api from "../../lib/axios";
import Loading from "../shared/Loading";

const RouteCard = ({ r }) => (
  <Link to={`/tickets?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`}>
    <article className="bg-white rounded-lg shadow-sm overflow-hidden ring-1 ring-slate-100 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="h-40 w-full overflow-hidden relative">
        <img src={r.image} alt={r.route} className="object-cover w-full h-full" />
        <span className="absolute top-2 left-2 inline-flex items-center gap-2 bg-white/90 px-2 py-1 text-xs font-semibold text-slate-800 rounded-full capitalize">
          {r.transports.join(', ')}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900">{r.route}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Starting From</div>
            <div className="text-base font-bold text-slate-900">${r.start.toFixed(2)}</div>
          </div>

          <div className="text-right">
            <span className="text-sm font-semibold text-primary hover:underline">See tickets</span>
          </div>
        </div>
      </div>
    </article>
  </Link>
);

const PopularRoutes = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["popularRoutes"],
    queryFn: async () => {
      const res = await api.get("/api/v1/tickets/approved/list", {
        params: {
          page: 1,
          limit: 100,
          verificationStatus: "approved",
        },
      });
      return res.data?.data?.data || [];
    },
  });

  const tickets = data || [];

  // Group tickets by route (from -> to) and calculate stats
  const routeMap = new Map();
  tickets.forEach((ticket) => {
    const routeKey = `${ticket.from}-${ticket.to}`;
    const reverseKey = `${ticket.to}-${ticket.from}`;
    
    // Check if route or reverse route exists
    const existingKey = routeMap.has(routeKey) ? routeKey : routeMap.has(reverseKey) ? reverseKey : routeKey;
    
    if (!routeMap.has(existingKey)) {
      routeMap.set(existingKey, {
        from: ticket.from,
        to: ticket.to,
        route: `${ticket.from} ↔ ${ticket.to}`,
        start: ticket.price,
        transports: new Set([ticket.transportType]),
        count: 1,
        image: ticket.ticketImage || ticket.image || 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200&q=60&auto=format&fit=crop',
      });
    } else {
      const route = routeMap.get(existingKey);
      route.start = Math.min(route.start, ticket.price);
      route.transports.add(ticket.transportType);
      route.count += 1;
    }
  });

  // Convert to array and sort by count (popularity)
  const routes = Array.from(routeMap.values())
    .map((r) => ({
      ...r,
      transports: Array.from(r.transports),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-[1440px] mx-auto">
          <Loading message="Loading popular routes..." fullPage={false} />
        </div>
      </section>
    );
  }

  if (!routes.length) {
    return null;
  }

  return (
    <section aria-labelledby="popular-heading" className="py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="popular-heading" className="text-2xl font-extrabold text-slate-900">Popular Routes</h2>
          <p className="text-sm text-slate-500">Most searched routes by travelers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.slice(0,6).map((r, idx) => <RouteCard key={`${r.from}-${r.to}-${idx}`} r={r} />)}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;
