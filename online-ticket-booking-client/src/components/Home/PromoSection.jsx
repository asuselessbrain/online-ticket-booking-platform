const PromoSection = () => {
  return (
    <section className="bg-linear-to-r from-[#01602a] to-[#014d21] py-12 px-4 my-8">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: Content */}
        <div className="text-white space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-[0.18em]">
            Limited Time Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Get 20% off on your first booking
          </h2>
          <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
            New travelers get exclusive discounts on all transport types. Use code <span className="font-bold">WELCOME20</span> at checkout and start your journey with savings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-[#01602a] font-semibold hover:bg-gray-100 transition">
              Claim Offer
            </button>
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition">
              Learn more
            </button>
          </div>
          <p className="text-sm text-white/70">Valid on bus, train, launch & air bookings. Terms apply.</p>
        </div>

        {/* Right: Feature Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/20">
            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
                aria-hidden="true"
              >
                <path d="M12 2v20M2 12h20" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-1">24/7 Support</h3>
            <p className="text-sm text-white/80">Always available to help with your bookings</p>
          </div>

          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/20">
            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-1">Secure Payment</h3>
            <p className="text-sm text-white/80">100% safe transactions with encryption</p>
          </div>

          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/20">
            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-1">Instant Booking</h3>
            <p className="text-sm text-white/80">Confirmation in seconds, no wait</p>
          </div>

          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/20">
            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
                aria-hidden="true"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-1">Easy Changes</h3>
            <p className="text-sm text-white/80">Flexible reschedule options available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
