import { useNavigate } from 'react-router-dom'

const UltrasoundPage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">
                    Diagnostic Imaging Services
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                    Ultrasound Appointments
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-2">
                    Select your preferred shift to view available hospitals and labs
                </p>
            </div>

            {/* Cards Grid (Day / Night Shifts) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                
                {/* 1. Day Shift Card */}
                <div className="bg-[#E6F4F1] border border-teal-100 rounded-3xl p-8 sm:p-10 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center">
                        <div className="text-5xl mb-4">☀️</div>
                        <span className="bg-[#C8EADF] text-[#0D9488] font-bold text-[11px] px-3 py-1 rounded-full mb-4">
                            9:00 AM - 5:00 PM
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                            Day Shift Ultrasound
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-8 max-w-xs">
                            Routine abdominal, pelvic, Doppler, and pregnancy scans available during regular OPD hours.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/ultrasound/day')}
                        className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        View Day Shift Hospitals →
                    </button>
                </div>

                {/* 2. Night Shift Card */}
                <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-8 sm:p-10 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all text-white">
                    <div className="flex flex-col items-center">
                        <div className="text-5xl mb-4">🌙</div>
                        <span className="bg-slate-700 text-teal-300 font-bold text-[11px] px-3 py-1 rounded-full mb-4">
                            24/7 &amp; Emergency Night Shift
                        </span>
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Night Shift Ultrasound
                        </h2>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8 max-w-xs">
                            Emergency imaging, urgent obstetric care, and late-night diagnostic scans.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/ultrasound/night')}
                        className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        View Night Shift Hospitals →
                    </button>
                </div>

            </div>

            {/* Bottom Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">🏥</span>
                    <span className="text-xs font-semibold text-slate-700">Top Verified Hospitals</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">⚡</span>
                    <span className="text-xs font-semibold text-slate-700">Instant Token Confirmation</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">📑</span>
                    <span className="text-xs font-semibold text-slate-700">Digital Scan Reports</span>
                </div>
            </div>
        </div>
    )
}

export default UltrasoundPage