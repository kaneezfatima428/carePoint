import { useNavigate, useParams } from 'react-router-dom'

const PhysioCategoryPage = () => {
    const { category } = useParams() // 'general' ya 'sports'
    const navigate = useNavigate()

    const categoryTitle = category === 'sports' ? 'Sports Injury Rehab' : 'General Physiotherapy'

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            {/* Back Button */}
            <button
                onClick={() => navigate('/physiotherapist')}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-8 flex items-center gap-1 cursor-pointer transition-colors"
            >
                ← Back to Services
            </button>

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="bg-[#C8EADF] text-[#0D9488] font-bold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                    {categoryTitle}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-2">
                    Select Therapist Gender
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                    Choose your preferred practitioner for maximum comfort during therapy
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
                
                {/* Male Physiotherapist Card */}
                <div className="bg-[#E6F4F1] border border-teal-100 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/80 border border-teal-100 flex items-center justify-center text-4xl mb-4 shadow-sm">
                            👨‍⚕️
                        </div>
                        <span className="bg-[#C8EADF] text-[#0D9488] font-bold text-[10px] px-3 py-0.5 rounded-full mb-3">
                            Male Practitioners
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                            Male Physiotherapist
                        </h2>
                        <p className="text-slate-600 text-xs leading-relaxed mb-6">
                            Experienced male physical therapists available for home &amp; clinic sessions.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(`/physiotherapist/${category}/male`)}
                        className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Choose Male Therapist →
                    </button>
                </div>

                {/* Female Physiotherapist Card */}
                <div className="bg-[#FEEBF0] border border-rose-100 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/80 border border-rose-100 flex items-center justify-center text-4xl mb-4 shadow-sm">
                            👩‍⚕️
                        </div>
                        <span className="bg-[#FCD2DC] text-[#E11D48] font-bold text-[10px] px-3 py-0.5 rounded-full mb-3">
                            Female Practitioners
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                            Female Physiotherapist
                        </h2>
                        <p className="text-slate-600 text-xs leading-relaxed mb-6">
                            Certified female specialists for women's care and personalized therapy.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(`/physiotherapist/${category}/female`)}
                        className="w-full bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Choose Female Therapist →
                    </button>
                </div>

            </div>

            {/* Bottom Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">🔒</span>
                    <span className="text-xs font-semibold text-slate-700">100% Private &amp; Verified</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">🎓</span>
                    <span className="text-xs font-semibold text-slate-700">Qualified Professionals</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">🗓️</span>
                    <span className="text-xs font-semibold text-slate-700">Flexible Session Booking</span>
                </div>
            </div>
        </div>
    )
}

export default PhysioCategoryPage