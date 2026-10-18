import { useState } from 'react'

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (form.name && form.email && form.message) {
            setSubmitted(true)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-sm">
                    📞 Get In Touch
                </div>
                <h1 className="text-4xl font-extrabold text-[#0F172A] mb-3">Contact Us</h1>
                <p className="text-slate-500 text-lg">We're here to help you 24/7</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div>
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Reach Out to Us</h2>
                    <div className="space-y-4">
                        {[
                            { icon: '📞', title: 'Emergency Helpline', value: '1122', sub: '24/7 Emergency Response' },
                            { icon: '📱', title: 'CarePoint Helpline', value: '051-111-222-333', sub: 'Mon–Sat, 8am–10pm' },
                            { icon: '📧', title: 'Email', value: 'support@carepoint.pk', sub: 'Reply within 24 hours' },
                            { icon: '📍', title: 'Head Office', value: 'Islamabad, Pakistan', sub: 'Blue Area, F-7 Markaz' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                                <div className="text-2xl bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">{item.title}</p>
                                    <p className="text-[#0F172A] font-bold text-base">{item.value}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                    {submitted ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">✅</div>
                            <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Message Sent!</h3>
                            <p className="text-slate-500 mb-6">Our team will get back to you shortly.</p>
                            <button
                                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }) }}
                                className="bg-[#0D9488] text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Send a Message</h3>
                            {[
                                { key: 'name', label: 'Full Name *', type: 'text', placeholder: 'Your full name' },
                                { key: 'email', label: 'Email Address *', type: 'email', placeholder: 'your@email.com' },
                                { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+92 300 1234567' },
                            ].map((field) => (
                                <div key={field.key}>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{field.label}</label>
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={form[field.key]}
                                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all bg-white"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Message *</label>
                                <textarea
                                    rows={4}
                                    placeholder="How can we help you?"
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all resize-none bg-white"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold w-full py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[0_8px_20px_rgba(13,148,136,0.3)] text-sm"
                            >
                                Send Message →
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContactPage