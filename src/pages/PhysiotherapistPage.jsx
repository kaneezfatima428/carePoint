import { useNavigate } from 'react-router-dom'

const PhysiotherapistPage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">
                    Physiotherapy for every situation
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                    Professional Physical Rehabilitation
                </h1>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                
                {/* 1. General Physiotherapy Card */}
                <div className="bg-[#E6F4F1] border border-teal-100 rounded-3xl p-8 sm:p-10 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center">
                        <div className="text-5xl mb-4">🏃‍♂️</div>
                        <span className="bg-[#C8EADF] text-[#0D9488] font-bold text-[11px] px-3 py-1 rounded-full mb-4">
                            Available Now
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                            General Physiotherapy
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-8 max-w-xs">
                            Back pain, joint stiffness, posture correction, and personalized home mobility rehabilitation.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/physiotherapist/general')}
                        className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Choose General Physio →
                    </button>
                </div>

                {/* 2. Sports Injury Rehab Card */}
                <div className="bg-[#FEEBF0] border border-rose-100 rounded-3xl p-8 sm:p-10 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center">
                        <div className="text-5xl mb-4">🏋️‍♂️</div>
                        <span className="bg-[#FCD2DC] text-[#E11D48] font-bold text-[11px] px-3 py-1 rounded-full mb-4">
                            Specialized Recovery
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                            Sports Injury Rehab
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-8 max-w-xs">
                            Urgent ligament recovery, muscle strain, athletic performance restoration, and therapy.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/physiotherapist/sports')}
                        className="w-full bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Choose Sports Physio →
                    </button>
                </div>

            </div>

            {/* Bottom Trust Badges (Matching Doctor Page) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">✅</span>
                    <span className="text-xs font-semibold text-slate-700">Certified Physical Therapists</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">🏠</span>
                    <span className="text-xs font-semibold text-slate-700">At-Home &amp; Clinic Sessions</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">⚡</span>
                    <span className="text-xs font-semibold text-slate-700">Personalized Recovery Plans</span>
                </div>
            </div>
        </div>
    )
}

export default PhysiotherapistPage