import { useNavigate, useParams } from 'react-router-dom'

const nutritionistsData = [
    {
        id: 1,
        name: 'Dr. Ayesha Khan',
        gender: 'female',
        specialty: 'Weight Management & Clinical Nutrition',
        experience: '7 Years Exp',
        rating: 4.9,
        feeOnline: 1500,
        feeClinic: 2500,
        location: 'Gulberg III, Lahore',
        timings: 'Mon - Sat (10:00 AM - 4:00 PM)',
        slots: ['11:00 AM', '01:00 PM', '03:00 PM'],
    },
    {
        id: 2,
        name: 'Dr. Hamza Ali',
        gender: 'male',
        specialty: 'Sports Nutrition & Muscle Building',
        experience: '6 Years Exp',
        rating: 4.8,
        feeOnline: 1500,
        feeClinic: 2500,
        location: 'Clifton, Karachi',
        timings: 'Mon - Fri (2:00 PM - 8:00 PM)',
        slots: ['03:00 PM', '05:00 PM', '07:00 PM'],
    },
    {
        id: 3,
        name: 'Dr. Sana Ahmed',
        gender: 'female',
        specialty: 'Diabetes, PCOS & Hormonal Balance',
        experience: '9 Years Exp',
        rating: 4.95,
        feeOnline: 2000,
        feeClinic: 3000,
        location: 'F-7 Markaz, Islamabad',
        timings: 'Tue - Sun (11:00 AM - 6:00 PM)',
        slots: ['12:00 PM', '02:00 PM', '04:00 PM'],
    },
]

const DietitianListPage = () => {
    const { goal } = useParams()
    const navigate = useNavigate()

    const goalTitles = {
        'weight-management': 'Weight Management Experts',
        'clinical-nutrition': 'Clinical Nutrition Specialists',
        'sports-fitness': 'Sports & Fitness Nutritionists',
    }

    const handleSelectExpert = (expert) => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        } else {
            // Match with App.jsx route: /dietitian/book/:expertId
            navigate(`/dietitian/book/${expert.id}`, { state: { expert, goal } })
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full pb-20">
            {/* Fixed Back Button */}
            <button
                onClick={() => navigate('/dietitian')}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer"
            >
                ← Back to Goals
            </button>

            <div className="mb-8">
                <span className="bg-[#C8EADF] text-[#0D9488] font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                    Verified Specialists
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                    {goalTitles[goal] || 'Available Nutritionists'}
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Choose your preferred expert, check their timings, and select consultation mode.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {nutritionistsData.map((expert) => (
                    <div
                        key={expert.id}
                        className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
                                expert.gender === 'female' ? 'bg-rose-50 border-rose-100' : 'bg-teal-50 border-teal-100'
                            }`}>
                                {expert.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-[#0F172A] text-lg">{expert.name}</h3>
                                    <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                        ★ {expert.rating}
                                    </span>
                                </div>
                                <p className="text-[#0D9488] text-xs font-semibold mt-0.5">{expert.specialty}</p>
                                <p className="text-slate-400 text-[11px] mt-1">{expert.experience} • 📍 {expert.location}</p>

                                {/* Timings and Slots Info */}
                                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-[11px] text-slate-600 space-y-1">
                                    <p>🕒 <strong className="text-slate-700">Available Days/Time:</strong> {expert.timings}</p>
                                    <p>⚡ <strong className="text-slate-700">Next Open Slots:</strong> {expert.slots.join(', ')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
                            <div className="text-left md:text-right">
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Consultation Fee</p>
                                <p className="text-[#0D9488] font-black text-sm">Online: PKR {expert.feeOnline}</p>
                                <p className="text-slate-600 font-bold text-xs">Clinic: PKR {expert.feeClinic}</p>
                            </div>
                            <button
                                onClick={() => handleSelectExpert(expert)}
                                className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer transition-all"
                            >
                                Book Consultation →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DietitianListPage