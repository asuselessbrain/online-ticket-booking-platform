import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fff8] via-white to-[#e3f6ed] flex items-center justify-center px-4 py-16">
      <div className="max-w-5xl w-full mx-auto grid lg:grid-cols-[1.05fr,0.95fr] gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e7f7ee] text-[#01602a] text-xs font-semibold uppercase tracking-[0.18em]">
            403 • Forbidden
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Access restricted. This gate is reserved for authorized travelers.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            You’re signed in, but your account doesn’t have permission to view this area. If you think this is a mistake, switch to the right account or request access from an administrator.
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

          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-[#e7f7ee] flex items-center justify-center text-[#01602a] font-bold">A</div>
              <div>
                <p className="font-semibold text-gray-900">Use the right account</p>
                <p className="text-gray-600">Admins, vendors, and users each have their own terminals.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-[#e7f7ee] flex items-center justify-center text-[#01602a] font-bold">S</div>
              <div>
                <p className="font-semibold text-gray-900">Request support</p>
                <p className="text-gray-600">Need access? Our team can update your role or guide you.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-[#9de2c8]/50 -z-10" aria-hidden />
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-[#01602a] text-white px-5 py-4 flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-wide">Access Control</div>
              <div className="text-xs bg-white/15 px-3 py-1 rounded-full">Restricted zone</div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Your status</span>
                <span className="text-sm font-semibold text-gray-900">Signed in</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Required role</span>
                <span className="text-sm font-semibold text-gray-900">Admin / Vendor</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Next steps</span>
                <span className="text-sm font-semibold text-gray-900">Switch account</span>
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
                      <path d="m9 9 10.5-3.5L20.5 15M9 9l9.5 6m-9.5-6v6.5L17 21" />
                      <path d="M4 5v14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Ask for access</p>
                    <p className="text-sm text-gray-600">Email your admin with the route you need.</p>
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

export default Forbidden;
