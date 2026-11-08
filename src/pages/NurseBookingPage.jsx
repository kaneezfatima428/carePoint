import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { showWarningAlert } from '../utils/alert'

const NurseBookingPage = () => {
    const navigate = useNavigate()
    const location = useLocation()

    // Fallback if accessed directly
    const nurse = location.state?.nurse || {
        name: 'Nurse Muhammad Usman (RN)',
        gender: 'male',
        qualification: 'BSc Nursing (Generic) • PNC Registered',
        experience: '7 Years Exp',
        rating: 4.9,
        location: 'Lahore',
        feeVisit: 1500,
        feeShift: 2800,
    }

    const [serviceType, setServiceType] = useState('visit') // 'visit', 'shift12', 'shift24'
    const [confirmed, setConfirmed] = useState(false)
    const [bookingId, setBookingId] = useState('')

    // Check user authentication
    useEffect(() => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        }
    }, [navigate])

    const [form, setForm] = useState({
        patientName: '',
        phone: '',
        age: '',
        gender: 'male',
        date: '',
        timeSlot: 'Morning (09:00 AM - 01:00 PM)',
        address: '',
        reason: 'Post-Surgical Dressing & Recovery',
        medicalNotes: '',
    })

    const calculateFee = () => {
        if (serviceType === 'visit') return nurse.feeVisit || 1500
        if (serviceType === 'shift12') return nurse.feeShift || 2800
        return (nurse.feeShift || 2800) * 1.8 // 24hr full attendant
    }

    const currentFee = Math.round(calculateFee())

    const handleSubmit = (e) => {
        e.preventDefault()
        if (form.patientName && form.phone && form.address) {
            setBookingId(`CP-NR-${Math.floor(100000 + Math.random() * 900000)}`)
            setConfirmed(true)
        } else {
            showWarningAlert('Required Fields Missing', 'Please fill all required fields: Patient Name, Phone Number, and Address.')
        }
    }

    if (confirmed) {
        return (
            <div className="max-w-xl mx-auto px-4 py-16 text-center w-full">
                <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-8 sm:p-10">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-2">Nurse Appointment Confirmed!</h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Your nursing appointment with <strong>{nurse.name}</strong> has been successfully booked.
                    </p>

                    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 mb-8 text-left space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between border-b border-teal-100/60 pb-2">
                            <span className="text-slate-500 font-medium">Booking ID:</span>
                            <span className="text-[#0D9488] font-black">{bookingId}</span>
                        </div>
                        <div className="flex justify-between border-b border-teal-100/60 pb-2">
                            <span className="text-slate-500 font-medium">Patient:</span>
                            <span className="text-[#0F172A] font-bold">{form.patientName}</span>
                        </div>
                        <div className="flex justify-between border-b border-teal-100/60 pb-2">
                            <span className="text-slate-500 font-medium">Nurse Assigned:</span>
                            <span className="text-[#0F172A] font-bold">{nurse.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-teal-100/60 pb-2">
                            <span className="text-slate-500 font-medium">Service Type:</span>
                            <span className="text-slate-800 font-bold capitalize">
                                {serviceType === 'visit' ? 'Single At-Home Visit' : serviceType === 'shift12' ? '12-Hour Shift' : '24-Hour Attendant'}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-teal-100/60 pb-2">
                            <span className="text-slate-500 font-medium">Scheduled:</span>
                            <span className="text-slate-800 font-semibold">{form.date || 'Today'} ({form.timeSlot})</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-slate-500 font-medium">Total Charges:</span>
                            <span className="text-[#0D9488] font-black text-base">PKR {currentFee}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-8 py-3.5 rounded-xl transition-all w-full shadow-md cursor-pointer text-sm"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer transition-colors"
            >
                ← Back
            </button>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                {/* Nurse Summary Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 flex-wrap">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-3xl shrink-0">
                        {nurse.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-[10px] bg-teal-50 text-[#0D9488] border border-teal-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block mb-1">
                            Verified Nurse Booking
                        </span>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] truncate">{nurse.name}</h1>
                        <p className="text-xs text-slate-500">{nurse.qualification} • {nurse.experience}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Visit Rate</span>
                        <span className="text-[#0D9488] font-black text-xl">PKR {currentFee}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Select Service Type / Shift */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-2">
                            Select Nursing Service Duration
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setServiceType('visit')}
                                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                    serviceType === 'visit'
                                        ? 'border-[#0D9488] bg-teal-50/50 shadow-sm'
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <p className="font-bold text-xs sm:text-sm text-[#0F172A]">🏠 Single Visit</p>
                                <p className="text-[11px] text-slate-500 mt-1">Dressing, IV drip, or injection</p>
                                <p className="text-[#0D9488] font-bold text-xs mt-2">PKR {nurse.feeVisit || 1500}</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setServiceType('shift12')}
                                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                    serviceType === 'shift12'
                                        ? 'border-[#0D9488] bg-teal-50/50 shadow-sm'
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <p className="font-bold text-xs sm:text-sm text-[#0F172A]">⏱️ 12-Hour Shift</p>
                                <p className="text-[11px] text-slate-500 mt-1">Day or night dedicated duty</p>
                                <p className="text-[#0D9488] font-bold text-xs mt-2">PKR {nurse.feeShift || 2800}</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setServiceType('shift24')}
                                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                    serviceType === 'shift24'
                                        ? 'border-[#0D9488] bg-teal-50/50 shadow-sm'
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <p className="font-bold text-xs sm:text-sm text-[#0F172A]">🌙 24-Hour Attendant</p>
                                <p className="text-[11px] text-slate-500 mt-1">Round-the-clock bedside care</p>
                                <p className="text-[#0D9488] font-bold text-xs mt-2">PKR {Math.round((nurse.feeShift || 2800) * 1.8)}</p>
                            </button>
                        </div>
                    </div>

                    {/* Patient Details */}
                    <div>
                        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                            Patient Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1">Patient Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.patientName}
                                    onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                                    placeholder="Enter patient full name"
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0D9488]"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="+92 300 1234567"
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0D9488]"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1">Patient Age</label>
                                <input
                                    type="number"
                                    value={form.age}
                                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                                    placeholder="e.g. 55"
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0D9488]"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1">Patient Gender</label>
                                <select
                                    value={form.gender}
                                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0D9488] bg-white"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="child">Child / Infant</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Schedule & Location */}
                    <div>
                        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                            Appointment Schedule &amp; Address
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1">Preferred Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0D9488]"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1">Preferred Time / Shift</label>
                                <select
                                    value={form.timeSlot}
                                    onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0D9488] bg-white"
                                >
                                    <option>Immediate / ASAP (Emergency)</option>
                                    <option>Morning (09:00 AM - 01:00 PM)</option>
                                    <option>Afternoon (01:00 PM - 05:00 PM)</option>
                                    <option>Evening (05:00 PM - 09:00 PM)</option>
                                    <option>Night Shift (08:00 PM - 08:00 AM)</option>
                                    <option>Day Shift (08:00 AM - 08:00 PM)</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-slate-500 block mb-1">Complete Home Address *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    placeholder="House #, Street, Area / Society, City"
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0D9488]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nursing Service Required */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">Primary Nursing Care Required</label>
                        <select
                            value={form.reason}
                            onChange={(e) => setForm({ ...form, reason: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0D9488] bg-white"
                        >
                            <option>Post-Surgical Dressing &amp; Recovery</option>
                            <option>IV Cannula / Drip Infusion</option>
                            <option>Prescription Injections (IM/IV/SC)</option>
                            <option>Urinary Catheterization (Foley's)</option>
                            <option>Elderly / Bedridden Patient Support</option>
                            <option>Bed Sore Prevention &amp; Treatment</option>
                            <option>Ryles Tube (NG Tube) Insertion / Feeding</option>
                            <option>Emergency Vitals &amp; Oxygen Support</option>
                            <option>Maternal &amp; Newborn Care</option>
                        </select>
                    </div>

                    {/* Total Summary and Submit */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <p className="text-[11px] text-slate-400 font-medium">Estimated Total Fee</p>
                            <p className="text-xl sm:text-2xl font-black text-[#0D9488]">PKR {currentFee}</p>
                            <p className="text-[10px] text-slate-400">Payment made upon nurse arrival / service completion</p>
                        </div>
                        <button
                            type="submit"
                            className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-8 py-3 rounded-xl text-xs sm:text-sm shadow-md cursor-pointer transition-all"
                        >
                            Confirm Nurse Booking →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NurseBookingPage
