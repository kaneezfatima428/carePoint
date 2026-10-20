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
        desc: 'Rehabilitation & therapy',
        route: '/',
        badge: 'Available Now',
        color: 'from-blue-500/10 to-blue-600/5',
        borderColor: 'border-blue-400/20',
    },
    {
        id: 'dietitian',
        icon: '🥗',
        title: 'Dietitian & Nutritionist',
        desc: 'Personalized diet plans',
        route: '/',
        badge: 'Available Now',
        color: 'from-green-500/10 to-green-600/5',
        borderColor: 'border-green-400/20',
    },
    {
        id: 'lab',
        icon: '🔬',
        title: 'Diagnostic Lab Test',
        desc: 'Blood & diagnostic tests',
        route: '/',
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
        desc: 'Imaging & scan booking',
        route: '/',
        badge: 'Available Now',
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
    <div className="flex items-center justify-center gap-1 my-1">
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
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white relative overflow-hidden py-16 sm:py-20">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#0D9488] blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-[#F43F5E] blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#0D9488]/20 border border-[#0D9488]/40 text-[#14B8A6] px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-sm">
                        📍 Pakistan — Serving Nationwide
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug mb-6">
                        INSTANT AT-HOME <span className="text-[#0D9488]">DOCTORS</span> &amp; <span className="text-[#F43F5E]">PRE-BOOKED</span> HOSPITAL APPOINTMENTS
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
                        Connect with verified doctors and healthcare professionals — anytime, anywhere across Pakistan.
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-2xl max-w-3xl mx-auto w-full">
                        <div className="flex-1 flex items-center gap-2 px-3">
                            <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Doctors (e.g. Doctor, Dr)..."
                                className="w-full text-slate-700 outline-none text-sm py-2 bg-transparent"
                            />
                        </div>
                        <button type="submit" className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-md shrink-0">
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
            {/* Sample Doctor Listings */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-3xl font-bold text-[#0F172A]">Nearby Doctors</h2>
                    <button
                        onClick={() => navigate('/doctor')}
                        className="text-[#0D9488] hover:text-[#0F766E] font-bold text-sm flex items-center gap-1 transition-colors"
                    >
                        View All <span>→</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleDoctors.map((doc, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0D9488]/20 to-[#0F172A]/10 border border-[#0D9488]/20 flex items-center justify-center shrink-0 text-3xl">
                                        {doc.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-[#0F172A] text-base truncate">{doc.name}</h3>
                                        <p className="text-slate-500 text-xs mt-0.5">{doc.specialty}</p>
                                        <StarRating rating={doc.rating} />
                                        <p className="text-xs text-slate-400 mt-1 font-medium">📍 {doc.location}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Consultation Fee</span>
                                    <p className="text-[#0D9488] font-black text-base">PKR {doc.fee}</p>
                                </div>
                                <button
                                    onClick={handleBookingClick}
                                    className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md hover:shadow-[0_4px_12px_rgba(13,148,136,0.3)]"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Banner */}
            <section className="bg-gradient-to-r from-[#0D9488] to-[#0F766E] text-white py-12 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { num: '500+', label: 'Verified Doctors' },
                            { num: '50K+', label: 'Happy Patients' },
                            { num: '15+', label: 'Cities Covered' },
                            { num: '24/7', label: 'Emergency Support' },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <p className="text-3xl sm:text-4xl font-extrabold">{stat.num}</p>
                                <p className="text-teal-100 text-sm mt-1 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage