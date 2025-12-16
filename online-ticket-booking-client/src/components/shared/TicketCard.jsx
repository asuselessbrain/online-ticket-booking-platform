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

export default TicketCard;