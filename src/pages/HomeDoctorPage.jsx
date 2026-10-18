import { useNavigate } from 'react-router-dom'

const HomeDoctorPage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span>›</span>
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/doctor')}>Doctor</span>
                <span>›</span>
                <span className="text-[#0D9488] font-medium">Home Doctor</span>
            </nav>

            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-sm">
                    🏠 Home Doctor
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-3">Choose Doctor by Gender</h1>
                <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                    We respect your comfort. Select your preferred doctor gender for your home visit.
                </p>
            </div>

            {/* Male / Female Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Male */}
                <div
                    onClick={() => navigate('/doctor/home/male')}
                    className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/30 rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group bg-white"
                >
                    <div className="text-6xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform">👨‍⚕️</div>
                    <span className="text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-400/20 px-3 py-1 rounded-full mb-4">
                        Male Doctor
                    </span>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Male Doctor</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        Experienced male doctors available for your home visit. Professional, verified, and PMDC registered.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full py-3.5 rounded-xl transition-all shadow-md text-sm mt-auto">
                        View Male Doctors →
                    </button>
                </div>

                {/* Female */}
                <div
                    onClick={() => navigate('/doctor/home/female')}
                    className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-400/30 rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group bg-white"
                >
                    <div className="text-6xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform">👩‍⚕️</div>
                    <span className="text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-400/20 px-3 py-1 rounded-full mb-4">
                        Female Doctor
                    </span>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Female Doctor</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        Trusted and compassionate female doctors who come to your doorstep with complete comfort and care.
                    </p>
                    <button className="bg-[#F43F5E] hover:bg-[#E11D48] text-white font-semibold w-full py-3.5 rounded-xl transition-all shadow-md text-sm mt-auto">
                        View Female Doctors →
                    </button>
                </div>
            </div>

            {/* Info strip */}
            <div className="mt-12 bg-[#0D9488]/5 border border-[#0D9488]/20 rounded-2xl p-6 max-w-4xl mx-auto text-center shadow-sm">
                <p className="text-slate-600 text-sm leading-relaxed">
                    <span className="font-bold text-[#0D9488]">✅ All home doctors</span> carry medical kits, are PMDC registered, and typically arrive within <span className="font-bold text-[#0F172A]">45–60 minutes</span> of booking.
                </p>
            </div>
        </div>
    )
}

export default HomeDoctorPage