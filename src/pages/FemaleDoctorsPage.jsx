import { useNavigate } from 'react-router-dom'

const femaleDoctors = [
    { id: 1, name: 'Dr. Aisha Malik', specialty: 'General Physician', location: 'Gulberg, Lahore', rating: 4.9, fee: 500, experience: '6 Years' },
    { id: 2, name: 'Dr. Sana Tariq', specialty: 'General Practitioner', location: 'Clifton, Karachi', rating: 4.8, fee: 600, experience: '8 Years' },
    { id: 3, name: 'Dr. Nadia Ali', specialty: 'Family Physician', location: 'Blue Area, Islamabad', rating: 4.7, fee: 550, experience: '5 Years' },
    { id: 4, name: 'Dr. Fatima Noor', specialty: 'Internal Medicine', location: 'Saddar, Rawalpindi', rating: 4.9, fee: 700, experience: '10 Years' },
]

const FemaleDoctorPage = () => {
    const navigate = useNavigate()

    const handleBooking = (doctor) => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        } else {
            navigate('/book/general', { state: { doctor } })
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
            <button
                onClick={() => navigate('/doctor')}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer"
            >
                ← Back to Doctor Categories
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="bg-[#FCD2DC] text-[#E11D48] font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                        Female Specialists
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                        Available Female Doctors
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {femaleDoctors.map((doc) => (
                    <div key={doc.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                        <div>
                            <div className="flex items-start gap-3.5 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl shrink-0">
                                    👩‍⚕️
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-[#0F172A] text-base truncate">{doc.name}</h3>
                                    <p className="text-slate-500 text-xs">{doc.specialty}</p>
                                    <div className="flex items-center gap-1 my-1">
                                        <span className="text-amber-400 text-xs">★</span>
                                        <span className="text-xs font-semibold text-slate-600">{doc.rating}</span>
                                        <span className="text-slate-300 text-xs">• {doc.experience}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">📍 {doc.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Consultation Fee</p>
                                <p className="text-[#0D9488] font-black text-base">PKR {doc.fee}</p>
                            </div>
                            <button
                                onClick={() => handleBooking(doc)}
                                className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md cursor-pointer transition-all"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FemaleDoctorPage