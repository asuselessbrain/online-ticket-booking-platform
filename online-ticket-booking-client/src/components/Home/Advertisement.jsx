import TicketCard from "../shared/TicketCard";

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
