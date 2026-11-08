import { useNavigate } from 'react-router-dom'

const features = [
    {
        path: 'consultation',
        icon: '💬',
        badge: 'Pharmacist Support',
        badgeColor: 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20',
        title: 'Online Consultation',
        description: 'Get quick guidance by text chat or arrange a detailed video consultation with a qualified pharmacist.',
        action: 'Explore Consultation →',
        color: 'from-[#0D9488]/10 to-[#0D9488]/5',
        border: 'border-[#0D9488]/30',
        btnColor: 'bg-[#0D9488] hover:bg-[#0F766E]',
    },
    {
        path: 'inventory',
        icon: '📍',
        badge: 'Live Stock Search',
        badgeColor: 'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/20',
        title: 'Local Pharmacy Inventory',
        description: 'Search medicines and explore live pharmacy inventory, stock status, and store coverage across Karachi.',
        action: 'Find a Medicine →',
        color: 'from-[#F43F5E]/10 to-[#F43F5E]/5',
        border: 'border-[#F43F5E]/30',
        btnColor: 'bg-[#F43F5E] hover:bg-[#E11D48]',
    },
]

const PharmacyPage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span>›</span>
                <span className="text-[#0D9488] font-medium">Online Pharmacy</span>
            </nav>

            {/* Page Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 shadow-sm">
                    💊 CarePoint Pharmacy
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-3">
                    Online Pharmacy Services
                </h1>
                <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                    Consult a licensed pharmacist online or check live medicine inventory and pharmacy locations across Karachi.
                </p>
            </div>

            {/* Cards Grid matching Doctor Page Width & Height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                {features.map((feature) => (
                    <div
                        key={feature.path}
                        onClick={() => navigate(`/pharmacy/${feature.path}`)}
                        className={`bg-gradient-to-br ${feature.color} border ${feature.border} rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group bg-white shadow-sm`}
                    >
                        <div className="text-6xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform duration-200">
                            {feature.icon}
                        </div>
                        <span className={`text-xs font-semibold border px-3.5 py-1 rounded-full mb-4 ${feature.badgeColor}`}>
                            {feature.badge}
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                            {feature.title}
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            {feature.description}
                        </p>
                        <button
                            type="button"
                            className={`${feature.btnColor} text-white font-semibold w-full py-3.5 rounded-xl transition-all shadow-md text-sm mt-auto cursor-pointer`}
                        >
                            {feature.action}
                        </button>
                    </div>
                ))}
            </div>

            {/* Service Availability Notice */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs sm:text-sm text-slate-600 max-w-4xl mx-auto shadow-sm">
                <strong className="text-slate-800">Service availability:</strong> Pharmacy listings, stock, consultation requests, and prescription reviews are not connected to a live provider system yet. Confirm availability and prescription requirements directly with a licensed pharmacy or pharmacist.
            </div>

            {/* Info Strips */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                    { icon: '💊', text: 'Licensed pharmacist consultations' },
                    { icon: '📍', text: 'Live pharmacy inventory lookup' },
                    { icon: '⚡', text: 'Fast response & easy ordering' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-5 py-3.5 shadow-sm">
                        <span className="text-xl">{item.icon}</span>
                        <p className="text-slate-600 text-xs sm:text-sm font-medium">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PharmacyPage
