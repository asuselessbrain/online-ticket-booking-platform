import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fff8] via-white to-[#e3f6ed] flex items-center justify-center px-4 py-16">
      <div className="max-w-5xl w-full mx-auto grid lg:grid-cols-[1.05fr,0.95fr] gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e7f7ee] text-[#01602a] text-xs font-semibold uppercase tracking-[0.18em]">
            404 • Page missing
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Oops! The page you’re looking for took a detour.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            We couldn’t find this destination. Head back to the main terminal or explore all tickets to keep your journey on track.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#01602a] text-white font-semibold shadow-sm hover:bg-[#014d21] transition"
            >
              Back to Home
            </Link>
            <Link
              to="/tickets"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition"
            >
              Browse Tickets
            </Link>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-2 w-2 rounded-full bg-[#00b36b]"></div>
            <span>Always available • Friendly support • Secure checkout</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-[#9de2c8]/50 -z-10" aria-hidden />
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-[#01602a] text-white px-5 py-4 flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-wide">Status</div>
              <div className="text-xs bg-white/15 px-3 py-1 rounded-full">Route unavailable</div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Requested URL</span>
                <span className="text-sm font-semibold text-gray-900">Not found</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Next best action</span>
                <span className="text-sm font-semibold text-gray-900">Return to home</span>
              </div>
              <div className="rounded-xl border border-dashed border-gray-200 p-4 bg-gray-50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#e7f7ee] flex items-center justify-center">
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
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.5 9h.01" />
                      <path d="M14.5 9h.01" />
                      <path d="M9 15c.667 1 1.667 1.5 3 1.5s2.333-.5 3-1.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Need help?</p>
                    <p className="text-sm text-gray-600">Our team can guide you to the right destination.</p>
                  </div>
                </div>
                <a
                  href="mailto:support@example.com"
                  className="inline-flex text-sm font-semibold text-[#01602a] hover:text-[#014d21]"
                >
                  Contact support →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
