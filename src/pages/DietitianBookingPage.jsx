import { useState, useEffect } from 'react'
import { useNavigate , useParams } from 'react-router-dom'

const DietitianBookingPage = () => {
    const navigate = useNavigate()
    const { goal, mode } = useParams()

    const [confirmed, setConfirmed] = useState(false)
    const [planDuration, setPlanDuration] = useState('1 Month')
    const [form, setForm] = useState({
        patientName: '',
        phone: '',
        age: '',
        dietPreference: 'Desi / Pakistani Homemade',
        medicalNotes: '',
    })

    useEffect(() => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        }
    }, [navigate])

    const fee = mode === 'clinic' ? 'PKR 2,500' : 'PKR 1,500'

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
                        Your nutritionist consultation request has been successfully submitted.
                    </p>
                    <div className="bg-teal-50 border border-teal-100 p-3.5 rounded-xl mb-6 text-xs text-[#0D9488] font-semibold text-left space-y-1">
                        <p>🎯 Goal: {goal?.replace('-', ' ').toUpperCase()}</p>
                        <p>💻 Mode: {mode?.toUpperCase()}</p>
                        <p>🗓️ Duration: {planDuration}</p>
                        <p>💵 Fee: {fee}</p>
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
                onClick={() => navigate(`/dietitian/${goal}`)}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer"
            >
                ← Back to Mode Selection
            </button>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1">Book Nutritionist Program</h1>
                <p className="text-xs text-slate-500 mb-6">Mode: <strong className="text-[#0D9488] uppercase">{mode} Consultation</strong> ({fee})</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={form.patientName}
                                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                                placeholder="Patient Name"
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
                        <label className="text-xs font-semibold text-slate-500 block mb-2">Select Plan Duration</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['1 Week Trial', '1 Month Plan', '3 Months Transform'].map((dur) => (
                                <button
                                    key={dur}
                                    type="button"
                                    onClick={() => setPlanDuration(dur)}
                                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
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

                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">Medical Conditions / Notes (Optional)</label>
                        <textarea
                            rows="2"
                            value={form.medicalNotes}
                            onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
                            placeholder="Any allergies, diabetes, or food preferences..."
                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0D9488]"
                        ></textarea>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between mt-6">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Consultation Fee</p>
                            <p className="text-lg font-black text-[#0D9488]">{fee}</p>
                        </div>
                        <button
                            type="submit"
                            className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
                        >
                            Confirm Program
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DietitianBookingPage