import React from 'react';

const popular = [
  { id: 'p1', image: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200&q=60&auto=format&fit=crop', route: 'Dhaka ↔ Chittagong', start: 9.5, transports: ['Bus','Train'] },
  { id: 'p2', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=60&auto=format&fit=crop', route: 'Dhaka ↔ Sylhet', start: 6.0, transports: ['Bus','Plane'] },
  { id: 'p3', image: 'https://images.unsplash.com/photo-1504609813442-a892a6b9b4b9?w=1200&q=60&auto=format&fit=crop', route: 'Dhaka ↔ Coxs Bazar', start: 12.0, transports: ['Plane','Bus'] },
  { id: 'p4', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=60&auto=format&fit=crop', route: 'Dhaka ↔ Rajshahi', start: 5.25, transports: ['Train','Bus'] },
  { id: 'p5', image: 'https://images.unsplash.com/photo-1468070454955-c5b6932bd08d?w=1200&q=60&auto=format&fit=crop', route: 'Dhaka ↔ Barishal (Launch)', start: 8.5, transports: ['Launch'] },
  { id: 'p6', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=60&auto=format&fit=crop', route: 'Chittagong ↔ Sylhet', start: 7.0, transports: ['Bus','Train'] },
];

const RouteCard = ({ r }) => (
  <article className="bg-white rounded-lg shadow-sm overflow-hidden ring-1 ring-slate-100">
    <div className="h-40 w-full overflow-hidden relative">
      <img src={r.image} alt={r.route} className="object-cover w-full h-full" />
      <span className="absolute top-2 left-2 inline-flex items-center gap-2 bg-white/90 px-2 py-1 text-xs font-semibold text-slate-800 rounded-full">{r.transports.join(', ')}</span>
    </div>

    <div className="p-4">
      <h3 className="text-lg font-semibold text-slate-900">{r.route}</h3>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Starting From</div>
          <div className="text-base font-bold text-slate-900">${r.start.toFixed(2)}</div>
        </div>

        <div className="text-right">
          <button className="text-sm font-semibold text-primary hover:underline">See details</button>
        </div>
      </div>
    </div>
  </article>
);

const PopularRoutes = ({ routes = popular }) => {
  const shown = Array.isArray(routes) ? routes.slice(0, 6) : popular;

  return (
    <section aria-labelledby="popular-heading" className="py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="popular-heading" className="text-2xl font-extrabold text-slate-900">Popular Routes</h2>
          <p className="text-sm text-slate-500">Most searched routes by travelers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map(r => <RouteCard key={r.id} r={r} />)}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;
