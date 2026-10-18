import { useNavigate } from 'react-router-dom'

const EmergencyDoctorPage = () => {
    const navigate = useNavigate()
const handleBookingClick = () => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login') // Agar login nahi hai toh login page par redirect karega
        } else {
            navigate('/book/general') // Agar login hai toh booking page par jane dega
        }
    }
    const emergencyDoctors = [
        { name: 'Dr. Sana Tariq', specialty: 'Emergency Medicine Specialist', location: 'Lahore', rating: 4.9, eta: '15 mins', available: true },
        { name: 'Dr. Kamran Butt', specialty: 'Critical Care Physician', location: 'Karachi', rating: 4.8, eta: '20 mins', available: true },
        { name: 'Dr. Wajid Shah', specialty: 'Emergency Physician', location: 'Islamabad', rating: 4.7, eta: '25 mins', available: false },
        { name: 'Dr. Sara Hussain', specialty: 'Emergency Medicine', location: 'Rawalpindi', rating: 4.9, eta: '18 mins', available: true },
    ]

    const StarRating = ({ rating }) => (
        <div className="flex items-center gap-1 my-1">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="text-xs font-medium text-slate-500 ml-1">{rating}</span>
        </div>
    )

    return (
        <div className="w-full">
            {/* Emergency Banner */}
            <div className="bg-gradient-to-r from-[#F43F5E] to-[#E11D48] text-white py-8 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-center sm:text-left">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0 animate-pulse border border-white/20">
                                🚨
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Emergency Doctor Service</h2>
                                <p className="text-rose-100 text-sm mt-1">Available 24/7 — Doctor reaches you within 30 minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
                                <p className="text-[10px] text-rose-100 uppercase font-semibold">Emergency Helpline</p>
                                <p className="text-xl font-black tracking-wide">1122</p>
                            </div>
                            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
                                <p className="text-[10px] text-rose-100 uppercase font-semibold">CarePoint SOS</p>
                                <p className="text-xl font-black tracking-wide">051-111</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                    <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                    <span>›</span>
                    <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/doctor')}>Doctor</span>
                    <span>›</span>
                    <span className="text-[#F43F5E] font-medium">Emergency Doctor</span>
                </nav>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2 flex items-center gap-2">
                        <span>🚨</span> Emergency Doctors Near You
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base">Dispatching immediately — all doctors carry full emergency kits</p>
                </div>

                {/* Doctor Listings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {emergencyDoctors.map((doc, i) => (
                        <div key={i} className={`bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between ${doc.available ? 'border-rose-200' : 'border-slate-100'}`}>
                            <div>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl shrink-0 ${doc.available ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'}`}>
                                        🏥
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-bold text-[#0F172A] text-lg truncate">{doc.name}</h3>
                                            {doc.available
                                                ? <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">● Available</span>
                                                : <span className="text-[11px] bg-slate-100 text-slate-400 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">Busy</span>
                                            }
                                        </div>
                                        <p className="text-slate-500 text-xs mt-0.5">{doc.specialty}</p>
                                        <StarRating rating={doc.rating} />
                                        <p className="text-xs text-slate-400 mt-1 font-medium">📍 {doc.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-2">
                                {doc.available ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                                        <span className="text-xs sm:text-sm font-semibold text-slate-600">ETA: <span className="text-[#0D9488] font-bold">{doc.eta}</span></span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400 font-medium">Next available soon</span>
                                )}
                                <button
                                    disabled={!doc.available}
                                    onClick={handleBookingClick}
                                    className={`font-bold px-5 py-2.5 rounded-xl text-sm transition-all ml-auto ${doc.available
                                            ? 'bg-[#F43F5E] hover:bg-[#E11D48] text-white shadow-md hover:shadow-[0_4px_12px_rgba(244,63,94,0.4)]'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {doc.available ? '🚨 Dispatch Now' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { icon: '⚡', title: 'Rapid Response', desc: 'Doctors arrive within 15–30 minutes after booking' },
                        { icon: '💼', title: 'Full Medical Kit', desc: 'Emergency equipment, medicines, and IV supplies carried' },
                        { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock helpline available — call 1122' },
                    ].map((item, i) => (
                        <div key={i} className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 text-center">
                            <div className="text-3xl mb-3">{item.icon}</div>
                            <h4 className="font-bold text-[#0F172A] mb-1 text-sm sm:text-base">{item.title}</h4>
                            <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EmergencyDoctorPage