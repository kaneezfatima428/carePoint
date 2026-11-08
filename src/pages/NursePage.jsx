import { useNavigate } from 'react-router-dom'

const nurseCategories = [
    {
        id: 'home',
        icon: '🏠',
        title: 'Home Nurses',
        badge: 'Available Now',
        badgeColor: 'bg-emerald-500/10 text-[#0D9488] border-emerald-400/20',
        desc: 'Qualified registered nurses visit your home for post-surgical care, IV drips, injections, elderly patient assistance, wound dressing, and vitals monitoring.',
        route: '/nurse/home',
        color: 'from-emerald-500/10 to-teal-600/5',
        border: 'border-emerald-500/30',
        btnColor: 'bg-[#0D9488] hover:bg-[#0F766E]',
        features: ['Post-Operative Care', 'IV Infusion & Cannula', 'Elderly Patient Support', 'Wound & Dressing Care'],
    },
    {
        id: 'emergency',
        icon: '🚨',
        title: 'Emergency Nurses',
        badge: '24/7 Rapid Response',
        badgeColor: 'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/20',
        desc: 'Rapid-dispatch emergency care nurses for acute medical situations, urgent trauma dressing, oxygen support, critical bedside assistance, and vitals stabilization.',
        route: '/nurse/emergency',
        color: 'from-[#F43F5E]/10 to-[#F43F5E]/5',
        border: 'border-[#F43F5E]/30',
        btnColor: 'bg-[#F43F5E] hover:bg-[#E11D48]',
        features: ['Reaches within 30 mins', 'Emergency Oxygen Setup', 'Trauma & Wound Care', 'Urgent Injections & Vitals'],
    },
]

const NursePage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span>›</span>
                <span className="text-[#0D9488] font-medium">Nurse Care</span>
            </nav>

            {/* Page Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 shadow-sm">
                    💉 Professional Nursing Services
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-3">
                    Choose Your Nursing Care
                </h1>
                <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                    Select the type of nursing support you need. From routine at-home recovery to immediate 24/7 emergency bedside assistance.
                </p>
            </div>

            {/* 2 Nurse Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-14">
                {nurseCategories.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => navigate(cat.route)}
                        className={`bg-gradient-to-br ${cat.color} border ${cat.border} rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group bg-white shadow-sm`}
                    >
                        <div>
                            <div className="flex items-center justify-between gap-3 mb-5">
                                <div className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-200">
                                    {cat.icon}
                                </div>
                                <span className={`text-xs font-bold border px-3 py-1 rounded-full ${cat.badgeColor}`}>
                                    {cat.badge}
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-[#0F172A] mb-3">{cat.title}</h2>
                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                                {cat.desc}
                            </p>

                            {/* Feature highlights */}
                            <div className="space-y-2 mb-6">
                                {cat.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                        <span className="text-[#0D9488]">✓</span>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className={`${cat.btnColor} text-white font-bold w-full py-3.5 rounded-xl transition-all shadow-md text-xs sm:text-sm mt-auto cursor-pointer`}>
                            Choose {cat.title} →
                        </button>
                    </div>
                ))}
            </div>

            {/* Bottom Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                    { icon: '🛡️', title: 'PNC Verified Nurses', desc: 'All nurses are licensed by Pakistan Nursing Council' },
                    { icon: '💼', title: 'Sterilized Medical Kits', desc: 'Carrying sanitized dressings, cannula & vital tools' },
                    { icon: '⚡', title: 'Swift Arrival', desc: 'At your doorstep within 30–45 minutes of booking' },
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                            <p className="text-slate-800 text-xs sm:text-sm font-bold">{item.title}</p>
                            <p className="text-slate-400 text-[11px] leading-tight mt-0.5">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NursePage
