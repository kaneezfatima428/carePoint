import { useNavigate, useParams } from 'react-router-dom'

const nursesData = [
    // Male Home Nurses
    {
        id: 'mn-home-1',
        name: 'Nurse Muhammad Usman',
        gender: 'male',
        category: 'home',
        title: 'Senior Registered Nurse (BSN, RN)',
        qualification: 'BSc Nursing (Generic) • PNC Registered',
        experience: '7 Years Exp',
        rating: 4.9,
        reviewsCount: 142,
        location: 'Lahore (Gulberg, DHA & Johar Town)',
        feeVisit: 1500,
        feeShift: 2800,
        available: true,
        skills: ['IV Cannulation & Injections', 'Post-Op Wound Dressing', 'Catheterization', 'Elderly Care', 'Vitals Monitoring'],
        bio: 'Over 7 years of specialized clinical nursing experience at Services Hospital and private home care. Expert in sterile wound dressing, IV infusion line management, Foley catheterization, post-surgical rehabilitation, and elderly patient bedside monitoring.',
        availabilityNotice: 'Available today • Arrives within 45 mins',
    },
    {
        id: 'mn-home-2',
        name: 'Nurse Bilal Ahmed',
        gender: 'male',
        category: 'home',
        title: 'Post-Surgical & Recovery Nurse',
        qualification: 'Post-RN BSN • PNC Licensed #78421',
        experience: '6 Years Exp',
        rating: 4.8,
        reviewsCount: 98,
        location: 'Karachi (Clifton, PECHS & Gulshan)',
        feeVisit: 1400,
        feeShift: 2600,
        available: true,
        skills: ['Surgical Wound Dressing', 'Ryles Tube & Feeding', 'Medication Administration', 'Bed Sore Management', 'Mobility Support'],
        bio: 'Skilled male nurse with extensive experience in surgical wards and home care setups. Specialized in diabetic wound care, aseptic bed sore dressing, Ryles tube feeding, and helping bedridden male patients recover safely with dignity.',
        availabilityNotice: 'Available today • Arrives within 40 mins',
    },
    {
        id: 'mn-home-3',
        name: 'Nurse Farhan Tariq',
        gender: 'male',
        category: 'home',
        title: 'Critical Care & Geriatric Nurse',
        qualification: 'Diploma in General Nursing & Midwifery (PNC)',
        experience: '9 Years Exp',
        rating: 4.9,
        reviewsCount: 184,
        location: 'Islamabad / Rawalpindi',
        feeVisit: 1600,
        feeShift: 3000,
        available: true,
        skills: ['Geriatric Bedside Nursing', 'Tracheostomy Care', 'Oxygen Therapy', 'IV Infusion', 'Dextrose & Antibiotic Administration'],
        bio: 'Senior nurse with 9 years of dedicated medical experience across Shifa International and home healthcare. Certified in tracheostomy tube management, oxygen concentrator handling, nebulization, and complex geriatric patient assistance.',
        availabilityNotice: 'Available today • Arrives within 35 mins',
    },
    {
        id: 'mn-home-4',
        name: 'Nurse Hamza Malik',
        gender: 'male',
        category: 'home',
        title: 'General Home Healthcare Nurse',
        qualification: 'BSN (Hons) • Registered Nurse',
        experience: '5 Years Exp',
        rating: 4.7,
        reviewsCount: 76,
        location: 'Faisalabad / Multan',
        feeVisit: 1200,
        feeShift: 2400,
        available: false,
        skills: ['Blood Sampling', 'Daily Vitals Tracking', 'Insulin Administration', 'Routine Injections', 'Basic Wound Care'],
        bio: 'Patient and attentive nurse specializing in home wellness checks, regular insulin injection routines, glucose monitoring, blood pressure tracking, and routine medical dressing in home comfort.',
        availabilityNotice: 'Currently on duty with patient • Next available tomorrow',
    },

    // Male Emergency Nurses
    {
        id: 'mn-emg-1',
        name: 'Nurse Tariq Mehmood',
        gender: 'male',
        category: 'emergency',
        title: 'Emergency Trauma & ICU Nurse',
        qualification: 'BSN • Certified Trauma Care Nurse (PNC)',
        experience: '8 Years Exp',
        rating: 5.0,
        reviewsCount: 164,
        location: 'Lahore (Fast Dispatch Radius)',
        feeVisit: 2000,
        feeShift: 3500,
        available: true,
        skills: ['Emergency Trauma Dressing', 'Rapid IV Cannulation', 'CPR & Resuscitation', 'Oxygen Titration', 'Emergency Injections'],
        bio: 'Extensive emergency ward and ICU background at Mayo Hospital Emergency. Expert in high-pressure situations, acute bleeding management, rapid vascular access, anaphylaxis response, and emergency stabilizing care.',
        availabilityNotice: '⚡ 24/7 Rapid Emergency Dispatch (15–25 mins)',
    },
    {
        id: 'mn-emg-2',
        name: 'Nurse Kamran Ali',
        gender: 'male',
        category: 'emergency',
        title: 'Critical Care & Resuscitation Specialist',
        qualification: 'Post-RN Critical Care • PNC Registered',
        experience: '10 Years Exp',
        rating: 4.9,
        reviewsCount: 210,
        location: 'Karachi (Central & South)',
        feeVisit: 2200,
        feeShift: 3800,
        available: true,
        skills: ['Cardiac Bedside Monitoring', 'Ventilator / BiPAP Assistance', 'Defibrillator Support', 'Urgent IV Medication', 'Trauma Stabilization'],
        bio: 'Over a decade of high-acuity intensive care nursing. Ready with emergency triage medical kit for immediate dispatch to attend critical patients requiring urgent vital stabilization and doctor support.',
        availabilityNotice: '⚡ 24/7 Rapid Emergency Dispatch (20–30 mins)',
    },
    {
        id: 'mn-emg-3',
        name: 'Nurse Asadullah Khan',
        gender: 'male',
        category: 'emergency',
        title: 'Emergency Bedside Care Nurse',
        qualification: 'BSN (Generic) • BLS & ACLS Certified',
        experience: '6 Years Exp',
        rating: 4.8,
        reviewsCount: 89,
        location: 'Islamabad / Rawalpindi',
        feeVisit: 1800,
        feeShift: 3200,
        available: true,
        skills: ['Immediate Wound Closure & Dressing', 'Oxygen Administration', 'Stat Injections', 'Shock Management', 'Bedside Vitals'],
        bio: 'Certified in Basic Life Support (BLS) and Advanced Cardiac Life Support (ACLS). Dispatches immediately with emergency medical kit, sterile wound gear, and vitals monitoring equipment.',
        availabilityNotice: '⚡ 24/7 Rapid Emergency Dispatch (20 mins)',
    },

    // Female Home Nurses
    {
        id: 'fn-home-1',
        name: 'Nurse Fatima Noor',
        gender: 'female',
        category: 'home',
        title: 'Senior Home Care Specialist (BSN, RN)',
        qualification: 'BSN (Generic) • PNC Registered Nurse #62145',
        experience: '7 Years Exp',
        rating: 4.9,
        reviewsCount: 178,
        location: 'Lahore (Gulberg, Model Town, DHA)',
        feeVisit: 1500,
        feeShift: 2800,
        available: true,
        skills: ['Mother & Baby Care', 'Post-C-Section Dressing', 'IV Drip Therapy', 'Elderly Female Care', 'Medication Management'],
        bio: 'Warm, experienced female registered nurse with 7 years of hospital and private duty experience. Specializes in post-operative recovery, gentle C-section incision care, geriatric bedside support, and IV cannula maintenance.',
        availabilityNotice: 'Available today • Arrives within 40 mins',
    },
    {
        id: 'fn-home-2',
        name: 'Nurse Ayesha Malik',
        gender: 'female',
        category: 'home',
        title: 'Certified Nursing & Midwifery Specialist',
        qualification: 'Diploma in General Nursing & Midwifery (PNC)',
        experience: '8 Years Exp',
        rating: 4.9,
        reviewsCount: 135,
        location: 'Karachi (Clifton, DHA & Gulshan)',
        feeVisit: 1600,
        feeShift: 3000,
        available: true,
        skills: ['Maternal Postpartum Care', 'Newborn Bedside Care', 'Injections & Vitals', 'Wound Care', 'Catheterization'],
        bio: 'Trusted female nurse certified by Pakistan Nursing Council. Dedicated to helping female patients, new mothers, and elderly ladies maintain optimal health and recover comfortably at home.',
        availabilityNotice: 'Available today • Arrives within 45 mins',
    },
    {
        id: 'fn-home-3',
        name: 'Nurse Maryam Bibi',
        gender: 'female',
        category: 'home',
        title: 'Geriatric & Palliative Home Nurse',
        qualification: 'BSN (Generic) • PNC Verified',
        experience: '6 Years Exp',
        rating: 4.8,
        reviewsCount: 112,
        location: 'Islamabad / Rawalpindi',
        feeVisit: 1400,
        feeShift: 2600,
        available: true,
        skills: ['Elderly Dementia Care', 'Bed Sore Prevention & Dressing', 'Ryles Tube Feeding', 'Vital Signs Tracking', 'Comfort Care'],
        bio: 'Gentle, compassionate bedside nurse with specialized skills in palliative care, bed-bound patient hygiene, prevention and management of bed sores, and compassionate elderly companionship.',
        availabilityNotice: 'Available today • Arrives within 35 mins',
    },
    {
        id: 'fn-home-4',
        name: 'Nurse Zainab Khan',
        gender: 'female',
        category: 'home',
        title: 'General Healthcare & Injection Nurse',
        qualification: 'Post-RN BSN • Registered Nurse',
        experience: '5 Years Exp',
        rating: 4.7,
        reviewsCount: 82,
        location: 'Multan / Faisalabad',
        feeVisit: 1300,
        feeShift: 2400,
        available: false,
        skills: ['IV Cannulation', 'Intramuscular Injections', 'Diabetic Insulin Therapy', 'Routine Dressing'],
        bio: 'Reliable healthcare provider trained in administering prescribed injections, drips, and monitoring post-op recovery in home setups.',
        availabilityNotice: 'Currently booked for evening shift • Next available tomorrow',
    },

    // Female Emergency Nurses
    {
        id: 'fn-emg-1',
        name: 'Nurse Zainab Siddiqui',
        gender: 'female',
        category: 'emergency',
        title: 'Emergency & Critical Care Specialist',
        qualification: 'BSN (Hons) • Emergency Nursing Certified (PNC)',
        experience: '9 Years Exp',
        rating: 5.0,
        reviewsCount: 195,
        location: 'Lahore (Rapid Dispatch)',
        feeVisit: 2000,
        feeShift: 3600,
        available: true,
        skills: ['Acute Trauma Stabilization', 'Emergency Cannula & IV Infusion', 'Oxygen Saturation Support', 'CPR & Defibrillation', 'Urgent Dressing'],
        bio: 'Senior emergency nurse with nearly a decade of high-volume trauma centre experience. Rapidly handles acute asthma, acute fevers, sudden dehydration, emergency cannulation, and critical bedside management.',
        availabilityNotice: '⚡ 24/7 Rapid Emergency Dispatch (15–20 mins)',
    },
    {
        id: 'fn-emg-2',
        name: 'Nurse Hina Riaz',
        gender: 'female',
        category: 'emergency',
        title: 'ICU & Resuscitation Nurse',
        qualification: 'Post-RN Critical Care • BLS Certified',
        experience: '8 Years Exp',
        rating: 4.9,
        reviewsCount: 140,
        location: 'Karachi (Central & South)',
        feeVisit: 2100,
        feeShift: 3700,
        available: true,
        skills: ['ICU Bedside Care', 'Emergency Medication Administration', 'Vitals Stabilization', 'Oxygen Setup', 'Burn & Trauma Dressing'],
        bio: 'Specialized in intensive care bedside resuscitation and emergency triage. Fast response to domestic medical emergencies with complete emergency nursing bag and monitoring tools.',
        availabilityNotice: '⚡ 24/7 Rapid Emergency Dispatch (20–25 mins)',
    },
    {
        id: 'fn-emg-3',
        name: 'Nurse Samina Kausar',
        gender: 'female',
        category: 'emergency',
        title: 'Emergency Response Nurse',
        qualification: 'Diploma in General Nursing & Midwifery (PNC)',
        experience: '7 Years Exp',
        rating: 4.8,
        reviewsCount: 104,
        location: 'Islamabad / Rawalpindi',
        feeVisit: 1800,
        feeShift: 3300,
        available: true,
        skills: ['Stat Injections', 'Rapid Wound Dressing', 'Oxygen Supply Management', 'Emergency Vitals Check', 'Post-Collapse Stabilization'],
        bio: 'Dedicated emergency bedside responder trained for rapid intervention, immediate cannula placement, doctor remote assistance, and critical bedside monitoring.',
        availabilityNotice: '⚡ 24/7 Rapid Emergency Dispatch (25 mins)',
    },
]

