import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const services = [
    {
        id: 'doctor',
        icon: '🩺',
        title: 'Doctor',
        desc: 'Home, Emergency & General',
        route: '/doctor',
        badge: 'Available Now',
        color: 'from-teal-500/10 to-teal-600/5',
        borderColor: 'border-[#0D9488]/20',
    },
    {
        id: 'physio',
        icon: '🏃',
        title: 'Physiotherapist',
        desc: 'General & Sports Therapy',
        route: '/physiotherapist',
        badge: 'Available Now',
        color: 'from-blue-500/10 to-blue-600/5',
        borderColor: 'border-blue-400/20',
    },
    {
    id: 'dietitian',
    icon: '🥗',
    title: 'Dietitian & Nutritionist',
    desc: 'Personalized diet plans',
    route: '/dietitian', // <-- Updated route
    badge: 'Available Now',
    color: 'from-green-500/10 to-green-600/5',
    borderColor: 'border-green-400/20',
    },
    {
    id: 'lab',
    icon: '🔬',
    title: 'Diagnostic Lab Test',
    desc: 'Blood & diagnostic tests',
    route: '/lab-tests', // <-- Updated route
    badge: 'Available Now',
    color: 'from-purple-500/10 to-purple-600/5',
    borderColor: 'border-purple-400/20',
},
    {
        id: 'hospital',
        icon: '🏥',
        title: 'Hospital Appointment',
        desc: 'OPD & specialist booking',
        route: '/',
        badge: 'Available Now',
        color: 'from-orange-500/10 to-orange-600/5',
        borderColor: 'border-orange-400/20',
    },
    {
        id: 'ultrasound',
        icon: '🔊',
        title: 'Ultrasound Appointment',
        desc: 'Day & Night shift scans',
        route: '/ultrasound', // Updated to shift selection page
        badge: '24/7 Available',
        color: 'from-cyan-500/10 to-cyan-600/5',
        borderColor: 'border-cyan-400/20',
    },
    {
        id: 'pharmacy',
        icon: '💊',
        title: 'Online Pharmacy',
        desc: 'Medicines delivered home',
        route: '/',
        badge: 'Available Now',
        color: 'from-rose-500/10 to-rose-600/5',
        borderColor: 'border-rose-400/20',
    },
]

const sampleDoctors = [
    { name: 'Dr. Aisha Malik', specialty: 'General Physician', location: 'Lahore', rating: 4.9, fee: 500, gender: 'female', type: 'home' },
    { name: 'Dr. Ahmed Raza', specialty: 'General Practitioner', location: 'Karachi', rating: 4.7, fee: 400, gender: 'male', type: 'general' },
    { name: 'Dr. Sana Tariq', specialty: 'Emergency Specialist', location: 'Islamabad', rating: 4.8, fee: 700, gender: 'female', type: 'emergency' },
    { name: 'Dr. Usman Shah', specialty: 'Home Visit Doctor', location: 'Rawalpindi', rating: 4.6, fee: 600, gender: 'male', type: 'home' },
    { name: 'Dr. Nadia Ali', specialty: 'General Physician', location: 'Lahore', rating: 4.9, fee: 450, gender: 'female', type: 'home' },
    { name: 'Dr. Bilal Khan', specialty: 'General Practitioner', location: 'Multan', rating: 4.5, fee: 350, gender: 'male', type: 'general' },
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

const HomePage = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        const query = searchQuery.toLowerCase().trim()
        if (query.includes('doctor') || query.includes('dr')) {
            navigate('/doctor')
        } else if (query.includes('physio') || query.includes('therapy')) {
            navigate('/physiotherapist')
        } else if (query.includes('ultra') || query.includes('scan')) {
            navigate('/ultrasound')
        } else {
            navigate('/not-found')
        }
    }

    const handleBookingClick = () => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        } else {
            navigate('/book/general')
        }
    }

    return (
        <div className="w-full overflow-x-hidden pb-16">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white relative overflow-hidden py-12 sm:py-20">
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#0D9488]/20 border border-[#0D9488]/40 text-[#14B8A6] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-6">
                        📍 Pakistan — Serving Nationwide
                    </div>

                    <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug mb-4">
                        INSTANT AT-HOME <span className="text-[#0D9488]">DOCTORS</span> &amp; <span className="text-[#F43F5E]">PRE-BOOKED</span> HOSPITAL APPOINTMENTS
                    </h1>

                    <p className="text-slate-300 text-xs sm:text-base mb-8 max-w-2xl mx-auto">
                        Connect with verified doctors and healthcare professionals — anytime, anywhere across Pakistan.
                    </p>

                    <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-2xl p-1.5 sm:p-2 shadow-2xl max-w-3xl mx-auto w-full">
                        <div className="flex-1 flex items-center gap-2 px-2 sm:px-3 min-w-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Doctors, Physiotherapists, Ultrasounds..."
                                className="w-full text-slate-700 outline-none text-xs sm:text-sm py-1.5 bg-transparent"
                            />
                        </div>
                        <button type="submit" className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all text-xs sm:text-sm shrink-0 cursor-pointer">
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Services Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1">Our Services</h2>
                    <p className="text-slate-500 text-xs sm:text-base">Everything you need for your health, all in one place</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {services.map((svc) => (
                        <div
                            key={svc.id}
                            onClick={() => navigate(svc.route)}
                            className={`relative bg-gradient-to-br ${svc.color} border ${svc.borderColor} rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 cursor-pointer hover:shadow-lg transition-all bg-white flex flex-col justify-between`}
                        >
                            <div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 mb-3">
                                    <div className="text-2xl sm:text-4xl">{svc.icon}</div>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-[#0D9488] bg-[#0D9488]/10 border border-[#0D9488]/20 px-2 py-0.5 rounded-full self-start sm:self-auto max-w-full truncate">
                                        {svc.badge}
                                    </span>
                                </div>
                                <h3 className="font-bold text-[#0F172A] text-xs sm:text-base leading-snug mb-1">{svc.title}</h3>
                                <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed">{svc.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Doctors Near You Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-3xl font-bold text-[#0F172A]">Doctors Near You</h2>
                    <button
                        onClick={() => navigate('/doctor')}
                        className="text-[#0D9488] hover:text-[#0F766E] font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
                    >
                        View All <span>→</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {sampleDoctors.map((doc, i) => (
                        <div key={i} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 flex flex-col justify-between">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-2xl sm:text-3xl">
                                    {doc.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[#0F172A] text-sm sm:text-base truncate">{doc.name}</h3>
                                    <p className="text-slate-500 text-xs">{doc.specialty}</p>
                                    <StarRating rating={doc.rating} />
                                    <p className="text-[11px] text-slate-400">📍 {doc.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div>
                                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Fee</span>
                                    <p className="text-[#0D9488] font-black text-sm sm:text-base">PKR {doc.fee}</p>
                                </div>
                                <button
                                    onClick={handleBookingClick}
                                    className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md cursor-pointer"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default HomePage