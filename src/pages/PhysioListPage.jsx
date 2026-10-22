import { useNavigate, useParams } from 'react-router-dom'

const allPhysios = [
    { id: 1, name: 'Dr. Hamza Ahmed (PT)', category: 'sports', gender: 'male', experience: '6 Years', rating: 4.8, feePerSession: 1500, location: 'Lahore' },
    { id: 2, name: 'Dr. Fatima Noor (PT)', category: 'general', gender: 'female', experience: '5 Years', rating: 4.9, feePerSession: 1200, location: 'Karachi' },
    { id: 3, name: 'Dr. Usman Ali (PT)', category: 'sports', gender: 'male', experience: '8 Years', rating: 4.7, feePerSession: 1800, location: 'Islamabad' },
    { id: 4, name: 'Dr. Ayesha Malik (PT)', category: 'general', gender: 'female', experience: '4 Years', rating: 4.8, feePerSession: 1300, location: 'Rawalpindi' },
    { id: 5, name: 'Dr. Bilawal Khan (PT)', category: 'general', gender: 'male', experience: '7 Years', rating: 4.6, feePerSession: 1400, location: 'Lahore' },
    { id: 6, name: 'Dr. Sana Tariq (PT)', category: 'sports', gender: 'female', experience: '5 Years', rating: 4.9, feePerSession: 1600, location: 'Karachi' },
]

const PhysioListPage = () => {
    const { category, gender } = useParams()
    const navigate = useNavigate()

    const filtered = allPhysios.filter(
        (p) => p.category === category && p.gender === gender
    )

    const categoryTitle = category === 'sports' ? 'Sports Injury' : 'General Physio'

    const handleBook = (physio) => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        } else {
            navigate('/book/physiotherapy', { state: { physio } })
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
            <button
                onClick={() => navigate(`/physiotherapist/${category}`)}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer"
            >
                ← Back to Gender Selection
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#0F172A] capitalize">
                        Available {gender} Specialists
                    </h1>
                    <p className="text-slate-500 text-xs mt-1">
                        Service: <strong className="text-[#0D9488]">{categoryTitle}</strong>
                    </p>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
                    <p className="text-slate-400 text-sm">No practitioners available in this category right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((p) => (
                        <div key={p.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div>
                                <div className="flex items-start gap-3.5 mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl shrink-0">
                                        {p.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-[#0F172A] text-base truncate">{p.name}</h3>
                                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-teal-50 text-[#0D9488] font-bold text-[10px] rounded-md capitalize">
                                            {categoryTitle}
                                        </span>
                                        <p className="text-slate-400 text-xs mt-1">📍 {p.location} • {p.experience} Exp</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Per Session</p>
                                    <p className="text-[#0D9488] font-black text-base">PKR {p.feePerSession}</p>
                                </div>
                                <button
                                    onClick={() => handleBook(p)}
                                    className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md cursor-pointer"
                                >
                                    Book Session
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PhysioListPage