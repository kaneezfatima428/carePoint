import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const BookingPage = () => {
    const { type } = useParams()
    const navigate = useNavigate()
    const [selected, setSelected] = useState('home')
    const [confirmed, setConfirmed] = useState(false)

    const [form, setForm] = useState({
        patientName: '',
        phone: '',
        date: '',
        time: '',
        reason: '',
        location: '',
    })
useEffect(() => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login') // Agar login nahi, toh login page par bhej do
        }
    }, [navigate])
    const handleConfirm = () => {
        if (form.patientName && form.phone) setConfirmed(true)
    }

    if (confirmed) {
        return (
            <div className="max-w-lg mx-auto px-4 py-20 text-center w-full">
                <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Appointment Confirmed!</h2>
                    <p className="text-slate-500 mb-2">Your {type || 'doctor'} appointment has been booked.</p>
                    <p className="text-[#0D9488] font-semibold text-lg mb-6">Booking ID: CP-{Math.floor(100000 + Math.random() * 900000)}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-8 py-3 rounded-xl transition-all w-full shadow-md"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">Book Your Medical Appointment</h1>
                <p className="text-slate-500">Choose your preferred type of appointment</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Option 1 — At-Home Visit */}
                <div
                    onClick={() => setSelected('home')}
                    className={`border-2 rounded-3xl p-6 sm:p-8 cursor-pointer transition-all ${
                        selected === 'home'
                            ? 'border-[#0D9488] bg-[#0D9488]/5 shadow-lg shadow-[#0D9488]/10'
                            : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                    }`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === 'home' ? 'border-[#0D9488]' : 'border-slate-300'}`}>
                            {selected === 'home' && <div className="w-3 h-3 rounded-full bg-[#0D9488]" />}
                        </div>
                        <h3 className="font-bold text-[#0F172A] text-base sm:text-lg leading-snug">AT-HOME DOCTOR / EMERGENCY VISITS</h3>
                    </div>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Visit by <span className="font-semibold text-[#0F172A]">GENERAL DOCTOR / GP (GENERAL PRACTITIONER)</span> to your location.
                    </p>

                    <div className="space-y-4">
                        {[
                            { label: 'Date & Time', type: 'date', key: 'date', placeholder: '' },
                            { label: 'Reason for Visit', type: 'text', key: 'reason', placeholder: 'Brief description' },
                            { label: 'Your Location', type: 'text', key: 'location', placeholder: 'Your address' },
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="text-xs font-semibold text-slate-500 block mb-1.5">{f.label}</label>
                                <input
                                    type={f.type}
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Option 2 — Hospital OPD */}
                <div
                    onClick={() => setSelected('hospital')}
                    className={`border-2 rounded-3xl p-6 sm:p-8 cursor-pointer transition-all ${
                        selected === 'hospital'
                            ? 'border-[#0F172A] bg-[#0F172A]/5 shadow-lg'
                            : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                    }`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === 'hospital' ? 'border-[#0F172A]' : 'border-slate-300'}`}>
                            {selected === 'hospital' && <div className="w-3 h-3 rounded-full bg-[#0F172A]" />}
                        </div>
                        <h3 className="font-bold text-[#0F172A] text-base sm:text-lg leading-snug">SCHEDULE HOSPITAL OPD APPOINTMENT</h3>
                    </div>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Book a scheduled consultation session at partner clinics & hospitals.
                    </p>

                    <div className="space-y-4">
                        {[
                            { label: 'Select Doctor/Specialty', type: 'text', key: 'reason', placeholder: 'e.g. Cardiologist' },
                            { label: 'Choose Hospital', type: 'text', key: 'location', placeholder: 'e.g. PIMS Islamabad' },
                            { label: 'Select Date', type: 'date', key: 'date', placeholder: '' },
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="text-xs font-semibold text-slate-500 block mb-1.5">{f.label}</label>
                                <input
                                    type={f.type}
                                    placeholder={f.placeholder}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10 transition-all"
                                />
                            </div>
                        ))}

                        {/* Doctor slots */}
                        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#0D9488]/20 flex items-center justify-center text-xl shrink-0">👨‍⚕️</div>
                                <div>
                                    <p className="text-sm font-bold text-[#0F172A]">Doctor GP/OPD</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Fee: PKR 300 · Ziauddin Clifton</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient Details */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 mt-8">
                <h3 className="font-bold text-[#0F172A] text-lg mb-4">Patient Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1.5">Full Name *</label>
                        <input
                            type="text"
                            placeholder="Patient full name"
                            value={form.patientName}
                            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1.5">Phone Number *</label>
                        <input
                            type="tel"
                            placeholder="+92 300 1234567"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Confirm Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <button
                    onClick={handleConfirm}
                    className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-[0_8px_20px_rgba(13,148,136,0.3)] text-sm flex items-center justify-center gap-2"
                >
                    ✅ CONFIRM HOME VISIT
                </button>
                <button
                    onClick={handleConfirm}
                    className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-[0_8px_20px_rgba(15,23,42,0.3)] text-sm flex items-center justify-center gap-2"
                >
                    🏥 SCHEDULE HOSPITAL APPOINTMENT
                </button>
            </div>
        </div>
    )
}

export default BookingPage