const StarRating = ({ rating, count }) => (
    <div className="flex items-center gap-1.5 my-1">
        <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
        <span className="text-xs font-bold text-slate-700">{rating}</span>
        {count && <span className="text-[11px] text-slate-400">({count} reviews)</span>}
    </div>
)

const NurseListPage = () => {
    const { category, gender } = useParams() // category: 'home' | 'emergency', gender: 'male' | 'female'
    const navigate = useNavigate()

    const isMale = gender === 'male'
    const isEmergency = category === 'emergency'
    const categoryTitle = isEmergency ? 'Emergency Nurses' : 'Home Nurses'
    const genderTitle = isMale ? 'Male Nurses' : 'Female Nurses'

    // Filter nurses
    const nurses = nursesData.filter(
        (n) => n.category === category && n.gender === gender
    )

    const handleBookingClick = (nurse) => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        } else {
            navigate('/book/nurse', { state: { nurse } })
        }
    }

    const oppositeGender = isMale ? 'female' : 'male'
    const oppositeLabel = isMale ? 'Switch to Female Nurses →' : 'Switch to Male Nurses →'

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span>›</span>
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/nurse')}>Nurse Care</span>
                <span>›</span>
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate(`/nurse/${category}`)}>{categoryTitle}</span>
                <span>›</span>
                <span className={isMale ? 'text-blue-600 font-medium' : 'text-[#F43F5E] font-medium'}>{genderTitle}</span>
            </nav>

            {/* Back button */}
            <button
                onClick={() => navigate(`/nurse/${category}`)}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer transition-colors"
            >
                ← Back to Gender Selection
            </button>

            {/* Header + Switch Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-2xl">{isMale ? '👨‍⚕️' : '👩‍⚕️'}</span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                            Available {genderTitle} ({categoryTitle})
                        </h1>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm">
                        Verified &amp; PNC-registered {gender} nurses available for {isEmergency ? 'immediate emergency response' : 'home healthcare'}
                    </p>
                </div>

                {/* Switch Gender Button */}
                <button
                    onClick={() => navigate(`/nurse/${category}/${oppositeGender}`)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm w-full sm:w-auto text-center cursor-pointer border ${
                        isMale
                            ? 'border-[#F43F5E] text-[#F43F5E] hover:bg-[#F43F5E] hover:text-white'
                            : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                >
                    {oppositeLabel}
                </button>
            </div>

            {/* Nurse List Cards with Full Bio Data */}
            {nurses.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
                    <p className="text-slate-400 text-sm">No nurses found for this selection right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {nurses.map((nurse) => (
                        <div
                            key={nurse.id}
                            className={`bg-white rounded-3xl border shadow-sm hover:shadow-lg transition-all p-6 sm:p-7 flex flex-col justify-between ${
                                isEmergency && nurse.available ? 'border-rose-200' : 'border-slate-100'
                            }`}
                        >
                            <div>
                                {/* Top Header: Avatar + Name + Status */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0 border ${
                                        nurse.gender === 'female' 
                                            ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                            : 'bg-blue-50 border-blue-200 text-blue-600'
                                    }`}>
                                        {nurse.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h2 className="font-extrabold text-[#0F172A] text-lg sm:text-xl truncate">
                                                {nurse.name}
                                            </h2>
                                            {nurse.available ? (
                                                <span className="text-[10px] sm:text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Available
                                                </span>
                                            ) : (
                                                <span className="text-[10px] sm:text-[11px] bg-slate-100 text-slate-400 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">
                                                    On Duty
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs font-semibold text-[#0D9488] mt-0.5">{nurse.title}</p>
                                        <p className="text-[11px] text-slate-500 font-medium">{nurse.qualification}</p>

                                        {/* Ratings and Experience */}
                                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                            <StarRating rating={nurse.rating} count={nurse.reviewsCount} />
                                            <span className="text-slate-300">•</span>
                                            <span className="text-xs font-semibold text-slate-600">💼 {nurse.experience}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Availability alert */}
                                <div className="bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 mb-4 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                                    <span className="flex items-center gap-1">📍 <strong>{nurse.location}</strong></span>
                                    <span className="text-[#0D9488] font-semibold text-[11px]">{nurse.availabilityNotice}</span>
                                </div>

                                {/* Nurse Bio Data Card Section */}
                                <div className="bg-teal-50/40 border border-teal-100/70 rounded-2xl p-4 mb-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D9488] uppercase tracking-wider mb-2">
                                        <span>📋</span> Nurse Bio Data &amp; Clinical Background
                                    </div>
                                    <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed mb-3">
                                        {nurse.bio}
                                    </p>

                                    {/* Clinical Skills Tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {nurse.skills.map((skill, sIdx) => (
                                            <span
                                                key={sIdx}
                                                className="bg-white border border-teal-200/80 text-[#0D9488] text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
                                            >
                                                ✓ {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Fees & Booking Button (Like Doctor Field) */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-2 flex-wrap">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Charges</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[#0D9488] font-black text-lg sm:text-xl">PKR {nurse.feeVisit}</span>
                                        <span className="text-[11px] text-slate-400 font-medium">/ Visit</span>
                                        <span className="text-slate-300 text-xs">|</span>
                                        <span className="text-xs font-bold text-slate-600">PKR {nurse.feeShift}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">/ Shift</span>
                                    </div>
                                </div>

                                <button
                                    disabled={!nurse.available}
                                    onClick={() => handleBookingClick(nurse)}
                                    className={`font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer ml-auto ${
                                        nurse.available
                                            ? isEmergency
                                                ? 'bg-[#F43F5E] hover:bg-[#E11D48] text-white shadow-rose-200 hover:shadow-lg'
                                                : 'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-teal-200 hover:shadow-lg'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                    }`}
                                >
                                    {nurse.available ? (isEmergency ? '🚨 Book Emergency Nurse' : 'Book Nurse Now') : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Support Callout */}
            <div className="mt-12 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-3xl shrink-0">
                        📞
                    </div>
                    <div>
                        <h3 className="font-extrabold text-[#0F172A] text-base sm:text-lg">Need Immediate Assistance with Nursing Booking?</h3>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Our medical support team is available 24/7 to assign the best verified nurse near you.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="tel:051111222"
                        className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-sm text-center whitespace-nowrap"
                    >
                        📞 Call 051-111-222
                    </a>
                </div>
            </div>
        </div>
    )
}

export default NurseListPage
