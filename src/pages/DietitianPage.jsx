import { useNavigate } from 'react-router-dom'

const DietitianPage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">
                    Personalized Health &amp; Wellness
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                    Dietitian &amp; Nutritionist
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-2">
                    Select your primary health goal for custom diet plans
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                
                {/* 1. Weight Management */}
                <div className="bg-[#E6F4F1] border border-teal-100 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/80 border border-teal-100 flex items-center justify-center text-3xl mb-4 shadow-xs">
                            🥗
                        </div>
                        <span className="bg-[#C8EADF] text-[#0D9488] font-bold text-[10px] px-3 py-0.5 rounded-full mb-3">
                            Most Popular
                        </span>
                        <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                            Weight Management
                        </h2>
                        <p className="text-slate-600 text-xs leading-relaxed mb-6">
                            Customized sustainable fat loss, weight gain, and body toning diet programs.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/dietitian/weight-management')}
                        className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Choose Plan →
                    </button>
                </div>

                {/* 2. Clinical Nutrition */}
                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/80 border border-blue-100 flex items-center justify-center text-3xl mb-4 shadow-xs">
                            🩺
                        </div>
                        <span className="bg-blue-100 text-blue-700 font-bold text-[10px] px-3 py-0.5 rounded-full mb-3">
                            Medical Care
                        </span>
                        <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                            Clinical Nutrition
                        </h2>
                        <p className="text-slate-600 text-xs leading-relaxed mb-6">
                            Specialized medical diet therapy for Diabetes, PCOS, Thyroid, and High BP.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/dietitian/clinical-nutrition')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Choose Plan →
                    </button>
                </div>

                {/* 3. Sports & Fitness */}
                <div className="bg-[#FEEBF0] border border-rose-100 rounded-3xl p-8 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/80 border border-rose-100 flex items-center justify-center text-3xl mb-4 shadow-xs">
                            💪
                        </div>
                        <span className="bg-[#FCD2DC] text-[#E11D48] font-bold text-[10px] px-3 py-0.5 rounded-full mb-3">
                            Performance
                        </span>
                        <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                            Sports &amp; Fitness
                        </h2>
                        <p className="text-slate-600 text-xs leading-relaxed mb-6">
                            High-protein meal plans, muscle building nutrition, and athletic stamina diets.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/dietitian/sports-fitness')}
                        className="w-full bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Choose Plan →
                    </button>
                </div>

            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">👩‍⚕️</span>
                    <span className="text-xs font-semibold text-slate-700">Certified Nutritionists</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">📜</span>
                    <span className="text-xs font-semibold text-slate-700">100% Customized Meal Plans</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
                    <span className="text-lg">💬</span>
                    <span className="text-xs font-semibold text-slate-700">Continuous WhatsApp Follow-ups</span>
                </div>
            </div>
        </div>
    )
}

export default DietitianPage