import { useNavigate } from 'react-router-dom'

const maleDoctors = [
    { name: 'Dr. Ahmed Raza', specialty: 'General Physician', location: 'Lahore', rating: 4.9, fee: 500, exp: '7 years', available: true },
    { name: 'Dr. Usman Shah', specialty: 'General Practitioner', location: 'Karachi', rating: 4.7, fee: 400, exp: '5 years', available: true },
    { name: 'Dr. Bilal Khan', specialty: 'Family Medicine', location: 'Islamabad', rating: 4.8, fee: 600, exp: '10 years', available: false },
    { name: 'Dr. Farhan Ali', specialty: 'General Physician', location: 'Rawalpindi', rating: 4.6, fee: 450, exp: '6 years', available: true },
    { name: 'Dr. Tariq Mehmood', specialty: 'Internal Medicine', location: 'Multan', rating: 4.7, fee: 550, exp: '8 years', available: true },
    { name: 'Dr. Imran Siddiqui', specialty: 'General Practitioner', location: 'Faisalabad', rating: 4.5, fee: 350, exp: '4 years', available: false },
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

const MaleDoctorsPage = () => {
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
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span>›</span>
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/doctor')}>Doctor</span>
                <span>›</span>
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/doctor/home')}>Home Doctor</span>
                <span>›</span>
                <span className="text-blue-600 font-medium">Male Doctors</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] flex items-center gap-2">
                        <span>👨‍⚕️</span> Male Home Doctors
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Verified male doctors available for home visits</p>
                </div>
                <button
                    onClick={() => navigate('/doctor/home/female')}
                    className="border border-[#F43F5E] text-[#F43F5E] hover:bg-[#F43F5E] hover:text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm w-full sm:w-auto text-center"
                >
                    Switch to Female Doctors →
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {maleDoctors.map((doc, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200 flex items-center justify-center text-3xl shrink-0">
                                    👨‍⚕️
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-1">
                                        <h3 className="font-bold text-[#0F172A] text-base truncate">{doc.name}</h3>
                                        {doc.available
                                            ? <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">Available</span>
                                            : <span className="text-[10px] bg-slate-100 text-slate-400 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">Busy</span>
                                        }
                                    </div>
                                    <p className="text-slate-500 text-xs mt-0.5">{doc.specialty}</p>
                                    <StarRating rating={doc.rating} />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl font-medium">
                                <span>📍 {doc.location}</span>
                                <span>•</span>
                                <span>💼 {doc.exp}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Visit Fee</p>
                                <p className="text-[#0D9488] font-black text-base">PKR {doc.fee}</p>
                            </div>
                            <button
                                disabled={!doc.available}
                                onClick={handleBookingClick}
                                className={`font-bold px-5 py-2.5 rounded-xl text-sm transition-all ${doc.available
                                        ? 'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-md hover:shadow-[0_4px_12px_rgba(13,148,136,0.3)]'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {doc.available ? 'Book Visit' : 'Unavailable'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MaleDoctorsPage