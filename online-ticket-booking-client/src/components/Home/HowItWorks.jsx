import { Link } from "react-router";

const steps = [
  {
    title: "Search your route",
    desc: "Choose transport type, set origin and destination, and pick a date to see real-time options.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-[#01602a]"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <path d="M8 11h6" />
        <path d="M11 8v6" />
      </svg>
    ),
  },
  {
    title: "Compare & confirm",
    desc: "Review schedules, seats, and prices across buses, trains, launches, or flights in one view.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-[#01602a]"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M7 8h10" />
        <path d="M7 12h6" />
        <path d="M7 16h4" />
      </svg>
    ),
  },
  {
    title: "Pay and travel",
    desc: "Secure checkout with instant confirmations. Your e-ticket is ready whenever you are.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-[#01602a]"
        aria-hidden="true"
      >
        <path d="M21 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
        <path d="M1 11h22" />
        <path d="M7 16h3" />
        <path d="M14 16h3" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-linear-to-r from-[#01602a] to-[#014d21] py-16 px-4">
      <div className="max-w-[1440px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-[0.18em] mb-6">
          How it works
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">Book in three simple steps</h2>
        <p className="text-lg text-white/90 mt-3 max-w-3xl mx-auto">
          From discovery to checkout, everything happens in one streamlined flow. No phone calls, no guesswork.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="relative bg-linear-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/25 rounded-2xl p-7 shadow-lg text-left hover:-translate-y-2 hover:shadow-xl hover:border-white/40 transition duration-300"
            >
              <div className="absolute -top-4 -left-4 h-11 w-11 rounded-xl bg-linear-to-br from-white to-gray-100 text-[#01602a] font-bold text-lg flex items-center justify-center shadow-lg">
                {idx + 1}
              </div>
              <div className="h-14 w-14 rounded-xl bg-linear-to-br from-white/40 to-white/20 flex items-center justify-center mb-5 backdrop-blur-md">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-3 text-sm text-white/85 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <Link to="/tickets" className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-white text-[#01602a] font-semibold shadow-md hover:bg-gray-100 transition">
          <span>Start a search</span>
          <span aria-hidden="true" className="text-white">→</span>
        </Link>
      </div>
    </section>
  );
};

export default HowItWorks;
