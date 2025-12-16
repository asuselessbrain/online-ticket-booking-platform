import React from 'react';

const recentTickets = [
  {
    id: 'r1',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60&auto=format&fit=crop',
    title: 'Express Bus — City A to City B',
    price: 11.0,
    quantity: 30,
    transport: 'Bus',
    perks: ['AC', 'WiFi', 'Comfort seat'],
  },
  {
    id: 'r2',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=60&auto=format&fit=crop',
    title: 'Morning Train — Regional',
    price: 5.5,
    quantity: 200,
    transport: 'Train',
    perks: ['Reserved', 'Snack'],
  },
  {
    id: 'r3',
    image: 'https://images.unsplash.com/photo-1543932922-8d48b67b9c4d?w=1200&q=60&auto=format&fit=crop',
    title: 'Sunset Launch Cruise',
    price: 10.0,
    quantity: 60,
    transport: 'Launch',
    perks: ['Life jackets', 'Refreshments'],
  },
  {
    id: 'r4',
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49b?w=1200&q=60&auto=format&fit=crop',
    title: 'Economy Flight — Short haul',
    price: 39.0,
    quantity: 20,
    transport: 'Plane',
    perks: ['In-flight refreshments'],
  },
  {
    id: 'r5',
    image: 'https://images.unsplash.com/photo-1505842465776-3d2b9a1f8a6d?w=1200&q=60&auto=format&fit=crop',
    title: 'Overnight Sleeper Bus',
    price: 13.25,
    quantity: 10,
    transport: 'Bus',
    perks: ['Blanket', 'Pillow'],
  },
  {
    id: 'r6',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&q=60&auto=format&fit=crop',
    title: 'Intercity Luxury Train',
    price: 19.5,
    quantity: 50,
    transport: 'Train',
    perks: ['AC', 'Window seat', 'Tea service'],
  },
  {
    id: 'r7',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=60&auto=format&fit=crop',
    title: 'Coastal Launch — Day Tour',
    price: 8.0,
    quantity: 80,
    transport: 'Launch',
    perks: ['Guided tour', 'Refreshments'],
  },
  {
    id: 'r8',
    image: 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=1200&q=60&auto=format&fit=crop',
    title: 'Regional Flight — Promo fare',
    price: 29.99,
    quantity: 15,
    transport: 'Plane',
    perks: ['Light snack', 'Priority check-in'],
  },
];

const SmallTicketCard = ({ ticket }) => (
  <article className="bg-white rounded-lg shadow-sm overflow-hidden ring-1 ring-slate-100">
    <div className="h-44 w-full overflow-hidden relative">
      <img src={ticket.image} alt={ticket.title} className="object-cover w-full h-full" />
      <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-800">
        {ticket.transport}
      </span>
    </div>

    <div className="p-3">
      <h4 className="text-sm font-semibold text-slate-900 truncate">{ticket.title}</h4>
      <div className="flex items-center justify-between mt-2">
        <div>
          <div className="text-xs text-slate-500">Price</div>
          <div className="text-sm font-bold text-slate-900">${ticket.price.toFixed(2)}</div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500">Qty</div>
          <div className="text-sm font-medium text-slate-900">{ticket.quantity}</div>
        </div>
      </div>

      <ul className="flex flex-wrap gap-2 text-xs text-slate-600 mt-3">
        {ticket.perks.slice(0,3).map((p, i) => (
          <li key={i} className="bg-slate-50 px-2 py-1 rounded-md">{p}</li>
        ))}
      </ul>

      <div className="mt-3 text-right">
        <button className="text-sm font-semibold text-primary hover:underline">See details</button>
      </div>
    </div>
  </article>
);

const LatestTickets = ({ tickets = recentTickets, max = 8 }) => {
  const shown = Array.isArray(tickets) ? tickets.slice(0, Math.min(max, 8)) : recentTickets.slice(0, Math.min(max, 8));

  return (
    <section aria-labelledby="latest-heading" className="py-12 px-4 bg-slate-50">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="latest-heading" className="text-2xl font-extrabold text-slate-900">Latest Tickets</h2>
          <p className="text-sm text-slate-500">Recently added — browse newest offers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shown.map(t => (
            <SmallTicketCard key={t.id} ticket={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestTickets;
