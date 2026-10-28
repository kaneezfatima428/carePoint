import { Link } from 'react-router-dom'

const features = [
    {
        path: 'consultation',
        icon: '💬',
        title: 'Online Consultation',
        description: 'Get quick guidance by text chat or arrange a detailed video consultation.',
        action: 'Explore consultation',
        color: 'border-teal-200 bg-teal-50/70 hover:border-teal-400',
    },
    {
        path: 'prescription',
        icon: '📋',
        title: 'Prescription Upload & Verification',
        description: 'Submit a prescription for pharmacist review and access approved medicines.',
        action: 'Upload a prescription',
        color: 'border-blue-200 bg-blue-50/70 hover:border-blue-400',
    },
    {
        path: 'inventory',
        icon: '📍',
        title: 'Local Pharmacy Inventory',
        description: 'Search medicines and explore pharmacy coverage across Karachi.',
        action: 'Find a medicine',
        color: 'border-rose-200 bg-rose-50/70 hover:border-rose-400',
    },
]

const PharmacyPage = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block bg-teal-100 text-teal-800 font-bold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
                CarePoint Pharmacy
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Online Pharmacy</h1>
            <p className="text-slate-500 text-sm sm:text-base mt-3">
                Consult a pharmacist, submit a prescription for review, or find pharmacy services across Karachi.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feature) => (
                <Link
                    key={feature.path}
                    to={`/pharmacy/${feature.path}`}
                    className={`group rounded-3xl border p-6 sm:p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488] ${feature.color}`}
                >
                    <span className="text-4xl" aria-hidden="true">{feature.icon}</span>
                    <h2 className="mt-5 text-xl font-bold text-[#0F172A]">{feature.title}</h2>
                    <p className="mt-2 min-h-12 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0D9488]">
                        {feature.action} <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                </Link>
            ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            <strong className="text-slate-800">Service availability:</strong> Pharmacy listings, stock, consultation requests, and prescription reviews are not connected to a live provider system yet. Confirm availability and prescription requirements directly with a licensed pharmacy or pharmacist.
        </div>
    </div>
)

export default PharmacyPage
