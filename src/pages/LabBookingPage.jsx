import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const LabBookingPage = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const selectedTests = location.state?.selectedTests || []
    const totalPrice = location.state?.totalPrice || 0
    const gender = location.state?.gender || 'male'

    // Mock assigned technician based on gender selection
    const assignedTechnician = gender === 'female' 
        ? { name: 'Ms. Aliza Khan', experience: '5 Years Exp', phone: '+92 300 1234567', rating: '4.9 ★' }
        : { name: 'Mr. Muhammad Ali', experience: '6 Years Exp', phone: '+92 300 7654321', rating: '4.8 ★' }

    const [confirmed, setConfirmed] = useState(false)
    const [form, setForm] = useState({
        patientName: '',
        phone: '',
        address: '',
        date: '',
        timeSlot: 'Morning (7:00 AM - 9:00 AM)',
    })

    useEffect(() => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        }
    }, [navigate])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (form.patientName && form.phone && form.address) {
            setConfirmed(true)
        }
    }

    if (confirmed) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-8">
                    <div className="text-5xl mb-3">🩸</div>
                    <h2 className="text-xl font-bold text-[#0F172A] mb-1">Home Collection Booked!</h2>
                    <p className="text-slate-500 text-xs mb-4">
                        Your sample collection has been assigned to our verified technician.
                    </p>

                    {/* Assigned Technician Box */}
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl mb-4 text-left flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl shrink-0">
                            {gender === 'female' ? '👩‍🔬' : '👨‍🔬'}
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned Technician</p>
                            <h4 className="font-bold text-[#0F172A] text-sm">{assignedTechnician.name}</h4>
                            <p className="text-slate-500 text-[11px]">{assignedTechnician.experience} • {assignedTechnician.rating}</p>
                        </div>
                    </div>

                    <div className="bg-teal-50 border border-teal-100 p-3.5 rounded-xl mb-6 text-xs text-[#0D9488] font-semibold text-left space-y-1">
                        <p>📍 Address: {form.address}</p>
                        <p>🕒 Slot: {form.timeSlot}</p>
                        <p>📋 Tests: {selectedTests.map(t => t.name).join(', ')}</p>
                        <p>💵 Total Bill: PKR {totalPrice}</p>
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
                onClick={() => navigate(`/lab-tests/${gender}`)}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer"
            >
                ← Back to Tests Selection
            </button>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1">Schedule Home Sample Collection</h1>
                
                {/* Technician preview box in form */}
                <div className="bg-teal-50/60 border border-teal-100 p-3.5 rounded-2xl my-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-teal-100 flex items-center justify-center text-xl shrink-0">
                            {gender === 'female' ? '👩‍🔬' : '👨‍🔬'}
                        </div>
                        <div>
                            <p className="text-[10px] text-[#0D9488] font-bold uppercase">Assigned Professional</p>
                            <p className="font-bold text-[#0F172A] text-xs">{assignedTechnician.name} ({assignedTechnician.experience})</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-amber-500 bg-white px-2.5 py-1 rounded-lg border border-teal-100">
                        {assignedTechnician.rating}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Patient Name *</label>
                            <input
                                type="text"
                                required
                                value={form.patientName}
                                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                                placeholder="Full Name"
                                className="w-1-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0D9488] w-full"
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
                        <label className="text-xs font-semibold text-slate-500 block mb-1">Home Complete Address *</label>
                        <input
                            type="text"
                            required
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            placeholder="House No, Street, Sector / Area, City"
                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0D9488]"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Collection Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0D9488]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Morning Time Slot (Fasting Preferred)</label>
                            <select
                                value={form.timeSlot}
                                onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0D9488] bg-white"
                            >
                                <option>Early Morning (7:00 AM - 9:00 AM)</option>
                                <option>Mid Morning (9:00 AM - 11:00 AM)</option>
                                <option>Afternoon (12:00 PM - 2:00 PM)</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between mt-6">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Total Bill ({selectedTests.length} Tests)</p>
                            <p className="text-lg font-black text-[#0D9488]">PKR {totalPrice}</p>
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

export default LabBookingPage