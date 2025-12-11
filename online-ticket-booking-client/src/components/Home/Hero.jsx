import banner from '../../assets/images/banner.jpg';

const Hero = () => {
    return (
        <section className="bg-linear-to-b from-slate-50 to-white py-12 px-4">
            <div className="max-w-[1440px] mx-auto grid gap-8 items-center lg:grid-cols-2">
                <div className="p-4 pl-0">
                    <div className="text-sm font-semibold text-slate-700 mb-2">Fast • Reliable • Affordable</div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">Discover & Book Travel Tickets</h1>
                    <p className="text-slate-600 mt-3 mb-6">Find Bus, Train, Launch &amp; Plane tickets. Compare prices, choose seats, and book instantly — anywhere, anytime.</p>

                    <form className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center" onSubmit={(e) => e.preventDefault()}>
                        <select name="mode" aria-label="Travel mode" className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                            <option value="bus">Bus</option>
                            <option value="train">Train</option>
                            <option value="launch">Launch</option>
                            <option value="plane">Plane</option>
                        </select>

                        <input name="from" aria-label="From" placeholder="From — City / Station" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />

                        <input name="to" aria-label="To" placeholder="To — City / Station" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />

                        <input type="date" name="date" aria-label="Date" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />

                        <button type="submit" className="w-full md:w-auto bg-[#01602a] text-white rounded-lg px-4 py-2 font-semibold">Search Tickets</button>
                    </form>

                    <div className="mt-4 flex gap-3">
                        <button className="rounded-lg border border-[#01602a] px-4 py-2 text-sm font-semibold">Become a Vendor</button>
                        <button className="rounded-lg px-4 py-2 text-sm text-slate-800">How it works</button>
                    </div>
                </div>

                <div aria-hidden="true" className="flex flex-col gap-4">
                    <div className="rounded-xl overflow-hidden shadow-lg bg-linear-to-r from-emerald-200 to-sky-400">
                        <img src={banner} className='w-full' alt="360-F-667565388-5jy-KNCXSA2-Ct-HLJ81-GOQe-Xn1-Jx-PG0zf-D" />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1 bg-white rounded-lg p-3 shadow-sm text-center">
                            <div className="text-lg font-bold text-slate-900">1M+</div>
                            <div className="text-sm text-slate-500">Bookings</div>
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-3 shadow-sm text-center">
                            <div className="text-lg font-bold text-slate-900">2k+</div>
                            <div className="text-sm text-slate-500">Vendors</div>
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-3 shadow-sm text-center">
                            <div className="text-lg font-bold text-slate-900">500+</div>
                            <div className="text-sm text-slate-500">Routes</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;