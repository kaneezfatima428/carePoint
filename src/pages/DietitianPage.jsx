import { useNavigate } from 'react-router-dom'

const goalsList = [
    {
        id: 'weight-management',
        title: 'Weight Management',
        icon: '⚖️',
        desc: 'Customized weight loss & gain plans'
    },
    {
        id: 'clinical-nutrition',
        title: 'Clinical Nutrition',
        icon: '🩺',
        desc: 'PCOS, Diabetes, BP & Thyroid management'
    },
    {
        id: 'sports-fitness',
        title: 'Sports & Fitness',
        icon: '🏋️‍♂️',
        desc: 'Muscle building & performance nutrition'
    }
]

const DietitianPage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="bg-[#C8EADF] text-[#0D9488] font-bold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                    Personalized Nutrition Plans
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-2">
                    Choose Your Health Goal
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                    Select your primary target to find certified dietitians and nutritionists.
                </p>
            </div>

            {/* Goal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {goalsList.map((goal) => (
                    <div
                        key={goal.id}
                        onClick={() => navigate(`/dietitian/category/${goal.id}`)}
                        className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-between items-center text-center shadow-xs hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-[#E6F4F1] border border-teal-100 flex items-center justify-center text-4xl mb-5 shadow-xs group-hover:scale-105 transition-transform">
                                {goal.icon}
                            </div>
                            <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                                {goal.title}
                            </h2>
                            <p className="text-slate-500 text-xs leading-relaxed mb-6">
                                {goal.desc}
                            </p>
                        </div>

                        {/* Prominent Button Design */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/dietitian/category/${goal.id}`)
                            }}
                            className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3 px-5 rounded-2xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Explore Experts →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DietitianPage