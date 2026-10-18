import { useNavigate } from 'react-router-dom'

const doctorTypes = [
    {
        id: 'home',
        icon: '🏠',
        title: 'Home Doctor',
        desc: 'A qualified doctor visits your home for checkup, diagnosis, and treatment.',
        route: '/doctor/home',
        color: 'from-[#0D9488]/10 to-[#0D9488]/5',
        border: 'border-[#0D9488]/30',
        badge: 'Available Now',
        badgeColor: 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20',
        btnColor: 'bg-[#0D9488] hover:bg-[#0F766E]',
    },
    {
        id: 'emergency',
        icon: '🚨',
        title: 'Emergency Doctor',
        desc: 'Urgent care when you need it most. Our emergency doctors respond within 30 minutes.',
        route: '/doctor/emergency',
        color: 'from-[#F43F5E]/10 to-[#F43F5E]/5',
        border: 'border-[#F43F5E]/30',
        badge: '24/7 Available',
        badgeColor: 'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/20',
        btnColor: 'bg-[#F43F5E] hover:bg-[#E11D48]',
    },
    {
        id: 'general',
        icon: '🩺',
        title: 'General Doctor',
        desc: 'Pre-booked appointments with experienced general physicians and GPs.',
        route: '/doctor/general',
        color: 'from-[#0F172A]/5 to-[#1E293B]/5',
        border: 'border-[#0F172A]/20',
        badge: 'Book Appointment',
        badgeColor: 'bg-[#0F172A]/10 text-[#0F172A] border-[#0F172A]/20',
        btnColor: 'bg-[#0F172A] hover:bg-[#1E293B]',
    },
]

const DoctorPage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
            {/* Page Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-sm">
                    🩺 Choose Doctor Type
                </div>
                <h1 className="text-4xl font-extrabold text-[#0F172A] mb-3">Find Your Doctor</h1>
                <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
                    Select the type of medical consultation you need. We have the right doctor for every situation.
                </p>
            </div>

            {/* 3 Doctor Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {doctorTypes.map((type) => (
                    <div
                        key={type.id}
                        onClick={() => navigate(type.route)}
                        className={`bg-gradient-to-br ${type.color} border ${type.border} rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group bg-white`}
                    >
                        <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-200">{type.icon}</div>
                        <span className={`text-xs font-semibold border px-3 py-1 rounded-full mb-4 ${type.badgeColor}`}>
                            {type.badge}
                        </span>
                        <h3 className="text-xl font-bold text-[#0F172A] mb-3">{type.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">{type.desc}</p>
                        <button className={`${type.btnColor} text-white font-semibold w-full py-3 rounded-xl transition-all shadow-md text-sm mt-auto`}>
                            {type.id === 'emergency' ? 'Get Emergency Help →' : `Choose ${type.title} →`}
                        </button>
                    </div>
                ))}
            </div>

            {/* Info strips */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                    { icon: '✅', text: 'All doctors are PMDC verified' },
                    { icon: '🔒', text: 'Secure & private consultations' },
                    { icon: '⚡', text: 'Fast response in under 30 mins' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-5 py-3.5 shadow-sm">
                        <span className="text-xl">{item.icon}</span>
                        <p className="text-slate-600 text-sm font-medium">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DoctorPage