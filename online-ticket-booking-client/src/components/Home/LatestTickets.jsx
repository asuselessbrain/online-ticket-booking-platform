import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import api from "../../lib/axios";
import Loading from "../shared/Loading";

const SmallTicketCard = ({ ticket }) => {
  const title = ticket.ticketTitle || ticket.title || "Ticket";
  const image = ticket.ticketImage || ticket.image || "";
  const transportType = ticket.transportType || ticket.transport || "N/A";
  const price = ticket.price || 0;
  const quantity = ticket.quantity ?? 0;
  const from = ticket.from || "";
  const to = ticket.to || "";
  const perks = ticket.perks || [];

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden ring-1 ring-slate-100 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="h-44 w-full overflow-hidden relative">
        <img src={image} alt={title} className="object-cover w-full h-full" />
        <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-800 capitalize">
          {transportType}
        </span>
      </div>

      <div className="p-3">
        <h4 className="text-sm font-semibold text-slate-900 truncate">{title}</h4>
        {from && to && (
          <p className="text-xs text-slate-600 mt-1">
            {from} → {to}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="text-xs text-slate-500">Price</div>
            <div className="text-sm font-bold text-slate-900">${Number(price).toFixed(2)}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">Qty</div>
            <div className={`text-sm font-medium ${quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {quantity}
            </div>
          </div>
        </div>

        {perks.length > 0 && (
          <ul className="flex flex-wrap gap-2 text-xs text-slate-600 mt-3">
            {perks.slice(0, 3).map((p, i) => (
              <li key={i} className="bg-slate-50 px-2 py-1 rounded-md">{p}</li>
            ))}
          </ul>
        )}

        <div className="mt-3 text-right">
          <span className="text-sm font-semibold text-primary hover:underline">See details</span>
        </div>
      </div>
    </article>
  );
};

const LatestTickets = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["latestTickets"],
    queryFn: async () => {
      const res = await api.get("/api/v1/tickets/approved/list", {
        params: {
          page: 1,
          limit: 8,
          sort: "-createdAt",
        },
      });
      return res.data?.data?.data || [];
    },
  });

  const tickets = data || [];

  if (isLoading) {
    return (
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-[1440px] mx-auto">
          <Loading message="Loading latest tickets..." fullPage={false} />
        </div>
      </section>
    );
  }

  if (!tickets.length) {
    return null;
  }

  return (
    <section aria-labelledby="latest-heading" className="py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="latest-heading" className="text-2xl font-extrabold text-slate-900">Latest Tickets</h2>
          <Link to="/tickets" className="text-sm text-slate-500">Recently added — browse newest offers</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tickets.slice(0, 8).map(t => (
            <Link key={t._id} to={`/tickets/${t._id}`}>
              <SmallTicketCard ticket={t} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestTickets;
