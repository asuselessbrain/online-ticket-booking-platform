import React, { useState } from 'react';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log('Contact form submit', form);
        setStatus('Thanks — we received your message and will reply shortly.');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <main className="py-12 px-4">
            <div className="max-w-[1440px] mx-auto grid gap-8 lg:grid-cols-2 items-stretch">
                <section className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Contact Us</h1>
                    <p className="text-slate-600 mb-6">Have a question or need help booking? Send us a message and our support team will get back to you.</p>

                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <input required name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="rounded-lg border p-2" />
                        <input required name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email address" className="rounded-lg border p-2 mt-3" />

                        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="rounded-lg border p-2 mt-3" />

                        <textarea required name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Your message" className="rounded-lg border p-2 mt-3" />

                        <div className="flex items-center justify-between mt-auto">
                            <button type="submit" className="bg-[#01602a] w-full text-white px-4 py-2 rounded-lg font-semibold">Send Message</button>
                            {status && <div className="text-sm text-green-600 ml-4">{status}</div>}
                        </div>
                    </form>
                </section>

                <aside className="space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-900">Support</h3>
                        <p className="text-sm text-slate-600 mt-2">Email: <a href="mailto:support@example.com" className="text-primary">support@example.com</a></p>
                        <p className="text-sm text-slate-600">Phone: <a href="tel:+880123456789" className="text-primary">+880 1234 56789</a></p>
                        <p className="text-sm text-slate-600 mt-2">Office hours: Mon — Sun, 8:00 — 22:00</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-900">Headquarters</h3>
                        <address className="not-italic text-sm text-slate-600 mt-2">123, Example Street<br />Dhaka, Bangladesh</address>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-900">Find us</h3>
                        <div className="mt-3 rounded-md overflow-hidden h-40" aria-hidden>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.0508146392444!2d90.38017237646179!3d22.464724679568743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30aacf2fe39e501f%3A0xec70c954a51b0386!2sPatuakhali%20Science%20%26%20Technology%20University%20(PSTU)!5e0!3m2!1sen!2sbd!4v1765474125909!5m2!1sen!2sbd"
                                title="Patuakhali Science & Technology University"
                                className="w-full h-full border-0"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </aside>
            </div>

            <section className="max-w-7xl mx-auto mt-10">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">Frequently asked questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <details className="p-3 rounded-md bg-slate-50">
                            <summary className="font-medium">How do I change or cancel my booking?</summary>
                            <div className="mt-2 text-sm text-slate-600">Contact the vendor directly or reach out to support; changes depend on vendor policies.</div>
                        </details>
                        <details className="p-3 rounded-md bg-slate-50">
                            <summary className="font-medium">What payment methods are accepted?</summary>
                            <div className="mt-2 text-sm text-slate-600">We accept major credit cards and selected local payment gateways.</div>
                        </details>
                        <details className="p-3 rounded-md bg-slate-50">
                            <summary className="font-medium">Is my payment secure?</summary>
                            <div className="mt-2 text-sm text-slate-600">Yes — payments are secured using industry-standard encryption.</div>
                        </details>
                        <details className="p-3 rounded-md bg-slate-50">
                            <summary className="font-medium">How can vendors join the platform?</summary>
                            <div className="mt-2 text-sm text-slate-600">Vendors can register via the Vendor dashboard. Contact sales for onboarding details.</div>
                        </details>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;
