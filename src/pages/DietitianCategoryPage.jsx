import { useNavigate, useParams } from 'react-router-dom'

const DietitianCategoryPage = () => {
    const { goal } = useParams()
    const navigate = useNavigate()

    const goalTitles = {
        'weight-management': 'Weight Management Program',
        'clinical-nutrition': 'Clinical Nutrition Therapy',
        'sports-fitness': 'Sports & Fitness Nutrition',
    }

    const currentTitle = goalTitles[goal] || 'Custom Diet Program'

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            {/* Back Button */}
            <button
                onClick={() => navigate('/dietitian')}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-8 flex items-center gap-1 cursor-pointer transition-colors"
            >
                ← Back to Health Goals
            </button>

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="bg-[#C8EADF] text-[#0D9488] font-bold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                    {currentTitle}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-2">
                    Select Consultation Mode
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                    Choose how you want to interact with your nutritionist
                </p>
            </div>

            {/* Cards Grid with Background Colors & Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
                
                {/* Online Video Consultation Card */}
                <div className="bg-[#E6F4F1] border border-teal-100 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/80 border border-teal-100 flex items-center justify-center text-4xl mb-4 shadow-sm">
                            💻
                        </div>
                        <span className="bg-[#C8EADF] text-[#0D9488] font-bold text-[10px] px-3 py-0.5 rounded-full mb-3">
                            Remote Session
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                            Online Video Consultation
                        </h2>
                        <p className="text-slate-600 text-xs leading-relaxed mb-4">
                            Convenient video session &amp; digital customized diet chart delivered online.
                        </p>
                        <p className="text-[#0D9488] font-black text-base mb-6">PKR 1,500 / month</p>
                    </div>

                    <button
                        onClick={() => navigate(`/dietitian/list/${goal}`, { state: { mode: 'online' } })} // ya 'clinic'
                        className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Choose Online Plan →
                    </button>
                </div>

                {/* In-Clinic Visit Card */}
                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/80 border border-blue-100 flex items-center justify-center text-4xl mb-4 shadow-sm">
                            🏥
                        </div>
                        <span className="bg-blue-100 text-blue-700 font-bold text-[10px] px-3 py-0.5 rounded-full mb-3">
                            In-Person Care
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                            In-Clinic Visit
                        </h2>
                        <p className="text-slate-600 text-xs leading-relaxed mb-4">
                            Includes physical body composition analysis and face-to-face dietary assessment.
                        </p>
                        <p className="text-blue-600 font-black text-base mb-6">PKR 2,500 / session</p>
                    </div>

                    <button
                        onClick={() => navigate(`/dietitian/list/${goal}`, { state: { mode: 'clinic' } })}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Choose Clinic Visit →
                    </button>
                </div>

            </div>

            {/* Bottom Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">🔒</span>
                    <span className="text-xs font-semibold text-slate-700">Private Consultations</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">⭐</span>
                    <span className="text-xs font-semibold text-slate-700">Verified Nutritionists</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">📱</span>
                    <span className="text-xs font-semibold text-slate-700">Ongoing Chat Support</span>
                </div>
            </div>
        </div>
    )
}

export default DietitianCategoryPage