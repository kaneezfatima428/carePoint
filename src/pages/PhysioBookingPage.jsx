import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const PhysioBookingPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const physio = location.state?.physio || { name: 'General Physiotherapist', feePerSession: 1500 }

    const [sessionCount, setSessionCount] = useState(1)
    const [visitType, setVisitType] = useState('home')
    const [confirmed, setConfirmed] = useState(false)

    const [form, setForm] = useState({
        patientName: '',
        phone: '',
        date: '',
        address: '',
    })

    useEffect(() => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        }
    }, [navigate])

    const totalAmount = physio.feePerSession * sessionCount

    const handleSubmit = (e) => {
        e.preventDefault()
        if (form.patientName && form.phone) {
            setConfirmed(true)
        } else {
            alert('Please fill Patient Name & Phone Number')
        }
    }

    if (confirmed) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-8">
                    <div className="text-5xl mb-3">✅</div>
                    <h2 className="text-xl font-bold text-[#0F172A] mb-1">Session Booked!</h2>
                    <p className="text-slate-500 text-xs mb-3">Your physiotherapy session with <strong>{physio.name}</strong> has been booked.</p>
                    <div className="bg-teal-50 border border-teal-100 p-3 rounded-xl mb-6 text-xs text-[#0D9488] font-semibold">
                        {sessionCount} Session(s) • Total: PKR {totalAmount}
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#0D9488] text-white font-bold py-2.5 px-6 rounded-xl text-xs w-full shadow-md"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 w-full">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1">Book Physiotherapy Session</h1>
                <p className="text-xs text-slate-500 mb-6">Physiotherapist: <strong className="text-[#0D9488]">{physio.name}</strong></p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Visit Type */}
                    <div>
                        <label className="text-xs font-bold text-slate-600 block mb-2">Visit Location</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setVisitType('home')}
                                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                                    visitType === 'home'
                                        ? 'border-[#0D9488] bg-teal-50/50 text-[#0D9488]'
                                        : 'border-slate-200 text-slate-600'
                                }`}
                            >
                                🏠 At-Home Visit
                            </button>
                            <button
                                type="button"
                                onClick={() => setVisitType('clinic')}
                                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                                    visitType === 'clinic'
                                        ? 'border-[#0D9488] bg-teal-50/50 text-[#0D9488]'
                                        : 'border-slate-200 text-slate-600'
                                }`}
                            >
                                🏥 Clinic Visit
                            </button>
                        </div>
                    </div>

                    {/* Number of Sessions */}
                    <div>
                        <label className="text-xs font-bold text-slate-600 block mb-2">Select Number of Sessions</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 5, 10].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setSessionCount(num)}
                                    className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                                        sessionCount === num
                                            ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-sm'
                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {num} {num === 1 ? 'Session' : 'Sessions'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Patient Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Patient Name *</label>
                            <input
                                type="text"
                                required
                                value={form.patientName}
                                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                                placeholder="Full Name"
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
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Preferred Start Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0D9488]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Address (For Home Visit)</label>
                            <input
                                type="text"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                placeholder="Area / City"
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0D9488]"
                            />
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Total Charges ({sessionCount} Session)</p>
                            <p className="text-lg font-black text-[#0D9488]">PKR {totalAmount}</p>
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

export default PhysioBookingPage