import banner from '../../assets/images/banner.jpg';
import { Link } from 'react-router';

const team = [
  { id: 'u1', name: 'Arif H.', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=60&auto=format&fit=crop' },
  { id: 'u2', name: 'Mina R.', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1545996124-1b9a5f3b9f12?w=600&q=60&auto=format&fit=crop' },
  { id: 'u3', name: 'Rafi K.', role: 'Lead Engineer', image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=600&q=60&auto=format&fit=crop' },
  { id: 'u4', name: 'Sadia N.', role: 'Customer Success', image: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=600&q=60&auto=format&fit=crop' },
];

const About = () => {
  return (
    <main className="py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        <section className="grid gap-8 lg:grid-cols-2 items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">About Our Platform</h1>
            <p className="text-slate-600 mb-4">We help travelers discover and book tickets for Bus, Train, Launch and Plane — all from a single, trusted platform. Our goal is to make travel simple, affordable and reliable for everyone.</p>

            <h3 className="text-xl font-semibold text-slate-900">Our mission</h3>
            <p className="text-slate-600">To connect people with safe and affordable travel options across the country by empowering vendors and providing a smooth booking experience for users.</p>

            <div className="mt-6 flex gap-3">
              <Link to="/registration" className="inline-block bg-primary text-white px-4 py-2 rounded-lg font-semibold">Get Started</Link>
              <Link to="/contact" className="inline-block text-primary px-4 py-2 rounded-lg border border-slate-200">Contact Us</Link>
            </div>
          </div>

            <div className="bg-linear-to-r from-emerald-200 to-sky-300 rounded-xl overflow-hidden shadow-lg">
                <img src={banner} alt="About banner" className='w-full' />
            </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4">By the numbers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold">1M+</div>
              <div className="text-sm text-slate-500">Bookings</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold">2k+</div>
              <div className="text-sm text-slate-500">Vendors</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-slate-500">Routes</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-slate-500">Uptime</div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(m => (
              <div key={m.id} className="bg-white rounded-lg p-4 flex flex-col items-center text-center shadow-sm">
                <img src={m.image} alt={m.name} className="w-24 h-24 rounded-full object-cover mb-3" />
                <div className="font-semibold text-slate-900">{m.name}</div>
                <div className="text-sm text-slate-500">{m.role}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4">What we value</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Trust & Safety</h3>
              <p className="text-slate-600 mt-2">We verify vendors and provide secure payments so you can book with confidence.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Customer-first</h3>
              <p className="text-slate-600 mt-2">We build features with real travelers in mind and offer 24/7 support.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Fair prices</h3>
              <p className="text-slate-600 mt-2">Compare multiple operators to get the best deals and transparent fees.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Accessibility</h3>
              <p className="text-slate-600 mt-2">We aim to make booking accessible across devices and easy to use.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
