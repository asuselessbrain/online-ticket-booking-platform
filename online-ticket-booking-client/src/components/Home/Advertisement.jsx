const defaultTickets = [
  {
    id: 't1',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60&auto=format&fit=crop',
    title: 'Executive Bus to Dhaka',
    price: 12.5,
    quantity: 24,
    transport: 'Bus',
    perks: ['AC', 'Recliner seat', 'Free WiFi'],
  },
  {
    id: 't2',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=60&auto=format&fit=crop',
    title: 'Intercity Train — Rajshahi',
    price: 6.0,
    quantity: 120,
    transport: 'Train',
    perks: ['Reserved seat', 'Pantry car'],
  },
  {
    id: 't3',
    image: 'https://images.unsplash.com/photo-1543932922-8d48b67b9c4d?w=1200&q=60&auto=format&fit=crop',
    title: 'River Launch — Sundarban',
    price: 9.75,
    quantity: 48,
    transport: 'Launch',
    perks: ['Life jackets', 'Refreshments'],
  },
  {
    id: 't4',
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49b?w=1200&q=60&auto=format&fit=crop',
    title: 'Domestic Flight — CoxBazar',
    price: 45.0,
    quantity: 12,
    transport: 'Plane',
    perks: ['Light meal', 'Priority boarding'],
  },
  {
    id: 't5',
    image: 'https://images.unsplash.com/photo-1505842465776-3d2b9a1f8a6d?w=1200&q=60&auto=format&fit=crop',
    title: 'Night Sleeper Bus — Chittagong',
    price: 14.0,
    quantity: 8,
    transport: 'Bus',
    perks: ['Bed', 'Blanket', 'Curtains'],
  },
  {
    id: 't6',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&q=60&auto=format&fit=crop',
    title: 'Luxury Train — Sylhet Express',
    price: 18.5,
    quantity: 40,
    transport: 'Train',
    perks: ['AC', 'Window seat', 'Snack service'],
  },
];

const TicketCard = ({ ticket }) => {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden ring-1 ring-slate-100">
      <div className="relative h-40 md:h-44 w-full overflow-hidden">
        <img src={ticket.image} alt={ticket.title} className="object-cover w-full h-full" />
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
          {ticket.transport}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{ticket.title}</h3>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Price</div>
            <div className="text-base font-bold text-slate-900">${ticket.price.toFixed(2)} <span className="text-sm font-medium text-slate-500">/ seat</span></div>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-500">Available</div>
            <div className="text-base font-semibold text-slate-900">{ticket.quantity}</div>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2 text-xs text-slate-600 mt-1">
          {ticket.perks.slice(0, 4).map((p, idx) => (
            <li key={idx} className="inline-flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-md">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-teal-500">
                <path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-2 flex items-center justify-between">
          <button className="text-sm font-semibold text-[#01602a] hover:underline">See details</button>
        </div>
      </div>
    </article>
  );
};

const Advertisement = ({ tickets = defaultTickets }) => {
  // Ensure exactly 6 tickets shown as per requirement — slice or pad if necessary
  const shown = Array.isArray(tickets) ? tickets.slice(0, 6) : defaultTickets;

  return (
    <section aria-labelledby="advertisement-heading" className="py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="advertisement-heading" className="text-2xl font-extrabold text-slate-900">Featured Tickets</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advertisement;
