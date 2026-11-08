import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { showSuccessAlert, showErrorAlert, showWarningAlert, showConfirmAlert } from '../utils/alert'
import { SERVICE_CATEGORIES, calculateFeeBreakdown, formatCNIC, validateCNIC } from '../utils/feeRules'

// ─── Sample Data ───────────────────────────────────────────────────────────────
const SAMPLE_APPOINTMENTS = [
    {
        id: 'APT-001', patientName: 'Ahmed Raza', age: 34, phone: '0300-1234567',
        service: 'General Consultation', date: '2026-11-09', time: '10:00 AM',
        status: 'pending', fee: 400, complaint: 'Fever and body ache for 3 days'
    },
    {
        id: 'APT-002', patientName: 'Sana Malik', age: 27, phone: '0321-9876543',
        service: 'Follow-up Visit', date: '2026-11-09', time: '11:30 AM',
        status: 'confirmed', fee: 400, complaint: 'Diabetes follow-up checkup'
    },
    {
        id: 'APT-003', patientName: 'Usman Tariq', age: 45, phone: '0333-5551234',
        service: 'General Consultation', date: '2026-11-09', time: '02:00 PM',
        status: 'in-progress', fee: 400, complaint: 'Blood pressure and dizziness'
    },
    {
        id: 'APT-004', patientName: 'Fatima Zahoor', age: 31, phone: '0312-7778888',
        service: 'General Consultation', date: '2026-11-08', time: '09:30 AM',
        status: 'completed', fee: 400, complaint: 'Respiratory infection'
    },
    {
        id: 'APT-005', patientName: 'Bilal Khan', age: 22, phone: '0345-4441234',
        service: 'General Consultation', date: '2026-11-08', time: '03:00 PM',
        status: 'cancelled', fee: 400, complaint: 'Skin rash on arms'
    }
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIME_SLOTS = ['09:00 AM – 01:00 PM', '02:00 PM – 06:00 PM', '07:00 PM – 10:00 PM']

const STATUS_COLORS = {
    pending:     'bg-amber-100 text-amber-700',
    confirmed:   'bg-teal-100 text-teal-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed:   'bg-green-100 text-green-700',
    cancelled:   'bg-rose-100 text-rose-700'
}

const REVIEWS = [
    { name: 'Sarah Ahmed', rating: 5, comment: 'Very professional and thorough. Diagnosed correctly and explained everything clearly.', date: 'Nov 05, 2026' },
    { name: 'Muhammad Ali', rating: 5, comment: 'Quick response and very knowledgeable. Highly recommend!', date: 'Oct 30, 2026' },
    { name: 'Zainab Hussain', rating: 4, comment: 'Good experience overall. Prescription was helpful. Waiting time was a bit long.', date: 'Oct 22, 2026' }
]

// ─── Sub-components ────────────────────────────────────────────────────────────

// Module 1: Profile & Credentials
function ProfileModule({ user, setUser }) {
    const [profile, setProfile] = useState({
        name: user.name || '',
        gender: user.gender || 'male',
        cnic: user.cnic || '',
        phone: user.phone || '',
        email: user.email || '',
        specialty: user.specialty || '',
        experience: user.experience || '0',
        pmdc: user.pmdc || '',
        category: user.category || 'general_physician',
        fee: user.fee || '200',
        homeVisit: user.homeVisit || false,
        emergencyCall: user.emergencyCall || false,
        bio: user.bio || '',
        hospitals: user.hospitals || []
    })
    const [cnicError, setCnicError] = useState('')
    const [feeError, setFeeError] = useState('')
    const [hospitalForm, setHospitalForm] = useState({ name: '', city: '', days: [], shift: 'morning', hours: '' })

    const catObj = SERVICE_CATEGORIES[profile.category]
    const bounds = catObj ? catObj.getBounds(profile.experience) : { min: 0, max: 99999 }

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }))
        if (field === 'cnic') setCnicError('')
        if (field === 'fee') setFeeError('')
    }

    const handleCNICChange = (val) => {
        const formatted = formatCNIC(val)
        setProfile(prev => ({ ...prev, cnic: formatted }))
        setCnicError('')
    }

    const handleFeeChange = (val) => {
        setProfile(prev => ({ ...prev, fee: val }))
        const numFee = Number(val)
        if (numFee < bounds.min || numFee > bounds.max) {
            setFeeError(`Fee must be PKR ${bounds.min} – PKR ${bounds.max} for this category & experience.`)
        } else {
            setFeeError('')
        }
    }

    const handleSave = () => {
        if (!validateCNIC(profile.cnic)) {
            showErrorAlert('CNIC Error', 'Enter a valid CNIC: 12345-1234567-1')
            return
        }
        const numFee = Number(profile.fee)
        if (numFee < bounds.min || numFee > bounds.max) {
            showErrorAlert('Fee Out of Range', `Allowed: PKR ${bounds.min} – PKR ${bounds.max}`)
            return
        }
        const updated = { ...user, ...profile }
        localStorage.setItem('carepoint_user', JSON.stringify(updated))
        setUser(updated)
        showSuccessAlert('Profile Saved!', 'Your professional profile has been updated successfully.')
    }

    const addHospital = () => {
        if (!hospitalForm.name.trim() || !hospitalForm.city.trim()) {
            showWarningAlert('Missing Info', 'Enter hospital name and city.')
            return
        }
        const updated = { ...profile, hospitals: [...profile.hospitals, { ...hospitalForm, id: Date.now() }] }
        setProfile(updated)
        setHospitalForm({ name: '', city: '', days: [], shift: 'morning', hours: '' })
    }

    const removeHospital = async (id) => {
        const confirmed = await showConfirmAlert('Remove Hospital?', 'This hospital affiliation will be deleted.', 'Yes, Remove', 'Keep')
        if (confirmed) {
            setProfile(prev => ({ ...prev, hospitals: prev.hospitals.filter(h => h.id !== id) }))
        }
    }

    const toggleDay = (day) => {
        setHospitalForm(prev => ({
            ...prev,
            days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
        }))
    }

    const breakdown = calculateFeeBreakdown(profile.fee)

    return (
        <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-extrabold text-[#0F172A] mb-5 flex items-center gap-2">
                    <span>👨‍⚕️</span> Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Full Name', field: 'name', placeholder: 'Dr. Ahmed Raza', type: 'text' },
                        { label: 'Phone Number', field: 'phone', placeholder: '0300-1234567', type: 'tel' },
                        { label: 'Email Address', field: 'email', placeholder: 'doctor@email.com', type: 'email' },
                        { label: 'Specialty / Expertise', field: 'specialty', placeholder: 'e.g. General Practitioner', type: 'text' },
                        { label: 'PMDC / PMC License No.', field: 'pmdc', placeholder: 'e.g. PMDC-12345', type: 'text' },
                    ].map(({ label, field, placeholder, type }) => (
                        <div key={field}>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
                            <input
                                type={type}
                                value={profile[field]}
                                onChange={e => handleChange(field, e.target.value)}
                                placeholder={placeholder}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                            />
                        </div>
                    ))}

                    {/* CNIC Field */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">CNIC Number</label>
                        <input
                            type="text"
                            value={profile.cnic}
                            onChange={e => handleCNICChange(e.target.value)}
                            placeholder="35201-1234567-1"
                            maxLength={15}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 ${cnicError ? 'border-rose-400' : 'border-slate-200'}`}
                        />
                        {cnicError && <p className="text-xs text-rose-500 mt-1">{cnicError}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
                        <select
                            value={profile.gender}
                            onChange={e => handleChange('gender', e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Bio */}
                <div className="mt-4">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Professional Bio</label>
                    <textarea
                        rows={3}
                        value={profile.bio}
                        onChange={e => handleChange('bio', e.target.value)}
                        placeholder="Brief description of your expertise and practice..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 resize-none"
                    />
                </div>
            </div>

            {/* Professional & Fee Settings */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-extrabold text-[#0F172A] mb-5 flex items-center gap-2">
                    <span>💼</span> Professional Settings & Fee
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Service Category</label>
                        <select
                            value={profile.category}
                            onChange={e => { handleChange('category', e.target.value); handleChange('fee', SERVICE_CATEGORIES[e.target.value]?.minFee || 200) }}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                        >
                            {Object.values(SERVICE_CATEGORIES).map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Years of Experience</label>
                        <input
                            type="number"
                            min="0" max="50"
                            value={profile.experience}
                            onChange={e => { handleChange('experience', e.target.value); handleFeeChange(profile.fee) }}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                        />
                    </div>

                    {/* Fee */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Consultation Fee (PKR {bounds.min} – {bounds.max})
                        </label>
                        <input
                            type="number"
                            min={bounds.min} max={bounds.max}
                            value={profile.fee}
                            disabled={bounds.locked}
                            onChange={e => handleFeeChange(e.target.value)}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 ${feeError ? 'border-rose-400' : 'border-slate-200'} ${bounds.locked ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                        />
                        {feeError && <p className="text-xs text-rose-500 mt-1">{feeError}</p>}
                        <p className="text-xs text-slate-400 mt-1">{catObj?.getBounds(profile.experience).note}</p>
                    </div>

                    {/* Fee Breakdown preview */}
                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-teal-700 mb-2">Patient Sees (Transparent Breakdown)</p>
                        <div className="space-y-1 text-xs text-slate-600">
                            <div className="flex justify-between"><span>Base Fee</span><span className="font-semibold">PKR {breakdown.baseFee}</span></div>
                            <div className="flex justify-between"><span>Platform Fee (7%)</span><span className="font-semibold">PKR {breakdown.platformFee}</span></div>
                            <div className="flex justify-between"><span>Tax (5% on fee)</span><span className="font-semibold">PKR {breakdown.tax}</span></div>
                            <div className="flex justify-between border-t border-teal-200 pt-1 mt-1"><span className="font-bold text-[#0F172A]">Total Payable</span><span className="font-extrabold text-[#0D9488]">PKR {breakdown.total}</span></div>
                        </div>
                    </div>
                </div>

                {/* Toggles */}
                <div className="mt-5 flex flex-wrap gap-4">
                    {[
                        { field: 'homeVisit', label: '🏠 Available for Home Visit', color: 'teal' },
                        { field: 'emergencyCall', label: '🚨 Available for Emergency Call', color: 'rose' }
                    ].map(({ field, label, color }) => (
                        <label key={field} className="flex items-center gap-3 cursor-pointer select-none">
                            <div
                                onClick={() => handleChange(field, !profile[field])}
                                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${profile[field] ? (color === 'teal' ? 'bg-[#0D9488]' : 'bg-rose-500') : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${profile[field] ? 'left-7' : 'left-1'}`} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Hospital Affiliations */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-extrabold text-[#0F172A] mb-5 flex items-center gap-2">
                    <span>🏥</span> Hospital Affiliations
                </h2>

                {/* Add Hospital Form */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-5">
                    <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">Add New Affiliation</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <input
                            type="text"
                            placeholder="Hospital Name"
                            value={hospitalForm.name}
                            onChange={e => setHospitalForm(p => ({ ...p, name: e.target.value }))}
                            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={hospitalForm.city}
                            onChange={e => setHospitalForm(p => ({ ...p, city: e.target.value }))}
                            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                        />
                        <select
                            value={hospitalForm.shift}
                            onChange={e => setHospitalForm(p => ({ ...p, shift: e.target.value }))}
                            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                        >
                            <option value="morning">Morning Shift</option>
                            <option value="evening">Evening Shift</option>
                            <option value="night">Night Shift</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Hours (e.g. 08:00–14:00)"
                            value={hospitalForm.hours}
                            onChange={e => setHospitalForm(p => ({ ...p, hours: e.target.value }))}
                            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                        />
                    </div>
                    <div className="mb-3">
                        <p className="text-xs text-slate-500 mb-2 font-medium">Working Days</p>
                        <div className="flex flex-wrap gap-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => toggleDay(d)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${hospitalForm.days.includes(d) ? 'bg-[#0D9488] text-white border-[#0D9488]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0D9488]'}`}
                                >{d}</button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={addHospital}
                        className="bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold px-5 py-2 rounded-xl transition-all"
                    >+ Add Hospital</button>
                </div>

                {/* Affiliations List */}
                {profile.hospitals.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">No hospital affiliations added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {profile.hospitals.map(h => (
                            <div key={h.id} className="flex items-start justify-between bg-teal-50/60 border border-teal-100 rounded-xl p-4">
                                <div>
                                    <p className="font-bold text-[#0F172A] text-sm">{h.name}</p>
                                    <p className="text-xs text-slate-500">{h.city} · {h.shift} shift · {h.hours}</p>
                                    {h.days.length > 0 && <p className="text-xs text-teal-700 font-medium mt-1">{h.days.join(', ')}</p>}
                                </div>
                                <button onClick={() => removeHospital(h.id)} className="text-rose-400 hover:text-rose-600 text-lg leading-none">✕</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={handleSave}
                className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold py-3 rounded-2xl text-sm shadow-md transition-all"
            >
                💾 Save Profile Changes
            </button>
        </div>
    )
}

// Module 2: Availability Scheduler
function SchedulerModule({ user }) {
    const storageKey = `carepoint_schedule_${user.email}`
    const [schedule, setSchedule] = useState(() => {
        const saved = localStorage.getItem(storageKey)
        if (saved) return JSON.parse(saved)
        return DAYS.reduce((acc, d) => ({ ...acc, [d]: { available: false, slots: [] } }), {})
    })

    const toggleDay = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], available: !prev[day].available }
        }))
    }

    const toggleSlot = (day, slot) => {
        setSchedule(prev => {
            const current = prev[day].slots
            const updated = current.includes(slot) ? current.filter(s => s !== slot) : [...current, slot]
            return { ...prev, [day]: { ...prev[day], slots: updated } }
        })
    }

    const saveSchedule = () => {
        localStorage.setItem(storageKey, JSON.stringify(schedule))
        showSuccessAlert('Schedule Saved!', 'Your weekly availability has been updated.')
    }

    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-[#0F172A] mb-2 flex items-center gap-2">
                <span>📅</span> Weekly Availability Scheduler
            </h2>
            <p className="text-xs text-slate-400 mb-5">Toggle days and select your available time slots for each day.</p>
            <div className="space-y-3">
                {DAYS.map(day => (
                    <div key={day} className={`rounded-xl border p-4 transition-all ${schedule[day].available ? 'border-teal-200 bg-teal-50/40' : 'border-slate-100 bg-slate-50/60'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-sm text-[#0F172A]">{day}</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-slate-400">{schedule[day].available ? 'Available' : 'Off'}</span>
                                <div
                                    onClick={() => toggleDay(day)}
                                    className={`w-10 h-5 rounded-full transition-all relative ${schedule[day].available ? 'bg-[#0D9488]' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${schedule[day].available ? 'left-5' : 'left-0.5'}`} />
                                </div>
                            </label>
                        </div>
                        {schedule[day].available && (
                            <div className="flex flex-wrap gap-2">
                                {TIME_SLOTS.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => toggleSlot(day, slot)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${schedule[day].slots.includes(slot) ? 'bg-[#0D9488] text-white border-[#0D9488]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0D9488]'}`}
                                    >{slot}</button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button
                onClick={saveSchedule}
                className="mt-5 w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold py-3 rounded-2xl text-sm shadow-md transition-all"
            >
                💾 Save Weekly Schedule
            </button>
        </div>
    )
}

// Module 3: Appointments & Queue
function AppointmentsModule({ setActivePrescriptionPatient, setActiveTab }) {
    const [appointments, setAppointments] = useState(SAMPLE_APPOINTMENTS)
    const [queueTab, setQueueTab] = useState('requests')

    const pending = appointments.filter(a => a.status === 'pending')
    const todayQueue = appointments.filter(a => ['confirmed', 'in-progress'].includes(a.status))
    const history = appointments.filter(a => ['completed', 'cancelled'].includes(a.status))

    const updateStatus = (id, newStatus) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
    }

    const handleAccept = async (apt) => {
        const confirmed = await showConfirmAlert('Accept Appointment?', `Confirm booking for ${apt.patientName} at ${apt.time}?`, 'Accept', 'Cancel')
        if (confirmed) {
            updateStatus(apt.id, 'confirmed')
            showSuccessAlert('Appointment Confirmed!', `${apt.patientName}'s appointment has been accepted.`)
        }
    }

    const handleCancel = async (apt) => {
        const confirmed = await showConfirmAlert('Cancel Appointment?', `This will cancel ${apt.patientName}'s booking.`, 'Yes, Cancel', 'Keep')
        if (confirmed) {
            updateStatus(apt.id, 'cancelled')
            showSuccessAlert('Appointment Cancelled', 'The patient has been notified.')
        }
    }

    const handleReschedule = async (apt) => {
        showSuccessAlert('Reschedule Request Sent', `${apt.patientName} has been notified to pick a new time slot.`)
    }

    const handlePrescribe = (apt) => {
        setActivePrescriptionPatient(apt)
        setActiveTab('prescriptions')
    }

    const tabs = [
        { id: 'requests', label: `New Requests (${pending.length})` },
        { id: 'queue', label: `Today's Queue (${todayQueue.length})` },
        { id: 'history', label: `History (${history.length})` }
    ]

    const renderList = (list, type) => {
        if (list.length === 0) return (
            <div className="text-center py-10 text-slate-400">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-sm">No appointments in this section.</p>
            </div>
        )
        return list.map(apt => (
            <div key={apt.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-sm transition-all">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-9 h-9 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-sm font-bold text-[#0D9488]">
                                {apt.patientName.charAt(0)}
                            </span>
                            <div>
                                <p className="font-bold text-[#0F172A] text-sm">{apt.patientName}</p>
                                <p className="text-xs text-slate-400">Age {apt.age} · {apt.phone}</p>
                            </div>
                        </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[apt.status]}`}>
                        {apt.status.replace('-', ' ')}
                    </span>
                </div>
                <p className="text-xs text-slate-500 mb-1"><span className="font-medium">Service:</span> {apt.service}</p>
                <p className="text-xs text-slate-500 mb-1"><span className="font-medium">Complaint:</span> {apt.complaint}</p>
                <p className="text-xs text-slate-500 mb-3"><span className="font-medium">Time:</span> {apt.date} at {apt.time} · PKR {apt.fee}</p>
                {type === 'requests' && (
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleAccept(apt)} className="bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">✓ Accept</button>
                        <button onClick={() => handleReschedule(apt)} className="bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold px-4 py-2 rounded-lg transition-all">⟳ Reschedule</button>
                        <button onClick={() => handleCancel(apt)} className="bg-rose-100 hover:bg-rose-200 text-rose-600 text-xs font-bold px-4 py-2 rounded-lg transition-all">✕ Cancel</button>
                    </div>
                )}
                {type === 'queue' && (
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => { updateStatus(apt.id, 'completed'); showSuccessAlert('Consultation Complete!', `${apt.patientName}'s session marked as done.`) }} className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold px-4 py-2 rounded-lg transition-all">✓ Mark Complete</button>
                        <button onClick={() => handlePrescribe(apt)} className="bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">📋 Write Prescription</button>
                    </div>
                )}
                {type === 'history' && apt.status === 'completed' && (
                    <button onClick={() => handlePrescribe(apt)} className="bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold px-4 py-2 rounded-lg transition-all">📋 View / Write Prescription</button>
                )}
            </div>
        ))
    }

    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-[#0F172A] mb-5 flex items-center gap-2">
                <span>🗓️</span> Appointment Requests & Queue
            </h2>
            <div className="flex gap-2 mb-5 flex-wrap">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setQueueTab(t.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${queueTab === t.id ? 'bg-[#0D9488] text-white border-[#0D9488]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0D9488]'}`}
                    >{t.label}</button>
                ))}
            </div>
            <div className="space-y-3">
                {queueTab === 'requests' && renderList(pending, 'requests')}
                {queueTab === 'queue' && renderList(todayQueue, 'queue')}
                {queueTab === 'history' && renderList(history, 'history')}
            </div>
        </div>
    )
}

// Module 4: E-Prescription Builder
function PrescriptionModule({ user, initialPatient }) {
    const [selectedPatient, setSelectedPatient] = useState(initialPatient || null)
    const [diagnosis, setDiagnosis] = useState('')
    const [symptoms, setSymptoms] = useState('')
    const [labTests, setLabTests] = useState('')
    const [doctorNotes, setDoctorNotes] = useState('')
    const [medicines, setMedicines] = useState([
        { id: 1, name: '', dosage: '', frequency: '', duration: '', timing: 'after_meals' }
    ])

    // Sync when parent changes initialPatient
    useEffect(() => {
        if (initialPatient) setSelectedPatient(initialPatient)
    }, [initialPatient])

    const addMedicine = () => {
        setMedicines(prev => [...prev, { id: Date.now(), name: '', dosage: '', frequency: '', duration: '', timing: 'after_meals' }])
    }

    const removeMedicine = (id) => {
        if (medicines.length === 1) return
        setMedicines(prev => prev.filter(m => m.id !== id))
    }

    const updateMedicine = (id, field, value) => {
        setMedicines(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
    }

    const handleSend = async () => {
        if (!selectedPatient) {
            showWarningAlert('No Patient Selected', 'Please select a patient from the appointments tab first, or enter patient name manually.')
            return
        }
        const hasEmpty = medicines.some(m => !m.name.trim())
        if (hasEmpty) {
            showWarningAlert('Incomplete Medicines', 'Fill in all medicine names before sending.')
            return
        }
        const confirmed = await showConfirmAlert(
            'Send Prescription?',
            `Send e-prescription to ${selectedPatient.patientName}?`,
            'Send Now',
            'Review Again'
        )
        if (confirmed) {
            const rxKey = `carepoint_prescriptions_${selectedPatient.email || 'patient'}`
            const existing = JSON.parse(localStorage.getItem(rxKey) || '[]')
            existing.push({
                id: `RX-${Date.now()}`,
                doctorName: user.name,
                specialty: user.specialty,
                date: new Date().toLocaleDateString('en-PK'),
                patient: selectedPatient.patientName,
                diagnosis,
                symptoms,
                medicines,
                labTests,
                doctorNotes
            })
            localStorage.setItem(rxKey, JSON.stringify(existing))
            showSuccessAlert('Prescription Sent! 📋', `E-prescription successfully sent to ${selectedPatient.patientName}.`)
            setMedicines([{ id: 1, name: '', dosage: '', frequency: '', duration: '', timing: 'after_meals' }])
            setDiagnosis(''); setSymptoms(''); setLabTests(''); setDoctorNotes('')
        }
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-extrabold text-[#0F172A] mb-5 flex items-center gap-2">
                    <span>📋</span> E-Prescription Builder
                </h2>

                {/* Patient Info */}
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-5">
                    {selectedPatient ? (
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <p className="text-xs text-teal-500 font-medium">Writing prescription for:</p>
                                <p className="font-extrabold text-[#0F172A]">{selectedPatient.patientName}</p>
                                <p className="text-xs text-slate-500">Age {selectedPatient.age} · {selectedPatient.service} · {selectedPatient.time}</p>
                            </div>
                            <button onClick={() => setSelectedPatient(null)} className="text-xs text-slate-400 hover:text-rose-500">Change Patient</button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-xs text-slate-500 mb-2">No patient selected. Enter patient name manually:</p>
                            <input
                                type="text"
                                placeholder="Patient Name"
                                className="border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                                onChange={e => setSelectedPatient({ patientName: e.target.value, age: 'N/A', service: 'Walk-in', time: 'N/A' })}
                            />
                        </div>
                    )}
                </div>

                {/* Diagnosis & Symptoms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Diagnosis</label>
                        <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="e.g. Acute Pharyngitis" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Symptoms</label>
                        <input type="text" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="e.g. Fever, Sore Throat, Fatigue" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30" />
                    </div>
                </div>
            </div>

            {/* Medicines Table */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-[#0F172A] flex items-center gap-2"><span>💊</span> Medicines</h3>
                    <button onClick={addMedicine} className="bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">+ Add Medicine</button>
                </div>
                <div className="space-y-3">
                    {medicines.map((med, idx) => (
                        <div key={med.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <input
                                type="text" placeholder={`Medicine ${idx + 1}`} value={med.name}
                                onChange={e => updateMedicine(med.id, 'name', e.target.value)}
                                className="sm:col-span-1 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                            />
                            <input
                                type="text" placeholder="Dosage (e.g. 500mg)" value={med.dosage}
                                onChange={e => updateMedicine(med.id, 'dosage', e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                            />
                            <input
                                type="text" placeholder="Frequency (e.g. 2×/day)" value={med.frequency}
                                onChange={e => updateMedicine(med.id, 'frequency', e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                            />
                            <input
                                type="text" placeholder="Duration (e.g. 5 Days)" value={med.duration}
                                onChange={e => updateMedicine(med.id, 'duration', e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                            />
                            <div className="flex gap-2 items-center">
                                <select
                                    value={med.timing}
                                    onChange={e => updateMedicine(med.id, 'timing', e.target.value)}
                                    className="flex-1 border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                                >
                                    <option value="after_meals">After Meals</option>
                                    <option value="before_meals">Before Meals</option>
                                    <option value="with_water">With Water</option>
                                    <option value="at_night">At Night</option>
                                    <option value="morning_empty">Morning (Empty Stomach)</option>
                                </select>
                                <button onClick={() => removeMedicine(med.id)} className="text-rose-400 hover:text-rose-600 font-bold text-base leading-none">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lab Tests & Notes */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">🧪 Lab Test Recommendations</label>
                        <textarea
                            rows={4} value={labTests} onChange={e => setLabTests(e.target.value)}
                            placeholder="e.g. CBC, Blood Sugar (Fasting), Urine DR..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">📝 Doctor Notes & Lifestyle Advice</label>
                        <textarea
                            rows={4} value={doctorNotes} onChange={e => setDoctorNotes(e.target.value)}
                            placeholder="e.g. Drink plenty of water, Avoid oily food, Rest for 3 days..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 resize-none"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSend}
                    className="mt-5 w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold py-3 rounded-2xl text-sm shadow-md transition-all"
                >
                    📤 Send Prescription to Patient
                </button>
            </div>
        </div>
    )
}

// Module 5: Earnings & Analytics
function EarningsModule({ user }) {
    const completed = SAMPLE_APPOINTMENTS.filter(a => a.status === 'completed')
    const cancelled = SAMPLE_APPOINTMENTS.filter(a => a.status === 'cancelled')
    const totalRaw = completed.reduce((sum, a) => sum + a.fee, 0)
    const breakdown = calculateFeeBreakdown(totalRaw)
    const netPayout = breakdown.baseFee - breakdown.platformFee

    const stats = [
        { label: 'Total Appointments', value: SAMPLE_APPOINTMENTS.length, color: 'teal', icon: '📅' },
        { label: 'Completed', value: completed.length, color: 'green', icon: '✅' },
        { label: 'Cancelled', value: cancelled.length, color: 'rose', icon: '❌' },
        { label: 'Pending', value: SAMPLE_APPOINTMENTS.filter(a => a.status === 'pending').length, color: 'amber', icon: '⏳' }
    ]

    const colorMap = {
        teal: 'bg-teal-50 border-teal-100 text-teal-700',
        green: 'bg-green-50 border-green-100 text-green-700',
        rose: 'bg-rose-50 border-rose-100 text-rose-700',
        amber: 'bg-amber-50 border-amber-100 text-amber-700'
    }

    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    const earnData = [3200, 5800, 4100, 7200, 6500, totalRaw || 1600]
    const maxEarn = Math.max(...earnData)

    const avgRating = 4.8

    return (
        <div className="space-y-5">
            {/* Earnings Summary */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white shadow-md">
                <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wider">Total Revenue Generated</p>
                <p className="text-4xl font-extrabold text-white mb-1">PKR {totalRaw.toLocaleString()}</p>
                <p className="text-teal-300 text-xs">From {completed.length} completed consultation(s)</p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                        { label: 'Gross Earnings', val: `PKR ${totalRaw}`, sub: 'Base consultation fees' },
                        { label: 'Platform Fee (7%)', val: `– PKR ${breakdown.platformFee}`, sub: 'CarePoint micro-commission' },
                        { label: 'Net Payout', val: `PKR ${netPayout}`, sub: 'Your actual earnings' }
                    ].map(item => (
                        <div key={item.label} className="bg-white/10 rounded-xl p-3">
                            <p className="text-xs text-slate-400">{item.label}</p>
                            <p className="font-extrabold text-white text-sm mt-1">{item.val}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map(s => (
                    <div key={s.label} className={`rounded-2xl border p-4 text-center ${colorMap[s.color]}`}>
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <p className="text-2xl font-extrabold">{s.value}</p>
                        <p className="text-xs font-medium mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Monthly Bar Chart */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <h3 className="font-extrabold text-[#0F172A] mb-4 flex items-center gap-2"><span>📊</span> Monthly Earnings Overview (PKR)</h3>
                <div className="flex items-end gap-3 h-32">
                    {months.map((m, i) => (
                        <div key={m} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className="w-full rounded-t-lg bg-[#0D9488] transition-all"
                                style={{ height: `${(earnData[i] / maxEarn) * 100}%`, minHeight: '4px' }}
                                title={`PKR ${earnData[i]}`}
                            />
                            <span className="text-xs text-slate-400 font-medium">{m}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rating & Reviews */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <h3 className="font-extrabold text-[#0F172A] mb-4 flex items-center gap-2"><span>⭐</span> Rating & Patient Reviews</h3>
                <div className="flex items-center gap-6 mb-5">
                    <div className="text-center">
                        <p className="text-5xl font-extrabold text-[#0F172A]">{avgRating}</p>
                        <div className="flex gap-0.5 justify-center mt-1">
                            {[1,2,3,4,5].map(s => (
                                <span key={s} className={`text-lg ${s <= Math.round(avgRating) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Average Rating</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                        {[5,4,3,2,1].map(star => {
                            const count = star === 5 ? 2 : star === 4 ? 1 : 0
                            return (
                                <div key={star} className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 w-4">{star}★</span>
                                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                                        <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${(count / REVIEWS.length) * 100}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-400 w-4">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="space-y-3">
                    {REVIEWS.map((r, i) => (
                        <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-xs font-bold text-[#0D9488]">{r.name.charAt(0)}</div>
                                    <span className="font-semibold text-sm text-[#0F172A]">{r.name}</span>
                                </div>
                                <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= r.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>)}
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{r.comment}</p>
                            <p className="text-xs text-slate-300 mt-2">{r.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
const DoctorDashboard = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState('profile')
    const [activePrescriptionPatient, setActivePrescriptionPatient] = useState(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('carepoint_user')
        if (storedUser) {
            const parsed = JSON.parse(storedUser)
            if (parsed.role !== 'doctor') navigate('/dashboard')
            setUser(parsed)
        } else {
            navigate('/login')
        }
    }, [navigate])

    if (!user) return null

    const handleLogout = async () => {
        const confirmed = await showConfirmAlert('Logout?', 'You will be signed out of your doctor portal.', 'Yes, Logout', 'Stay')
        if (confirmed) {
            localStorage.removeItem('carepoint_user')
            navigate('/login')
        }
    }

    const sidebarItems = [
        { id: 'profile',       label: 'Profile & Credentials',   icon: '👨‍⚕️' },
        { id: 'schedule',      label: 'Availability Scheduler',   icon: '📅' },
        { id: 'appointments',  label: 'Appointments & Queue',     icon: '🗓️' },
        { id: 'prescriptions', label: 'E-Prescriptions',          icon: '📋' },
        { id: 'earnings',      label: 'Earnings & Analytics',     icon: '💰' }
    ]

    const catLabel = SERVICE_CATEGORIES[user.category]?.label || 'General Physician'

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* ── Sidebar ── */}
                <aside className="w-full lg:w-72 shrink-0">
                    {/* Doctor Profile Card */}
                    <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white mb-4 shadow-md">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 rounded-full bg-[#0D9488] flex items-center justify-center text-xl font-extrabold border-2 border-teal-400/40 shrink-0">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'D'}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-extrabold text-base truncate">Dr. {user.name}</h3>
                                <p className="text-teal-300 text-xs font-medium truncate">{catLabel}</p>
                                <p className="text-slate-400 text-xs">{user.experience || 0} yr(s) exp</p>
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 mt-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Base Fee</span>
                                <span className="font-bold text-teal-300">PKR {user.fee || 200}</span>
                            </div>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {user.homeVisit && <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-lg text-xs font-medium">🏠 Home Visit</span>}
                                {user.emergencyCall && <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-lg text-xs font-medium">🚨 Emergency</span>}
                            </div>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        {sidebarItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all text-left border-b border-slate-50 last:border-b-0 ${
                                    activeTab === item.id
                                        ? 'bg-[#0D9488]/10 text-[#0D9488] border-l-4 border-l-[#0D9488]'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-[#F43F5E] hover:bg-rose-50 transition-all text-left border-t border-slate-100"
                        >
                            <span>🚪</span> Logout
                        </button>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main className="flex-1 min-w-0 w-full">
                    {activeTab === 'profile'       && <ProfileModule user={user} setUser={setUser} />}
                    {activeTab === 'schedule'      && <SchedulerModule user={user} />}
                    {activeTab === 'appointments'  && (
                        <AppointmentsModule
                            setActivePrescriptionPatient={setActivePrescriptionPatient}
                            setActiveTab={setActiveTab}
                        />
                    )}
                    {activeTab === 'prescriptions' && <PrescriptionModule user={user} initialPatient={activePrescriptionPatient} />}
                    {activeTab === 'earnings'      && <EarningsModule user={user} />}
                </main>
            </div>
        </div>
    )
}

export default DoctorDashboard
