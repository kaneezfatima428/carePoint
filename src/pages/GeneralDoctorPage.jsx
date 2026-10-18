import { useNavigate } from 'react-router-dom'

const generalDoctors = [
    { name: 'Dr. Ahmed Raza', specialty: 'General Practitioner', location: 'Lahore', rating: 4.9, fee: 500, exp: '7 years', slots: ['10:00 AM', '12:00 PM', '3:00 PM'] },
    { name: 'Dr. Bilal Khan', specialty: 'General Physician', location: 'Karachi', rating: 4.7, fee: 400, exp: '5 years', slots: ['9:00 AM', '11:00 AM'] },
    { name: 'Dr. Farhan Ali', specialty: 'GP / Family Medicine', location: 'Islamabad', rating: 4.8, fee: 600, exp: '10 years', slots: ['2:00 PM', '4:00 PM', '6:00 PM'] },
    { name: 'Dr. Imran Siddiqui', specialty: 'General Practitioner', location: 'Rawalpindi', rating: 4.6, fee: 450, exp: '6 years', slots: ['10:30 AM', '1:30 PM'] },
]

const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1 my-1">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
        <span className="text-xs font-medium text-slate-500 ml-1">{rating}</span>
    </div>
)

const GeneralDoctorPage = () => {
    const navigate = useNavigate()
const handleBookingClick = () => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login') // Agar login nahi hai toh login page par redirect karega
        } else {
            navigate('/book/general') // Agar login hai toh booking page par jane dega
        }
    }
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span>›</span>
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/doctor')}>Doctor</span>
                <span>›</span>
                <span className="text-[#0F172A] font-medium">General Doctor</span>
            </nav>

            <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-[#0F172A]/5 border border-[#0F172A]/20 text-[#0F172A] px-4 py-1.5 rounded-full text-sm font-medium mb-3 shadow-sm">
                    🩺 General Doctor / GP
                </div>
                <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">General Doctors</h1>
                <p className="text-slate-500 text-sm sm:text-base">Schedule an appointment with experienced General Physicians and GPs</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {generalDoctors.map((doc, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F172A]/10 to-[#0D9488]/10 border border-[#0D9488]/20 flex items-center justify-center text-3xl shrink-0">
                                    👨‍⚕️
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[#0F172A] text-lg truncate">{doc.name}</h3>
                                    <p className="text-slate-500 text-xs mt-0.5">{doc.specialty}</p>
                                    <StarRating rating={doc.rating} />
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl font-medium flex-wrap">
                                        <span>📍 {doc.location}</span>
                                        <span>•</span>
                                        <span>💼 {doc.exp}</span>
                                        <span>•</span>
                                        <span className="text-[#0D9488] font-bold">PKR {doc.fee}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Available Slots */}
                            <div className="mb-6 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                                <p className="text-xs font-bold text-slate-600 mb-2.5 uppercase tracking-wider">Available Time Slots</p>
                                <div className="flex flex-wrap gap-2">
                                    {doc.slots.map((slot, j) => (
                                        <span key={j} className="bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-[#0D9488] hover:text-white transition-all shadow-sm">
                                            {slot}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleBookingClick}
                            className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold w-full py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-[0_4px_12px_rgba(15,23,42,0.3)]"
                        >
                            Schedule Appointment →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GeneralDoctorPage