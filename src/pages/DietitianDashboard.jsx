import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showErrorAlert, showSuccessAlert } from '../utils/alert'
import { SERVICE_CATEGORIES } from '../utils/feeRules'
import { getDashboardPath, isDietitianAccount, isLabTechnicianAccount, isPharmacyManagerAccount, isUltrasoundAccount } from '../utils/accountRoles'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SLOTS = ['11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
const MEALS = ['Breakfast', 'Mid-Morning', 'Lunch', 'Evening Snack', 'Dinner']
const SPECIALIZATIONS = ['Clinical Nutrition', 'Weight Management', 'Pediatric Nutrition', 'Sports Nutrition', 'Diabetes Care', 'Maternal Nutrition', 'General Nutrition']

const dateOffset = (offset = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const initialData = () => ({
    workplaces: [],
    availability: Object.fromEntries(DAYS.map((day) => [day, { enabled: false, slots: [] }])),
    appointments: [
        { id: 'NUT-3001', patientName: 'Hiba A.', type: 'Initial diet consultation', date: dateOffset(), time: '11:00 AM', location: 'Online video', fee: 1000, status: 'pending' },
        { id: 'NUT-3002', patientName: 'Omar K.', type: 'Follow-up · weight management', date: dateOffset(), time: '02:00 PM', location: 'Gulberg Clinic, Lahore', fee: 800, status: 'confirmed' },
        { id: 'NUT-3003', patientName: 'Sara M.', type: 'Diabetes nutrition follow-up', date: dateOffset(-1), time: '12:00 PM', location: 'Online video', fee: 900, status: 'completed' },
        { id: 'NUT-3004', patientName: 'Bilal R.', type: 'Sports nutrition assessment', date: dateOffset(-1), time: '04:00 PM', location: 'DHA, Karachi', fee: 1100, status: 'cancelled' },
    ],
    mealPlans: [],
    progressLogs: [],
})

const dataKey = (user) => `carepoint_dietitian_dashboard_${user.email || 'dietitian'}`

const loadData = (user) => {
    const saved = localStorage.getItem(dataKey(user))
    if (!saved) return initialData()
    try {
        const parsed = JSON.parse(saved)
        if (!parsed || typeof parsed !== 'object') throw new Error('Saved dietitian dashboard data must be an object.')
        const defaults = initialData()
        return {
            ...defaults,
            ...parsed,
            availability: { ...defaults.availability, ...parsed.availability },
            workplaces: Array.isArray(parsed.workplaces) ? parsed.workplaces : [],
            appointments: Array.isArray(parsed.appointments) ? parsed.appointments : defaults.appointments,
            mealPlans: Array.isArray(parsed.mealPlans) ? parsed.mealPlans : [],
            progressLogs: Array.isArray(parsed.progressLogs) ? parsed.progressLogs : [],
        }
    } catch (error) {
        console.error('Unable to load dietitian dashboard data.', error)
        return initialData()
    }
}

const DietitianDashboard = () => {
    const navigate = useNavigate()
    const [session] = useState(() => {
        const saved = localStorage.getItem('carepoint_user')
        if (!saved) return { status: 'unauthenticated', user: null, data: null }
        try {
            const user = JSON.parse(saved)
            if (!user || typeof user !== 'object') throw new Error('Saved CarePoint account must be an object.')
            if (isUltrasoundAccount(user) || isLabTechnicianAccount(user) || isPharmacyManagerAccount(user) || !isDietitianAccount(user)) return { status: 'unauthorized', user, data: null }
            return { status: 'ready', user, data: loadData(user) }
        } catch (error) {
            console.error('Unable to read the current CarePoint account.', error)
            return { status: 'invalid', user: null, data: null }
        }
    })
    const [user, setUser] = useState(session.user)
    const [data, setData] = useState(session.data)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        if (session.status === 'unauthenticated' || session.status === 'invalid') navigate('/login', { replace: true })
        else if (session.status === 'unauthorized') navigate(getDashboardPath(session.user), { replace: true })
    }, [navigate, session])

    useEffect(() => {
        if (!user || !data) return
        try {
            localStorage.setItem(dataKey(user), JSON.stringify(data))
        } catch (error) {
            console.error('Unable to save dietitian dashboard data.', error)
            showErrorAlert('Unable to Save', 'Your changes could not be saved in this browser. Please try again.')
        }
    }, [data, user])

    const updateData = (updater) => setData((current) => typeof updater === 'function' ? updater(current) : updater)

    const updateProfile = (updated) => {
        try {
            localStorage.setItem('carepoint_user', JSON.stringify(updated))
            setUser(updated)
            showSuccessAlert('Profile Updated', 'Your dietitian profile has been saved on this device.')
        } catch (error) {
            console.error('Unable to save the dietitian profile.', error)
            showErrorAlert('Unable to Save', 'Your profile could not be saved in this browser. Please try again.')
        }
    }

    if (!user || !data) return null

    const navItems = [
        ['overview', '🏠', 'Overview'],
        ['profile', '🪪', 'Profile & Credentials'],
        ['availability', '📅', 'Availability'],
        ['appointments', '🗓️', 'Appointments & Clients'],
        ['progress', '📈', 'Client Progress'],
        ['earnings', '💰', 'Earnings & Reviews'],
    ]

    return (
        <div className="min-h-full bg-slate-50/70 py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-[#0D9488]">CarePoint Provider Portal</p>
                        <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Dietitian / Nutritionist Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage consultations, meal plans, client progress, and earnings.</p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">Demo workspace · saved in this browser</span>
                </header>
                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="space-y-4">
                        <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-5 text-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-teal-300/40 bg-[#0D9488] text-xl font-extrabold">{user.name?.charAt(0)?.toUpperCase() || 'D'}</span>
                                <div className="min-w-0"><p className="truncate font-bold">{user.name}</p><p className="truncate text-xs text-teal-200">{SERVICE_CATEGORIES.dietitian.label}</p></div>
                            </div>
                            <div className="mt-4 rounded-xl bg-white/10 p-3"><p className="text-xs text-slate-300">Consultation fee</p><p className="mt-1 text-xl font-extrabold text-teal-200">PKR {Number(user.fee) || 400}</p><p className="mt-1 text-[11px] text-slate-300">{user.experience || 0} years of experience</p></div>
                        </div>
                        <nav aria-label="Dietitian dashboard sections" className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            {navItems.map(([id, icon, label]) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`w-full border-b border-slate-100 px-4 py-3.5 text-left text-sm font-semibold last:border-0 ${activeTab === id ? 'border-l-4 border-l-[#0D9488] bg-teal-50 text-[#0D9488]' : 'text-slate-600 hover:bg-slate-50'}`}><span className="mr-2">{icon}</span>{label}</button>)}
                        </nav>
                    </aside>
                    <main className="min-w-0">
                        {activeTab === 'overview' && <OverviewTab user={user} data={data} setActiveTab={setActiveTab} />}
                        {activeTab === 'profile' && <ProfileTab user={user} updateProfile={updateProfile} data={data} updateData={updateData} />}
                        {activeTab === 'availability' && <AvailabilityTab data={data} updateData={updateData} />}
                        {activeTab === 'appointments' && <AppointmentsTab data={data} updateData={updateData} />}
                        {activeTab === 'progress' && <ProgressTab data={data} updateData={updateData} />}
                        {activeTab === 'earnings' && <EarningsTab user={user} data={data} />}
                    </main>
                </div>
            </div>
        </div>
    )
}

