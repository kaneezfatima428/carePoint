import { useState, useEffect } from 'react'
import { useNavigate, useLocation ,useParams  } from 'react-router-dom'

const DietitianBookingPage = () => {
    const navigate = useNavigate()
    const { goal, mode, expertId } = useParams()
    const location = useLocation()
    const expert = location.state?.expert

    const [confirmed, setConfirmed] = useState(false)
    const [consultationMode, setConsultationMode] = useState('online') // 'online' or 'clinic'
    const [selectedSlot, setSelectedSlot] = useState('11:00 AM')
    const [planDuration, setPlanDuration] = useState('1 Month Plan')

    const [form, setForm] = useState({
        patientName: '',
        phone: '',
        dietPreference: 'Desi / Pakistani Homemade',
        medicalNotes: '',
    })

    useEffect(() => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        }
    }, [navigate])

    const currentFee = consultationMode === 'online' ? expert.feeOnline : expert.feeClinic

    const handleSubmit = (e) => {
        e.preventDefault()
        if (form.patientName && form.phone) {
            setConfirmed(true)
        }
    }

    if (confirmed) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-8">
                    <div className="text-5xl mb-3">✅</div>
                    <h2 className="text-xl font-bold text-[#0F172A] mb-1">Diet Program Booked!</h2>
                    <p className="text-slate-500 text-xs mb-4">
                        Your consultation with <strong>{expert.name}</strong> is successfully scheduled.
                    </p>
                    <div className="bg-teal-50 border border-teal-100 p-3.5 rounded-xl mb-6 text-xs text-[#0D9488] font-semibold text-left space-y-1">
                        <p>👩‍⚕️ Expert: {expert.name}</p>
                        <p>💻 Mode: {consultationMode.toUpperCase()} Consultation</p>
                        <p>⏰ Time Slot: {selectedSlot}</p>
                        <p>🗓️ Duration: {planDuration}</p>
                        <p>💵 Fee: PKR {currentFee}</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#0D9488] text-white font-bold py-2.5 px-6 rounded-xl text-xs w-full shadow-md cursor-pointer"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 w-full">
           <button
    onClick={() => navigate(-1)} // 👈 Yeh browser ki history mein aik step peechay (previous page) le jayega
    className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer"
>
    ← Back
</button>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl shrink-0">
                        {expert.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[#0F172A]">{expert.name}</h1>
                        <p className="text-xs text-[#0D9488] font-semibold">{expert.specialty}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Mode Selection */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-2">Select Consultation Mode</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setConsultationMode('online')}
                                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                    consultationMode === 'online'
                                        ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                💻 Online Video (PKR {expert.feeOnline})
                            </button>
                            <button
                                type="button"
                                onClick={() => setConsultationMode('clinic')}
                                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                    consultationMode === 'clinic'
                                        ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                🏥 In-Clinic Visit (PKR {expert.feeClinic})
                            </button>
                        </div>
                    </div>

                    {/* Time Slot Selection */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-2">Select Available Time Slot</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'].map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                        selectedSlot === slot
                                            ? 'border-[#0D9488] bg-[#0D9488] text-white shadow-xs'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Patient Full Name *</label>
                            <input
                                type="text"
                                required
                                value={form.patientName}
                                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                                placeholder="Your Name"
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0D9488]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                required
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                placeholder="+92 300 0000000"
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0D9488]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-2">Plan Duration</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['1 Week Trial', '1 Month Plan', '3 Months Transform'].map((dur) => (
                                <button
                                    key={dur}
                                    type="button"
                                    onClick={() => setPlanDuration(dur)}
                                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                        planDuration === dur
                                            ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]'
                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {dur}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">Diet Preference</label>
                        <select
                            value={form.dietPreference}
                            onChange={(e) => setForm({ ...form, dietPreference: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0D9488] bg-white"
                        >
                            <option>Desi / Pakistani Homemade</option>
                            <option>Keto / Low Carb</option>
                            <option>Vegetarian</option>
                            <option>Gluten Free / Clean Eating</option>
                        </select>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between mt-6">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Total Fee</p>
                            <p className="text-lg font-black text-[#0D9488]">PKR {currentFee}</p>
                        </div>
                        <button
                            type="submit"
                            className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DietitianBookingPage