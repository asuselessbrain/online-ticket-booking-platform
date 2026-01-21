import React from 'react';

const features = [
  { id: 'f1', title: 'Secure Booking', desc: 'Encrypted payments and secure ticket issuance.', icon: 'shield' },
  { id: 'f2', title: '24/7 Support', desc: 'Customer service available round the clock.', icon: 'chat' },
  { id: 'f3', title: 'Best Price Guarantee', desc: 'Compare prices and get the best deal.', icon: 'tag' },
  { id: 'f4', title: 'Wide Coverage', desc: 'Routes across the country and multiple operators.', icon: 'map' },
];

const Icon = ({ name }) => {
  switch (name) {
    case 'shield':
      return (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2l7 4v5c0 5-3.582 9-7 11-3.418-2-7-6-7-11V6l7-4z" />
        </svg>
      );
    case 'chat':
      return (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.6 9.6 0 01-4-.9L3 20l1.1-3A7.6 7.6 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'tag':
      return (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7v4a1 1 0 001 1h4l7 7V7a1 1 0 00-1-1H8a1 1 0 00-1 1z" />
        </svg>
      );
    case 'map':
      return (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5-2V6l5 2 7-3 5 2v10l-5-2-7 3z" />
        </svg>
      );
    default:
      return null;
  }
};

const WhyChooseUs = () => {
  return (
    <section aria-labelledby="why-heading" className="bg-linear-to-r from-[#01602a] to-[#014d21] py-16 px-4">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="why-heading" className="text-2xl font-extrabold text-white">Why Choose Us?</h2>
          <p className="text-sm text-white/80">We make travel simple, safe and affordable</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.id} className="bg-white rounded-lg shadow-sm p-5 flex flex-col gap-3 items-start hover:-translate-y-2 hover:shadow-lg transition duration-300 cursor-pointer">
              <div className="p-3 bg-slate-50 rounded-md group-hover:bg-[#e7f7ee] transition">
                <Icon name={f.icon} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
