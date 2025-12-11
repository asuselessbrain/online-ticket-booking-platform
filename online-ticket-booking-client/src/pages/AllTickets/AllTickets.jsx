import React from 'react';
import { Link } from 'react-router';

const sampleTickets = [
  {
    id: 'a1',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60&auto=format&fit=crop',
    title: 'Executive Bus to Dhaka',
    from: 'Chattogram',
    to: 'Dhaka',
    price: 12.5,
    quantity: 24,
    transport: 'Bus',
    perks: ['AC', 'Recliner seat', 'Free WiFi'],
    departure: '2025-12-20T20:30:00Z',
    approved: true,
  },
  {
    id: 'a2',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=60&auto=format&fit=crop',
    title: 'Intercity Train — Rajshahi',
    from: 'Dhaka',
    to: 'Rajshahi',
    price: 6.0,
    quantity: 120,
    transport: 'Train',
    perks: ['Reserved seat', 'Pantry car'],
    departure: '2025-12-21T08:00:00Z',
    approved: true,
  },
  {
    id: 'a3',
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49b?w=1200&q=60&auto=format&fit=crop',
    title: 'Domestic Flight — Coxs Bazar',
    from: 'Dhaka',
    to: 'Coxs Bazar',
    price: 45.0,
    quantity: 12,
    transport: 'Plane',
    perks: ['Light meal', 'Priority boarding'],
    departure: '2025-12-22T11:15:00Z',
    approved: true,
  },
  {
    id: 'a4',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&q=60&auto=format&fit=crop',
    title: 'Night Sleeper Bus — Chittagong',
    from: 'Dhaka',
    to: 'Chittagong',
    price: 14.0,
    quantity: 8,
    transport: 'Bus',
    perks: ['Bed', 'Blanket', 'Curtains'],
    departure: '2025-12-23T23:00:00Z',
    approved: false,
  },
];

const TicketCard = ({ t }) => {
  const departure = new Date(t.departure);
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden ring-1 ring-slate-100">
      <div className="relative h-44 w-full overflow-hidden">
        <img src={t.image} alt={t.title} className="object-cover w-full h-full" />
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">{t.transport}</span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{t.title}</h3>

        <div className="text-sm text-slate-600">{t.from} → {t.to}</div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Price</div>
            <div className="text-base font-bold text-slate-900">${t.price.toFixed(2)} <span className="text-sm font-medium text-slate-500">/ seat</span></div>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-500">Available</div>
            <div className="text-base font-semibold text-slate-900">{t.quantity}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 mt-1">
          {t.perks.map((p, i) => (
            <span key={i} className="bg-slate-50 px-2 py-1 rounded-md">{p}</span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-slate-500">Departs</div>
          <div className="text-sm font-medium text-slate-900">{departure.toLocaleString()}</div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Link to={`/tickets/${t.id}`} className="text-sm font-semibold text-primary hover:underline">See details</Link>
          <button className="ml-3 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-3 py-2 rounded-md">Book</button>
        </div>
      </div>
    </article>
  );
};

const AllTickets = ({ tickets = sampleTickets }) => {
  // show only admin-approved tickets
  const approved = tickets.filter(t => t.approved === true);

  return (
    <main className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">All Tickets</h1>
        </div>

        {approved.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">No approved tickets available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approved.map(t => <TicketCard key={t.id} t={t} />)}
          </div>
        )}
      </div>
    </main>
  );
};

export default AllTickets;
