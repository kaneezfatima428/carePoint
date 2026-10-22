import { useNavigate, useParams } from 'react-router-dom'

const hospitalData = [
    {
        id: 1,
        name: 'City Care Hospital & Diagnostic',
        location: 'Gulberg, Lahore',
        timings: '9:00 AM - 5:00 PM',
        shift: 'day',
        fee: 'PKR 2,000',
        rating: 4.8,
        radiologist: 'Dr. Shahida Parveen',
    },
    {
        id: 2,
        name: 'Shifa Medical Complex',
        location: 'Clifton, Karachi',
        timings: '8:00 AM - 4:00 PM',
        shift: 'day',
        fee: 'PKR 2,500',
        rating: 4.9,
        radiologist: 'Dr. Kamran Malik',
    },
    {
        id: 3,
        name: 'Evercare Emergency & Radiology Lab',
        location: 'Blue Area, Islamabad',
        timings: '6:00 PM - 2:00 AM (Night)',
        shift: 'night',
        fee: 'PKR 3,000',
        rating: 4.7,
        radiologist: 'Dr. Imran Qureshi',
    },
    {
        id: 4,
        name: '24/7 Trauma & Ultrasound Center',
        location: 'Saddar, Rawalpindi',
        timings: '10:00 PM - 8:00 AM (Overnight)',
        shift: 'night',
        fee: 'PKR 3,200',
        rating: 4.8,
        radiologist: 'Dr. Ayesha Tariq',
    },
]

const UltrasoundHospitalsPage = () => {
    const { shift } = useParams() // 'day' ya 'night'
    const navigate = useNavigate()

    const filteredHospitals = hospitalData.filter((h) => h.shift === shift)
    const shiftTitle = shift === 'night' ? 'Night Shift (Emergency & Late Hours)' : 'Day Shift (OPD Hours)'

    const handleBookHospital = (hospital) => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        } else {
            navigate('/book/ultrasound', { state: { hospital, shift } })
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
            {/* Back Button */}
            <button
                onClick={() => navigate('/ultrasound')}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer"
            >
                ← Back to Shift Selection
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2 ${
                        shift === 'night' ? 'bg-slate-800 text-teal-300' : 'bg-teal-50 text-[#0D9488]'
                    }`}>
                        {shiftTitle}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                        Hospitals Offering Ultrasound
                    </h1>
                </div>
            </div>

            {/* Hospital List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredHospitals.map((h) => (
                    <div key={h.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                        <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <h3 className="font-bold text-[#0F172A] text-lg">{h.name}</h3>
                                    <p className="text-slate-400 text-xs mt-0.5">📍 {h.location}</p>
                                </div>
                                <span className="bg-amber-50 text-amber-600 font-bold text-xs px-2.5 py-1 rounded-lg shrink-0">
                                    ★ {h.rating}
                                </span>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 my-4 space-y-1.5 text-xs text-slate-600">
                                <p><strong>👨‍⚕️ Radiologist:</strong> {h.radiologist}</p>
                                <p><strong>🕒 Timings:</strong> {h.timings}</p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Charges</p>
                                <p className="text-[#0D9488] font-black text-base">{h.fee}</p>
                            </div>
                            <button
                                onClick={() => handleBookHospital(h)}
                                className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer transition-all"
                            >
                                Select Hospital
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UltrasoundHospitalsPage