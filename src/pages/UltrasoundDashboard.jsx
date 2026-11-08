import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showErrorAlert, showSuccessAlert } from '../utils/alert'
import { SERVICE_CATEGORIES } from '../utils/feeRules'
import { getDashboardPath, isLabTechnicianAccount, isPharmacyManagerAccount, isUltrasoundAccount } from '../utils/accountRoles'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM']
const SPECIALIZATIONS = ['Abdominal', 'Pelvic', 'Obstetric / Fetal', 'Cardiac / Echocardiogram', 'Vascular', 'General Diagnostic Ultrasound']
const STATUS_LABELS = {
    pending: 'New request',
    confirmed: 'Confirmed',
    'in-progress': 'Scanning in progress',
    'report-pending': 'Report pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
}

const dateOffset = (offset = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const createInitialData = () => ({
    workplaces: [],
    availability: Object.fromEntries(DAYS.map((day) => [day, { enabled: false, duration: 30, slots: [] }])),
    appointments: [
        { id: 'US-4001', patientName: 'Hiba A.', scan: 'Obstetric ultrasound', date: dateOffset(), time: '10:00 AM', location: 'CarePoint Imaging, Lahore', fee: 1800, status: 'pending' },
        { id: 'US-4002', patientName: 'Omar K.', scan: 'Abdominal ultrasound', date: dateOffset(), time: '12:00 PM', location: 'Gulberg Diagnostic Center', fee: 1400, status: 'confirmed' },
        { id: 'US-4003', patientName: 'Sara M.', scan: 'Pelvic ultrasound', date: dateOffset(-1), time: '11:00 AM', location: 'Clifton Imaging Center, Karachi', fee: 1600, status: 'completed' },
        { id: 'US-4004', patientName: 'Bilal R.', scan: 'Echocardiogram', date: dateOffset(-1), time: '02:00 PM', location: 'Portable home service', fee: 2000, status: 'cancelled' },
    ],
    reports: [],
    reviews: [
        { id: 'REV-1', patientName: 'M. A.', rating: 5, feedback: 'Clear explanation and a professional experience.' },
        { id: 'REV-2', patientName: 'S. K.', rating: 4, feedback: 'The appointment was organized and comfortable.' },
    ],
})

const storageKey = (user) => `carepoint_ultrasound_dashboard_${user.email || 'specialist'}`

const loadData = (user) => {
    const saved = localStorage.getItem(storageKey(user))
    if (!saved) return createInitialData()
    try {
        const parsed = JSON.parse(saved)
        if (!parsed || typeof parsed !== 'object') throw new Error('Saved ultrasound dashboard data must be an object.')
        const defaults = createInitialData()
        return {
            ...defaults,
            ...parsed,
            availability: { ...defaults.availability, ...parsed.availability },
            workplaces: Array.isArray(parsed.workplaces) ? parsed.workplaces : [],
            appointments: Array.isArray(parsed.appointments) ? parsed.appointments : defaults.appointments,
            reports: Array.isArray(parsed.reports) ? parsed.reports : [],
            reviews: Array.isArray(parsed.reviews) ? parsed.reviews : defaults.reviews,
        }
    } catch (error) {
        console.error('Unable to load ultrasound dashboard data.', error)
        return createInitialData()
    }
}

const UltrasoundDashboard = () => {
    const navigate = useNavigate()
    const [session] = useState(() => {
        const saved = localStorage.getItem('carepoint_user')
        if (!saved) return { status: 'unauthenticated', user: null, data: null }
        try {
            const user = JSON.parse(saved)
            if (!user || typeof user !== 'object') throw new Error('Saved CarePoint account must be an object.')
            if (isLabTechnicianAccount(user) || isPharmacyManagerAccount(user) || !isUltrasoundAccount(user)) return { status: 'unauthorized', user, data: null }
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
            localStorage.setItem(storageKey(user), JSON.stringify(data))
        } catch (error) {
            console.error('Unable to save ultrasound dashboard data.', error)
            showErrorAlert('Unable to Save', 'Your changes could not be saved in this browser. Please try again.')
        }
    }, [data, user])

    const updateData = (updater) => setData((current) => typeof updater === 'function' ? updater(current) : updater)

    const saveProfile = (updated) => {
        try {
            localStorage.setItem('carepoint_user', JSON.stringify(updated))
            setUser(updated)
            showSuccessAlert('Profile Updated', 'Your specialist profile has been saved on this device.')
        } catch (error) {
            console.error('Unable to save the specialist profile.', error)
            showErrorAlert('Unable to Save', 'Your profile could not be saved in this browser. Please try again.')
        }
    }

    if (!user || !data) return null

    const navItems = [
        ['overview', '🏠', 'Overview'],
        ['profile', '🪪', 'Profile & Credentials'],
        ['availability', '📅', 'Scanner Availability'],
        ['appointments', '🩻', 'Scan Queue & Reports'],
        ['earnings', '💰', 'Earnings & Reviews'],
    ]

    return (
        <div className="min-h-full bg-slate-50/70 py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-[#0D9488]">CarePoint Provider Portal</p>
                        <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Ultrasound & Diagnostic Specialist Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage scan bookings, facilities, reports, and earnings.</p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">Demo workspace · saved in this browser</span>
                </header>
                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="space-y-4">
                        <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-5 text-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-teal-300/40 bg-[#0D9488] text-xl font-extrabold">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                <div className="min-w-0"><p className="truncate font-bold">{user.name || 'Diagnostic Specialist'}</p><p className="truncate text-xs text-teal-200">{SERVICE_CATEGORIES.ultrasound_specialist.label}</p></div>
                            </div>
                            <div className="mt-4 rounded-xl bg-white/10 p-3"><p className="text-xs text-slate-300">Scan fee</p><p className="mt-1 text-xl font-extrabold text-teal-200">PKR {Number(user.fee) || 800}</p><p className="mt-1 text-[11px] text-slate-300">{user.experience || 0} years of experience</p></div>
                        </div>
                        <nav aria-label="Ultrasound dashboard sections" className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            {navItems.map(([id, icon, label]) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`w-full border-b border-slate-100 px-4 py-3.5 text-left text-sm font-semibold last:border-0 ${activeTab === id ? 'border-l-4 border-l-[#0D9488] bg-teal-50 text-[#0D9488]' : 'text-slate-600 hover:bg-slate-50'}`}><span className="mr-2">{icon}</span>{label}</button>)}
                        </nav>
                    </aside>
                    <main className="min-w-0">
                        {activeTab === 'overview' && <OverviewTab user={user} data={data} setActiveTab={setActiveTab} />}
                        {activeTab === 'profile' && <ProfileTab user={user} saveProfile={saveProfile} data={data} updateData={updateData} />}
                        {activeTab === 'availability' && <AvailabilityTab data={data} updateData={updateData} />}
                        {activeTab === 'appointments' && <AppointmentsTab data={data} updateData={updateData} />}
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
    const colors = {
        pending: 'bg-amber-100 text-amber-800',
        confirmed: 'bg-teal-100 text-teal-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        'report-pending': 'bg-violet-100 text-violet-800',
        completed: 'bg-emerald-100 text-emerald-800',
        cancelled: 'bg-rose-100 text-rose-800',
    }
    return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors[status] || 'bg-slate-100 text-slate-700'}`}>{STATUS_LABELS[status] || status}</span>
}

const OverviewTab = ({ user, data, setActiveTab }) => {
    const todayAppointments = data.appointments.filter((item) => item.date === dateOffset() && item.status !== 'cancelled')
    const completed = data.appointments.filter((item) => item.status === 'completed')
    const gross = completed.reduce((sum, item) => sum + Number(item.fee || 0), 0)
    const metrics = [
        ['New scan requests', data.appointments.filter((item) => item.status === 'pending').length, '🛎️', 'bg-amber-50 text-amber-700'],
        ["Today's scan queue", todayAppointments.length, '🩻', 'bg-teal-50 text-teal-700'],
        ['Reports pending', data.appointments.filter((item) => item.status === 'report-pending').length, '📄', 'bg-violet-50 text-violet-700'],
        ['Net earnings', `PKR ${Math.round(gross * 0.93)}`, '💰', 'bg-blue-50 text-blue-700'],
    ]
    return <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, icon, style]) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><span className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${style}`}>{icon}</span><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-extrabold text-[#0F172A]">{value}</p></div>)}</div>
        <Card title="Today’s scan queue" icon="🗓️" description={`Welcome, ${user.name || 'Specialist'}. Review your scheduled demo scans.`}>
            <DemoNotice />
            {todayAppointments.length ? <div className="space-y-3">{todayAppointments.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"><div><p className="font-bold text-[#0F172A]">{item.patientName}<span className="font-normal text-slate-500"> · {item.scan}</span></p><p className="mt-1 text-xs text-slate-500">{item.time} · {item.location}</p></div><StatusBadge status={item.status} /></div>)}</div> : <p className="text-sm text-slate-500">No scans scheduled for today.</p>}
            <button type="button" onClick={() => setActiveTab('appointments')} className="mt-4 text-sm font-bold text-[#0D9488] hover:underline">Manage scan queue →</button>
        </Card>
    </div>
}

const ProfileTab = ({ user, saveProfile, data, updateData }) => {
    const [profile, setProfile] = useState(() => ({
        name: user.name || '',
        gender: user.gender || '',
        specialization: user.specialization || 'General Diagnostic Ultrasound',
        qualification: user.qualification || '',
        licenseNumber: user.licenseNumber || '',
        credentialName: user.credentialName || '',
        fee: Number(user.fee) || 800,
        experience: Number(user.experience) || 0,
        clinicScans: user.clinicScans ?? true,
        homeScans: Boolean(user.homeScans),
    }))
    const [location, setLocation] = useState({ name: '', kind: 'Imaging center', city: '' })
    const [fileName, setFileName] = useState('')
    const [feeError, setFeeError] = useState('')

    const addLocation = () => {
        if (!location.name.trim()) {
            showErrorAlert('Location Required', 'Enter a facility or service-zone name before adding it.')
            return
        }
        updateData((current) => ({ ...current, workplaces: [...current.workplaces, { ...location, id: crypto.randomUUID(), name: location.name.trim() }] }))
        setLocation({ name: '', kind: 'Imaging center', city: '' })
    }

    const submit = (event) => {
        event.preventDefault()
        if (profile.fee < 800 || profile.fee > 2000) {
            setFeeError('Scan fees must be between PKR 800 and PKR 2,000.')
            return
        }
        saveProfile({ ...user, ...profile, role: 'ultrasound_specialist' })
    }

    return <div className="space-y-5">
        <Card title="Specialist profile & credentials" icon="🪪" description="Keep your professional details and verification documents up to date.">
            <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Full name"><input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} /></Field>
                    <Field label="Gender"><select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className={inputClass}><option value="">Select</option><option>Female</option><option>Male</option><option>Prefer not to say</option></select></Field>
                    <Field label="Diagnostic specialization"><select value={profile.specialization} onChange={(e) => setProfile({ ...profile, specialization: e.target.value })} className={inputClass}>{SPECIALIZATIONS.map((item) => <option key={item}>{item}</option>)}</select></Field>
                    <Field label="Qualification"><input value={profile.qualification} onChange={(e) => setProfile({ ...profile, qualification: e.target.value })} placeholder="e.g. BS Medical Imaging Technology, RDMS" className={inputClass} /></Field>
                    <Field label="Professional license / registration number"><input value={profile.licenseNumber} onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })} className={inputClass} /></Field>
                    <Field label="License / degree document"><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => { const file = e.target.files?.[0]; setFileName(file?.name || ''); if (file) setProfile((current) => ({ ...current, credentialName: file.name })) }} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-[#0D9488]" /><span className="mt-1 block text-xs font-normal text-slate-500">{fileName || profile.credentialName || 'PDF, JPG, or PNG · local filename only'}</span></Field>
                    <Field label="Scan fee (PKR 800–2,000)"><input type="number" min="800" max="2000" value={profile.fee} onChange={(e) => { setProfile({ ...profile, fee: Number(e.target.value) }); setFeeError('') }} className={inputClass} />{feeError && <span className="mt-1 block text-xs font-semibold text-rose-600">{feeError}</span>}</Field>
                    <Field label="Years of experience"><input type="number" min="0" max="50" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: Math.max(0, Number(e.target.value)) })} className={inputClass} /></Field>
                </div>
                <div><p className="mb-2 text-sm font-bold text-slate-700">Service modes</p><div className="grid gap-2 sm:grid-cols-2">{[{ field: 'clinicScans', label: 'Clinic / hospital scan slots' }, { field: 'homeScans', label: 'Portable home ultrasound service' }].map(({ field, label }) => <label key={field} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">{label}<input type="checkbox" checked={Boolean(profile[field])} onChange={(e) => setProfile({ ...profile, [field]: e.target.checked })} className="h-4 w-4 accent-[#0D9488]" /></label>)}</div></div>
                <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Credential verification is not connected. Files are not uploaded or persisted; only the selected filename may be saved in this browser.</p>
                <button type="submit" className={primaryButton}>Save specialist profile</button>
            </form>
        </Card>
        <Card title="Hospitals, imaging centers & service zones" icon="📍" description="Add facilities where you practice or areas served by portable home scans.">
            <div className="grid gap-3 sm:grid-cols-[1fr_180px_1fr_auto]">
                <input value={location.name} onChange={(e) => setLocation({ ...location, name: e.target.value })} placeholder="Facility or service-zone name" className={inputClass} />
                <select value={location.kind} onChange={(e) => setLocation({ ...location, kind: e.target.value })} className={inputClass}><option>Imaging center</option><option>Hospital</option><option>Clinic</option><option>Home service zone</option></select>
                <input value={location.city} onChange={(e) => setLocation({ ...location, city: e.target.value })} placeholder="City / area" className={inputClass} />
                <button type="button" onClick={addLocation} className={secondaryButton}>Add</button>
            </div>
            {data.workplaces.length > 0 && <ul className="mt-4 space-y-2">{data.workplaces.map((item) => <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm"><span><strong className="text-slate-800">{item.name}</strong><span className="ml-2 text-slate-500">{item.kind}{item.city ? ` · ${item.city}` : ''}</span></span><button type="button" onClick={() => updateData((current) => ({ ...current, workplaces: current.workplaces.filter((place) => place.id !== item.id) }))} className="font-semibold text-rose-600 hover:underline">Remove</button></li>)}</ul>}
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
    const setDuration = (day, duration) => updateData((current) => ({ ...current, availability: { ...current.availability, [day]: { ...current.availability[day], duration: Number(duration) } } }))
    return <Card title="Scanner availability" icon="📅" description="Set facility working days, scanner hours, and scan duration.">
        <div className="mb-4 flex flex-wrap gap-2 rounded-xl bg-teal-50 p-4 text-xs font-semibold text-teal-900"><span>⏱ Scan duration: 20 or 30 minutes</span><span className="hidden sm:inline">·</span><span>Slots from 09:00 AM to 03:00 PM</span></div>
        <div className="space-y-3">{DAYS.map((day) => {
            const schedule = data.availability[day] || { enabled: false, duration: 30, slots: [] }
            return <div key={day} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-bold text-slate-800">{day}</span>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span>Duration</span><select value={schedule.duration || 30} onChange={(e) => setDuration(day, e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1"><option value="20">20 min</option><option value="30">30 min</option></select></label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><input type="checkbox" checked={schedule.enabled} onChange={() => toggleDay(day)} className="h-4 w-4 accent-[#0D9488]" />{schedule.enabled ? 'Available' : 'Day off'}</label>
                    </div>
                </div>
                {schedule.enabled && <div className="flex flex-wrap gap-2">{TIME_SLOTS.map((slot) => <button key={slot} type="button" onClick={() => toggleSlot(day, slot)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${schedule.slots.includes(slot) ? 'border-[#0D9488] bg-[#0D9488] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-400'}`}>{slot}</button>)}</div>}
            </div>
        })}</div>
    </Card>
}

const AppointmentsTab = ({ data, updateData }) => {
    const [filter, setFilter] = useState('all')
    const [rescheduleId, setRescheduleId] = useState('')
    const [reportAppointment, setReportAppointment] = useState(null)
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
        showSuccessAlert('Scan Rescheduled', `The sample appointment for ${appointment.patientName} has been updated.`)
    }
    const saveReport = (event, appointment) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const values = Object.fromEntries([...formData.entries()].filter(([key]) => key !== 'files'))
        const files = formData.getAll('files').filter((file) => file instanceof File && file.size > 0).map((file) => file.name)
        if (!values.scanType?.trim() || !values.findings?.trim() || !values.impression?.trim()) {
            showErrorAlert('Required Report Details', 'Enter the scan type, findings, and impression before saving.')
            return
        }
        updateData((current) => ({
            ...current,
            reports: [...current.reports, { ...values, id: crypto.randomUUID(), appointmentId: appointment.id, patientName: appointment.patientName, fileNames: files, createdAt: new Date().toISOString() }],
            appointments: current.appointments.map((item) => item.id === appointment.id ? { ...item, status: 'report-pending' } : item),
        }))
        setReportAppointment(null)
        showSuccessAlert('Report Saved', 'The sample report was saved in this browser. It has not been sent to the patient.')
    }
    const statusChange = (appointment, status) => updateAppointment(appointment.id, { status })

    return <>
        <Card title="Appointment & scan booking queue" icon="🩻" description="Review requests and track each scan through reporting and completion.">
            <DemoNotice />
            <div className="mb-4 flex flex-wrap gap-2" aria-label="Filter appointments">{['all', 'pending', 'confirmed', 'in-progress', 'report-pending', 'completed', 'cancelled'].map((status) => <button key={status} type="button" onClick={() => setFilter(status)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === status ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{status === 'all' ? 'All' : STATUS_LABELS[status]}</button>)}</div>
            <div className="space-y-3">
                {appointments.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div><p className="font-bold text-[#0F172A]">{item.patientName}<span className="font-normal text-slate-500"> · {item.scan}</span></p><p className="mt-1 text-xs text-slate-500">{item.date} · {item.time} · {item.location}</p><p className="mt-1 text-xs font-semibold text-slate-600">PKR {item.fee}</p></div>
                        <StatusBadge status={item.status} />
                    </div>
                    {rescheduleId === item.id && <form onSubmit={(event) => submitReschedule(event, item)} className="mt-3 flex flex-wrap items-end gap-2 rounded-lg bg-slate-50 p-3"><Field label="New date"><input name="date" type="date" defaultValue={item.date} required className={inputClass} /></Field><Field label="New time"><input name="time" type="time" required className={inputClass} /></Field><button type="submit" className={primaryButton}>Save time</button><button type="button" onClick={() => setRescheduleId('')} className={secondaryButton}>Close</button></form>}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {item.status === 'pending' && <button type="button" onClick={() => statusChange(item, 'confirmed')} className={primaryButton}>Accept</button>}
                        {!['completed', 'cancelled'].includes(item.status) && <button type="button" onClick={() => setRescheduleId(rescheduleId === item.id ? '' : item.id)} className={secondaryButton}>Reschedule</button>}
                        {item.status === 'confirmed' && <button type="button" onClick={() => statusChange(item, 'in-progress')} className={secondaryButton}>Start scan</button>}
                        {['confirmed', 'in-progress'].includes(item.status) && <button type="button" onClick={() => setReportAppointment(item)} className={secondaryButton}>Create report</button>}
                        {item.status === 'report-pending' && <button type="button" onClick={() => statusChange(item, 'completed')} className={primaryButton}>Mark completed</button>}
                        {!['completed', 'cancelled'].includes(item.status) && <button type="button" onClick={() => statusChange(item, 'cancelled')} className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50">Cancel</button>}
                    </div>
                </article>)}
                {appointments.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No appointments in this status.</p>}
            </div>
        </Card>
        <Card title="Saved diagnostic reports" icon="📄" description="Reports entered in this browser for your sample scan bookings.">
            {data.reports.length ? <div className="space-y-3">{data.reports.map((report) => <article key={report.id} className="rounded-xl border border-slate-200 p-4"><p className="font-bold text-[#0F172A]">{report.patientName} · {report.scanType}</p><p className="mt-1 text-sm text-slate-600"><strong>Impression:</strong> {report.impression}</p><p className="mt-1 text-xs text-slate-500">{report.fileNames?.length ? `Selected files: ${report.fileNames.join(', ')}` : 'No image or document selected'}</p></article>)}</div> : <p className="text-sm text-slate-500">No reports saved yet.</p>}
        </Card>
        {reportAppointment && <ReportModal appointment={reportAppointment} onClose={() => setReportAppointment(null)} onSubmit={(event) => saveReport(event, reportAppointment)} />}
    </>
}

const ReportModal = ({ appointment, onClose, onSubmit }) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
        <section role="dialog" aria-modal="true" aria-labelledby="report-title" className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3"><div><h2 id="report-title" className="text-xl font-extrabold text-[#0F172A]">Diagnostic ultrasound report</h2><p className="mt-1 text-sm text-slate-500">{appointment.patientName} · {appointment.scan}</p></div><button type="button" onClick={onClose} aria-label="Close report" className="text-2xl leading-none text-slate-400">×</button></div>
            <form onSubmit={onSubmit} className="space-y-4">
                <Field label="Scan type"><input name="scanType" required defaultValue={appointment.scan} className={inputClass} /></Field>
                <Field label="Key findings"><textarea name="findings" rows="3" required placeholder="Document relevant diagnostic findings" className={inputClass} /></Field>
                <Field label="Impression"><textarea name="impression" rows="2" required placeholder="Summarize the diagnostic impression" className={inputClass} /></Field>
                <Field label="Clinical recommendation"><textarea name="recommendation" rows="2" placeholder="Optional clinical recommendation" className={inputClass} /></Field>
                <Field label="Images / DICOM / PDF attachments"><input name="files" type="file" multiple accept=".dcm,.dicom,.pdf,image/*" className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-[#0D9488]" /><span className="mt-1 block text-[11px] font-normal text-slate-500">Only filenames are saved. DICOM/image processing, secure storage, and patient delivery need a backend.</span></Field>
                <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Demo only: this report is stored locally in this browser and is not an official diagnostic record or sent to a patient.</p>
                <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className={secondaryButton}>Close</button><button type="submit" className={primaryButton}>Save report</button></div>
            </form>
        </section>
    </div>
)

const EarningsTab = ({ user, data }) => {
    const completed = data.appointments.filter((item) => item.status === 'completed')
    const gross = completed.reduce((sum, item) => sum + Number(item.fee || 0), 0)
    const commission = Math.round(gross * 0.07)
    const rating = data.reviews.length ? (data.reviews.reduce((sum, item) => sum + Number(item.rating), 0) / data.reviews.length).toFixed(1) : '—'
    const stats = [
        ['Completed scans', completed.length],
        ['Reports pending', data.appointments.filter((item) => item.status === 'report-pending').length],
        ['Cancelled bookings', data.appointments.filter((item) => item.status === 'cancelled').length],
        ['Average rating', `${rating} / 5`],
    ]
    return <div className="space-y-5">
        <Card title="Earnings & analytics" icon="💰" description="Sample totals use completed scans and a 7% platform commission estimate.">
            <DemoNotice />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-extrabold text-[#0F172A]">{value}</p></div>)}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3"><Amount label="Gross scan fees" value={gross} /><Amount label="Estimated commission (7%)" value={commission} /><Amount label="Estimated net payout" value={gross - commission} emphasized /></div>
            <p className="mt-3 text-xs text-slate-500">Account fee on signup: PKR {Number(user.fee) || 800}. Actual earnings and payouts are not connected to a payment system.</p>
        </Card>
        <Card title="Patient ratings & feedback" icon="⭐" description="Feedback shown here is illustrative sample content.">
            <div className="mb-4 rounded-xl bg-teal-50 p-4"><span className="text-2xl font-extrabold text-teal-800">{rating}</span><span className="ml-2 text-amber-500">{'★'.repeat(Math.round(Number(rating) || 0))}{'☆'.repeat(5 - Math.round(Number(rating) || 0))}</span><span className="ml-2 text-xs text-slate-500">{data.reviews.length} sample reviews</span></div>
            <div className="space-y-3">{data.reviews.map((review) => <article key={review.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-bold text-[#0F172A]">{review.patientName}</p><span className="text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div><p className="mt-1 text-sm text-slate-600">{review.feedback}</p></article>)}</div>
        </Card>
    </div>
}

const Amount = ({ label, value, emphasized }) => <div className={`rounded-xl p-4 ${emphasized ? 'bg-[#0D9488] text-white' : 'border border-slate-200 bg-white text-slate-800'}`}><p className={`text-xs font-semibold ${emphasized ? 'text-teal-100' : 'text-slate-500'}`}>{label}</p><p className="mt-1 text-xl font-extrabold">PKR {value}</p></div>
const DemoNotice = () => <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">Demo only: bookings, patient records, alerts, report delivery, credential verification, file uploads, and payouts are not connected to a live backend.</p>
const Field = ({ label, children }) => <label className="block text-xs font-bold text-slate-600">{label}<span className="mt-1 block">{children}</span></label>
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100'
const primaryButton = 'rounded-xl bg-[#0D9488] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0F766E]'
const secondaryButton = 'rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-teal-400 hover:text-[#0D9488]'

export default UltrasoundDashboard