const Card = ({ title, icon, description, children }) => (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5"><h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]"><span>{icon}</span>{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>
        {children}
    </section>
)

const StatusBadge = ({ status }) => {
    const colors = { pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-teal-100 text-teal-800', 'in-progress': 'bg-blue-100 text-blue-800', completed: 'bg-emerald-100 text-emerald-800', cancelled: 'bg-rose-100 text-rose-800' }
    return <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${colors[status] || 'bg-slate-100 text-slate-700'}`}>{status.replace('-', ' ')}</span>
}

const OverviewTab = ({ user, data, setActiveTab }) => {
    const todayAppointments = data.appointments.filter((item) => item.date === dateOffset() && item.status !== 'cancelled')
    const completed = data.appointments.filter((item) => item.status === 'completed')
    const net = Math.round(completed.reduce((sum, item) => sum + Number(item.fee || 0), 0) * 0.93)
    const metrics = [
        ['New bookings', data.appointments.filter((item) => item.status === 'pending').length, '🛎️', 'bg-amber-50 text-amber-700'],
        ["Today's clients", todayAppointments.length, '👥', 'bg-teal-50 text-teal-700'],
        ['Active meal plans', data.mealPlans.filter((plan) => plan.active).length, '🥗', 'bg-emerald-50 text-emerald-700'],
        ['Net earnings', `PKR ${net}`, '💰', 'bg-blue-50 text-blue-700'],
    ]
    return <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, icon, style]) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><span className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${style}`}>{icon}</span><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-extrabold text-[#0F172A]">{value}</p></div>)}</div>
        <Card title="Today’s client queue" icon="🗓️" description={`Welcome, ${user.name}. Here are your scheduled demo consultations.`}>
            <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">Bookings, notifications, and patient messaging are sample data only and are not connected to a live backend.</p>
            {todayAppointments.length ? <div className="space-y-3">{todayAppointments.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"><div><p className="font-bold text-[#0F172A]">{item.patientName}<span className="font-normal text-slate-500"> · {item.type}</span></p><p className="mt-1 text-xs text-slate-500">{item.time} · {item.location}</p></div><StatusBadge status={item.status} /></div>)}</div> : <p className="text-sm text-slate-500">No consultations scheduled for today.</p>}
            <button type="button" onClick={() => setActiveTab('appointments')} className="mt-4 text-sm font-bold text-[#0D9488] hover:underline">Manage appointments →</button>
        </Card>
    </div>
}

const ProfileTab = ({ user, updateProfile, data, updateData }) => {
    const bounds = SERVICE_CATEGORIES.dietitian.getBounds()
    const [profile, setProfile] = useState({
        name: user.name || '', gender: user.gender || 'female', specialty: user.specialty || '',
        qualification: user.qualification || '', registrationNumber: user.registrationNumber || '',
        credentialName: user.credentialName || '', fee: Math.min(bounds.max, Math.max(bounds.min, Number(user.fee) || bounds.min)),
        experience: Number(user.experience) || 0, email: user.email || '', phone: user.phone || '',
        modes: { online: true, homeAssessment: false, ...user.consultationModes },
    })
    const [fileName, setFileName] = useState('')
    const [feeError, setFeeError] = useState('')
    const [location, setLocation] = useState({ name: '', kind: 'Clinic' })

    const save = (event) => {
        event.preventDefault()
        if (profile.fee < bounds.min || profile.fee > bounds.max) {
            setFeeError(`Consultation fee must be between PKR ${bounds.min} and PKR ${bounds.max}.`)
            return
        }
        updateProfile({ ...user, ...profile, role: 'dietitian', fee: Number(profile.fee), experience: Number(profile.experience), consultationModes: profile.modes })
    }

    const addLocation = () => {
        if (!location.name.trim()) return
        updateData((current) => ({ ...current, workplaces: [...current.workplaces, { id: crypto.randomUUID(), ...location, name: location.name.trim() }] }))
        setLocation({ name: '', kind: 'Clinic' })
    }

    return <div className="space-y-5">
        <Card title="Professional profile & credentials" icon="🪪" description="Credential files stay on this device in this demo and are not submitted for verification.">
            <form onSubmit={save} className="space-y-5">
                <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">Verification status: {user.verificationStatus || 'Pending review'}. An administrator must review your credentials before they can be verified.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name"><input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} /></Field>
                    <Field label="Gender"><select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className={inputClass}><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select></Field>
                    <Field label="Specialization"><select value={profile.specialty} onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} className={inputClass}><option value="">Select a specialization</option>{SPECIALIZATIONS.map((item) => <option key={item}>{item}</option>)}</select></Field>
                    <Field label="Degree / qualification"><input value={profile.qualification} onChange={(e) => setProfile({ ...profile, qualification: e.target.value })} placeholder="e.g. BS Nutrition, MSc Clinical Nutrition" className={inputClass} /></Field>
                    <Field label="Professional registration number"><input required value={profile.registrationNumber} onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })} placeholder="Enter registration or license number" className={inputClass} /></Field>
                    <Field label="Degree / certificate document"><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => { const file = e.target.files?.[0]; setFileName(file?.name || ''); if (file) setProfile((current) => ({ ...current, credentialName: file.name })) }} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-[#0D9488]" /><p className="mt-1 text-xs text-slate-500">{fileName || profile.credentialName || 'PDF, JPG, or PNG · local preview only'}</p></Field>
                    <Field label={`Consultation fee (PKR ${bounds.min}–${bounds.max})`}><input type="number" min={bounds.min} max={bounds.max} value={profile.fee} onChange={(e) => { setProfile({ ...profile, fee: Number(e.target.value) }); setFeeError('') }} className={inputClass} />{feeError && <p className="mt-1 text-xs font-semibold text-rose-600">{feeError}</p>}<p className="mt-1 text-xs text-slate-500">{bounds.note}</p></Field>
                    <Field label="Years of experience"><input type="number" min="0" max="50" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: Math.max(0, Number(e.target.value)) })} className={inputClass} /></Field>
                    <Field label="Email"><input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} /></Field>
                    <Field label="Phone"><input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} /></Field>
                </div>
                <div><p className="mb-2 text-sm font-bold text-slate-700">Consultation modes</p><div className="grid gap-2 sm:grid-cols-2">{[{ field: 'online', label: 'Online video consultations' }, { field: 'homeAssessment', label: 'Home diet assessments' }].map(({ field, label }) => <label key={field} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">{label}<input type="checkbox" checked={Boolean(profile.modes[field])} onChange={(e) => setProfile({ ...profile, modes: { ...profile.modes, [field]: e.target.checked } })} className="h-4 w-4 accent-[#0D9488]" /></label>)}</div></div>
                <button type="submit" className={primaryButton}>Save dietitian profile</button>
            </form>
        </Card>
        <Card title="Clinic affiliations & consultation locations" icon="📍" description="Add clinics or areas where you offer home consultations.">
            <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]"><input value={location.name} onChange={(e) => setLocation({ ...location, name: e.target.value })} placeholder="Clinic, hospital, or home-service zone" className={inputClass} /><select value={location.kind} onChange={(e) => setLocation({ ...location, kind: e.target.value })} className={inputClass}><option>Clinic</option><option>Hospital</option><option>Home service zone</option></select><button type="button" onClick={addLocation} className={secondaryButton}>Add</button></div>
            {data.workplaces.length > 0 && <ul className="mt-4 space-y-2">{data.workplaces.map((item) => <li key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span><strong className="text-slate-800">{item.name}</strong><span className="ml-2 text-slate-500">{item.kind}</span></span><button type="button" onClick={() => updateData((current) => ({ ...current, workplaces: current.workplaces.filter((place) => place.id !== item.id) }))} className="font-semibold text-rose-600 hover:underline">Remove</button></li>)}</ul>}
        </Card>
    </div>
}

const AvailabilityTab = ({ data, updateData }) => {
    const toggleDay = (day) => updateData((current) => ({ ...current, availability: { ...current.availability, [day]: { ...current.availability[day], enabled: !current.availability[day].enabled } } }))
    const toggleSlot = (day, slot) => updateData((current) => {
        const schedule = current.availability[day]
        const slots = schedule.slots.includes(slot) ? schedule.slots.filter((item) => item !== slot) : [...schedule.slots, slot]
        return { ...current, availability: { ...current.availability, [day]: { ...schedule, enabled: true, slots } } }
    })
    return <Card title="Weekly consultation availability" icon="📅" description="Choose working days, 30-minute consultation windows, and available time slots.">
        <div className="mb-4 flex flex-wrap gap-2 rounded-xl bg-teal-50 p-4 text-xs font-semibold text-teal-900"><span>⏱ Standard session duration: 30 minutes</span><span className="hidden sm:inline">·</span><span>Slots available from 11:00 AM to 5:00 PM</span></div>
        <div className="space-y-3">{DAYS.map((day) => { const schedule = data.availability[day] || { enabled: false, slots: [] }; return <div key={day} className="rounded-xl border border-slate-200 p-4"><div className="mb-3 flex items-center justify-between"><span className="font-bold text-slate-800">{day}</span><label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><input type="checkbox" checked={schedule.enabled} onChange={() => toggleDay(day)} className="h-4 w-4 accent-[#0D9488]" />{schedule.enabled ? 'Available' : 'Day off'}</label></div>{schedule.enabled && <div className="flex flex-wrap gap-2">{SLOTS.map((slot) => <button key={slot} type="button" onClick={() => toggleSlot(day, slot)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${schedule.slots.includes(slot) ? 'border-[#0D9488] bg-[#0D9488] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-400'}`}>{slot}</button>)}</div>}</div> })}</div>
    </Card>
}

const AppointmentsTab = ({ data, updateData }) => {
    const [filter, setFilter] = useState('all')
    const [rescheduleId, setRescheduleId] = useState('')
    const [activeAppointment, setActiveAppointment] = useState(null)
    const appointments = useMemo(() => data.appointments.filter((item) => filter === 'all' || item.status === filter), [data.appointments, filter])
    const updateAppointment = (id, changes) => updateData((current) => ({ ...current, appointments: current.appointments.map((item) => item.id === id ? { ...item, ...changes } : item) }))
    const submitReschedule = (event, appointment) => {
        event.preventDefault()
        const values = new FormData(event.currentTarget)
        const date = values.get('date')
        const time = values.get('time')
        if (!date || !time) return
        updateAppointment(appointment.id, { date, time })
        setRescheduleId('')
        showSuccessAlert('Appointment Rescheduled', `The sample appointment for ${appointment.patientName} has been updated.`)
    }
    const savePlan = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const values = Object.fromEntries([...formData.entries()].filter(([key]) => key !== 'pdf'))
        const pdf = formData.get('pdf')
        values.pdfName = pdf instanceof File && pdf.size > 0 ? pdf.name : ''
        const macroTotal = Number(values.carbs || 0) + Number(values.protein || 0) + Number(values.fat || 0)
        if (macroTotal > 0 && macroTotal !== 100) {
            showErrorAlert('Check Macro Split', 'Carbohydrates, protein, and fat percentages should total 100%.')
            return
        }
        updateData((current) => ({
            ...current,
            mealPlans: [...current.mealPlans, { ...values, id: crypto.randomUUID(), appointmentId: activeAppointment.id, patientName: activeAppointment.patientName, active: true, createdAt: new Date().toISOString() }],
            appointments: current.appointments.map((item) => item.id === activeAppointment.id && item.status === 'confirmed' ? { ...item, status: 'in-progress' } : item),
        }))
        setActiveAppointment(null)
        showSuccessAlert('Meal Plan Saved', 'The sample diet chart was saved in this browser. It has not been sent to a patient.')
    }

    return <>
        <Card title="Appointment requests & client queue" icon="🗓️" description="Manage initial consultations and follow-ups, then prepare personalized meal plans.">
            <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">These appointments are sample records only. Live booking alerts and client messaging are not connected.</p>
            <div className="mb-4 flex flex-wrap gap-2">{['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => <button key={status} type="button" onClick={() => setFilter(status)} className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${filter === status ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{status.replace('-', ' ')}</button>)}</div>
            <div className="space-y-3">{appointments.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[#0F172A]">{item.patientName}</h3><StatusBadge status={item.status} /></div><p className="mt-1 text-sm text-slate-600">{item.type}</p><p className="mt-1 text-xs text-slate-500">{item.date} at {item.time} · {item.location} · PKR {item.fee}</p></div><span className="text-xs font-semibold text-slate-400">{item.id}</span></div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {item.status === 'pending' && <><button type="button" onClick={() => { updateAppointment(item.id, { status: 'confirmed' }); showSuccessAlert('Appointment Accepted', `${item.patientName}'s sample booking has been accepted.`) }} className={smallPrimary}>✓ Accept</button><button type="button" onClick={() => setRescheduleId(rescheduleId === item.id ? '' : item.id)} className={smallNeutral}>↻ Reschedule</button><button type="button" onClick={() => { updateAppointment(item.id, { status: 'cancelled' }); showSuccessAlert('Appointment Cancelled', 'The sample booking was marked cancelled.') }} className={smallDanger}>Cancel</button></>}
                    {item.status === 'confirmed' && <><button type="button" onClick={() => updateAppointment(item.id, { status: 'in-progress' })} className={smallPrimary}>Start consultation</button><button type="button" onClick={() => setRescheduleId(rescheduleId === item.id ? '' : item.id)} className={smallNeutral}>↻ Reschedule</button><button type="button" onClick={() => { updateAppointment(item.id, { status: 'cancelled' }); showSuccessAlert('Appointment Cancelled', 'The sample booking was marked cancelled.') }} className={smallDanger}>Cancel</button></>}
                    {['confirmed', 'in-progress'].includes(item.status) && <><button type="button" onClick={() => setActiveAppointment(item)} className={smallNeutral}>🥗 Build meal plan</button><button type="button" onClick={() => { updateAppointment(item.id, { status: 'completed' }); showSuccessAlert('Consultation Completed', 'The sample consultation has been marked complete.') }} className={smallPrimary}>Mark completed</button></>}
                    {data.mealPlans.some((plan) => plan.appointmentId === item.id) && <span className="self-center text-xs font-semibold text-teal-700">✓ Meal plan saved</span>}
                </div>
                {rescheduleId === item.id && <form onSubmit={(event) => submitReschedule(event, item)} className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]"><Field label="New date"><input name="date" type="date" required defaultValue={item.date} className={inputClass} /></Field><Field label="New time"><input name="time" type="time" required className={inputClass} /><span className="mt-1 block text-[11px] font-normal text-slate-400">24-hour time</span></Field><button type="submit" className={`${smallPrimary} self-end`}>Save time</button></form>}
            </article>)}{appointments.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No appointments in this status.</p>}</div>
        </Card>
        {activeAppointment && <MealPlanModal appointment={activeAppointment} onClose={() => setActiveAppointment(null)} onSubmit={savePlan} />}
    </>
}

const MealPlanModal = ({ appointment, onClose, onSubmit }) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
        <section role="dialog" aria-modal="true" aria-labelledby="meal-plan-title" className="my-auto w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3"><div><h2 id="meal-plan-title" className="text-xl font-extrabold text-[#0F172A]">Personalized meal plan</h2><p className="mt-1 text-sm text-slate-500">{appointment.patientName} · {appointment.type}</p></div><button type="button" onClick={onClose} aria-label="Close meal plan" className="text-2xl leading-none text-slate-400">×</button></div>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Field label="Daily calorie target (kcal)"><input name="calories" type="number" min="500" required placeholder="e.g. 1800" className={inputClass} /></Field><Field label="Carbohydrates (%)"><input name="carbs" type="number" min="0" max="100" placeholder="45" className={inputClass} /></Field><Field label="Protein (%)"><input name="protein" type="number" min="0" max="100" placeholder="25" className={inputClass} /></Field><Field label="Fat (%)"><input name="fat" type="number" min="0" max="100" placeholder="30" className={inputClass} /></Field></div>
                <Field label="Daily water intake goal"><input name="water" placeholder="e.g. 8 glasses / 2 litres" className={inputClass} /></Field>
                <div className="grid gap-3 sm:grid-cols-2">{MEALS.map((meal) => <Field key={meal} label={`${meal} · suggested foods`}><textarea name={`meal_${meal.toLowerCase().replace('-', '_')}`} rows="2" placeholder="Add foods and portion guidance" className={inputClass} /></Field>)}</div>
                <div className="grid gap-3 sm:grid-cols-2"><Field label="Foods to include"><textarea name="foodsToInclude" rows="2" placeholder="Preferred foods, produce, protein sources" className={inputClass} /></Field><Field label="Foods / items to avoid"><textarea name="foodsToAvoid" rows="2" placeholder="Allergies, intolerances, or foods to limit" className={inputClass} /></Field></div>
                <Field label="Diet chart PDF (optional)"><input name="pdf" type="file" accept=".pdf" className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-[#0D9488]" /><span className="mt-1 block text-[11px] font-normal text-slate-500">Only the filename is saved; file storage and client delivery require a backend.</span></Field>
                <Field label="Nutrition notes & follow-up"><textarea name="notes" rows="2" placeholder="Personal guidance and review date" className={inputClass} /></Field>
                <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Demo only: the plan is saved locally and is not transmitted to a client. Nutrition plans should be personalized by a qualified professional.</p>
                <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className={secondaryButton}>Close</button><button type="submit" className={primaryButton}>Save meal plan</button></div>
            </form>
        </section>
    </div>
)

const ProgressTab = ({ data, updateData }) => {
    const [selectedPatient, setSelectedPatient] = useState('')
    const clients = [...new Set([...data.appointments.map((item) => item.patientName), ...data.progressLogs.map((item) => item.patientName)])]
    const selectedLogs = data.progressLogs.filter((log) => !selectedPatient || log.patientName === selectedPatient).sort((a, b) => b.date.localeCompare(a.date))
    const addProgress = (event) => {
        event.preventDefault()
        const values = Object.fromEntries(new FormData(event.currentTarget).entries())
        updateData((current) => ({ ...current, progressLogs: [...current.progressLogs, { ...values, id: crypto.randomUUID(), date: dateOffset() }] }))
        event.currentTarget.reset()
        showSuccessAlert('Progress Saved', 'The sample progress log was saved in this browser.')
    }
    return <div className="space-y-5">
        <Card title="Client progress & vitals" icon="📈" description="Track weight, BMI, blood sugar, cholesterol notes, and follow-up history.">
            <div className="mb-4 flex flex-wrap items-end gap-3"><Field label="Client"><select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className={inputClass}><option value="">All clients</option>{clients.map((client) => <option key={client}>{client}</option>)}</select></Field></div>
            <form onSubmit={addProgress} className="mb-5 rounded-xl bg-slate-50 p-4">
                <h3 className="mb-3 text-sm font-extrabold text-[#0F172A]">Add today’s progress entry</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Field label="Client name"><input name="patientName" required placeholder="Select or enter client" list="dietitian-client-list" className={inputClass} /><datalist id="dietitian-client-list">{clients.map((client) => <option key={client} value={client} />)}</datalist></Field><Field label="Weight (kg)"><input name="weight" type="number" min="1" step="0.1" placeholder="e.g. 68.5" className={inputClass} /></Field><Field label="BMI"><input name="bmi" type="number" min="1" step="0.1" placeholder="e.g. 24.2" className={inputClass} /></Field><Field label="Blood sugar (mg/dL)"><input name="bloodSugar" type="number" min="0" placeholder="e.g. 98" className={inputClass} /></Field></div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]"><Field label="Cholesterol / follow-up notes"><input name="notes" placeholder="e.g. Review lipid panel at next follow-up" className={inputClass} /></Field><button type="submit" className={`${primaryButton} self-end`}>Save progress</button></div>
            </form>
            <div className="space-y-3">{selectedLogs.map((log) => <article key={log.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-[#0F172A]">{log.patientName}</p><span className="text-xs text-slate-500">{log.date}</span></div><div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">{log.weight && <span>Weight: {log.weight} kg</span>}{log.bmi && <span>BMI: {log.bmi}</span>}{log.bloodSugar && <span>Blood sugar: {log.bloodSugar} mg/dL</span>}{log.notes && <span>Notes: {log.notes}</span>}</div></article>)}{selectedLogs.length === 0 && <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">No progress entries yet. Client vitals are demo data stored only on this device.</p>}</div>
        </Card>
        <Card title="Meal plans & follow-up history" icon="🥗" description="Review plans recorded for your consultation clients.">
            {data.mealPlans.length ? <div className="space-y-3">{data.mealPlans.map((plan) => <article key={plan.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-bold text-[#0F172A]">{plan.patientName}</p><span className="text-xs text-slate-500">{new Date(plan.createdAt).toLocaleDateString()}</span></div><p className="mt-1 text-sm text-slate-600">{plan.calories} kcal/day · Carbs {plan.carbs || '—'}% · Protein {plan.protein || '—'}% · Fat {plan.fat || '—'}%</p><p className="mt-1 text-xs text-slate-500">Water: {plan.water || 'Not set'} · Follow-up: {plan.notes || 'Not specified'}</p></article>)}</div> : <p className="text-sm text-slate-500">No meal plans have been added.</p>}
        </Card>
    </div>
}

const EarningsTab = ({ user, data }) => {
    const completed = data.appointments.filter((item) => item.status === 'completed')
    const gross = completed.reduce((sum, item) => sum + Number(item.fee || 0), 0)
    const commission = Math.round(gross * 0.07)
    const accepted = data.appointments.filter((item) => ['confirmed', 'in-progress', 'completed'].includes(item.status)).length
    const cancelled = data.appointments.filter((item) => item.status === 'cancelled').length
    const reviews = [{ name: 'S. Ahmed', rating: 5, comment: 'Thoughtful guidance and practical meal suggestions.' }, { name: 'M. Khan', rating: 5, comment: 'Professional consultation and clear follow-up plan.' }, { name: 'A. Raza', rating: 4, comment: 'Helpful advice tailored to my routine.' }]
    return <div className="space-y-5">
        <Card title="Earnings & consultation analytics" icon="💰" description="Illustrative totals are calculated from completed sample bookings.">
            <div className="grid gap-3 sm:grid-cols-3"><Metric label="Accepted consultations" value={accepted} /><Metric label="Completed consultations" value={completed.length} /><Metric label="Cancelled appointments" value={cancelled} /></div>
            <div className="mt-5 grid gap-3 rounded-xl bg-teal-50 p-4 sm:grid-cols-3"><Metric label="Completed consultation fees" value={`PKR ${gross}`} /><Metric label="Platform commission · 7%" value={`− PKR ${commission}`} /><Metric label="Estimated net payout" value={`PKR ${gross - commission}`} emphasized /></div>
            <p className="mt-3 text-xs text-slate-500">Payments, taxes, and payout settlement are not connected in this demo.</p>
        </Card>
        <Card title="Client ratings & feedback" icon="⭐" description="Sample reviews for dashboard preview only.">
            <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 p-4"><p className="text-3xl font-extrabold text-[#0F172A]">4.8 <span className="text-lg text-amber-400">★★★★★</span></p><p className="mt-1 text-xs text-slate-500">Average demo rating · not linked to live client reviews.</p></div>
            <div className="space-y-3">{reviews.map((review) => <div key={review.name} className="rounded-xl border border-slate-100 p-4"><div className="flex items-center justify-between"><p className="font-bold text-slate-800">{review.name}</p><p className="text-amber-400">{'★'.repeat(review.rating)}<span className="text-slate-200">{'★'.repeat(5 - review.rating)}</span></p></div><p className="mt-2 text-sm text-slate-600">{review.comment}</p></div>)}</div>
            <p className="mt-4 text-xs text-slate-500">Profile: {user.name} · {user.specialty || 'Nutrition professional'}</p>
        </Card>
    </div>
}

const Metric = ({ label, value, emphasized = false }) => <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className={`mt-1 text-xl font-extrabold ${emphasized ? 'text-[#0D9488]' : 'text-[#0F172A]'}`}>{value}</p></div>
const Field = ({ label, children }) => <label className="block text-xs font-bold text-slate-600">{label}<span className="mt-1 block">{children}</span></label>
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100'
const primaryButton = 'rounded-xl bg-[#0D9488] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0F766E]'
const secondaryButton = 'rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50'
const smallPrimary = 'rounded-lg bg-[#0D9488] px-3 py-2 text-xs font-bold text-white hover:bg-[#0F766E]'
const smallNeutral = 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50'
const smallDanger = 'rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100'

export default DietitianDashboard
