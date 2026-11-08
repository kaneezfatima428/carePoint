import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showErrorAlert, showSuccessAlert } from '../utils/alert'
import { SERVICE_CATEGORIES } from '../utils/feeRules'
import { getDashboardPath, isDietitianAccount, isLabTechnicianAccount, isPharmacyManagerAccount, isPhysiotherapistAccount, isUltrasoundAccount } from '../utils/accountRoles'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIME_SLOTS = ['09:00 AM – 01:00 PM', '04:00 PM – 08:00 PM', '08:00 PM – 10:00 PM']
const SERVICE_MODES = [
    { field: 'homeVisit', label: 'Home visits' },
    { field: 'rehabSessions', label: 'Rehabilitation sessions' },
    { field: 'urgentCalls', label: 'Urgent pain relief calls' },
]

const localDate = (offset = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const createInitialData = () => ({
    workplaces: [],
    availability: Object.fromEntries(DAYS.map((day) => [day, { enabled: false, slots: [] }])),
    requests: [
        { id: 'PT-2001', patientName: 'Hiba A.', service: 'Home visit · post-operative mobility', date: localDate(), time: '10:00 AM', location: 'Gulberg, Lahore', fee: 1500, status: 'pending' },
        { id: 'PT-2002', patientName: 'Omar K.', service: 'Rehab session · lower back pain', date: localDate(), time: '04:00 PM', location: 'DHA, Lahore', fee: 1200, status: 'confirmed' },
        { id: 'PT-2003', patientName: 'Sara M.', service: 'Sports recovery · knee mobility', date: localDate(-1), time: '11:00 AM', location: 'Clifton, Karachi', fee: 1800, status: 'completed' },
        { id: 'PT-2004', patientName: 'Bilal R.', service: 'Urgent pain relief · shoulder', date: localDate(-1), time: '06:00 PM', location: 'F-7, Islamabad', fee: 1600, status: 'cancelled' },
    ],
    rehabPlans: [],
})

const storageKey = (user) => `carepoint_physio_dashboard_${user.email || 'physiotherapist'}`

const readData = (user) => {
    const saved = localStorage.getItem(storageKey(user))
    if (!saved) return createInitialData()
    try {
        const parsed = JSON.parse(saved)
        if (!parsed || typeof parsed !== 'object') throw new Error('Saved physiotherapy dashboard data must be an object.')
        const initial = createInitialData()
        return {
            ...initial,
            ...parsed,
            availability: { ...initial.availability, ...parsed.availability },
            workplaces: Array.isArray(parsed.workplaces) ? parsed.workplaces : [],
            requests: Array.isArray(parsed.requests) ? parsed.requests : initial.requests,
            rehabPlans: Array.isArray(parsed.rehabPlans) ? parsed.rehabPlans : [],
        }
    } catch (error) {
        console.error('Unable to load physiotherapist dashboard data.', error)
        return createInitialData()
    }
}

const PhysiotherapistDashboard = () => {
    const navigate = useNavigate()
    const [session] = useState(() => {
        const saved = localStorage.getItem('carepoint_user')
        if (!saved) return { status: 'unauthenticated', user: null, data: null }
        try {
            const user = JSON.parse(saved)
            if (!user || typeof user !== 'object') throw new Error('Saved CarePoint account must be an object.')
            if (isDietitianAccount(user) || isUltrasoundAccount(user) || isLabTechnicianAccount(user) || isPharmacyManagerAccount(user) || !isPhysiotherapistAccount(user)) return { status: 'unauthorized', user, data: null }
            return { status: 'ready', user, data: readData(user) }
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
            console.error('Unable to save physiotherapist dashboard data.', error)
            showErrorAlert('Unable to Save', 'Your changes could not be saved in this browser. Please try again.')
        }
    }, [data, user])

    const updateData = (updater) => setData((current) => typeof updater === 'function' ? updater(current) : updater)

    const saveProfile = (updated) => {
        try {
            localStorage.setItem('carepoint_user', JSON.stringify(updated))
            setUser(updated)
            showSuccessAlert('Profile Updated', 'Your physiotherapist profile has been saved on this device.')
        } catch (error) {
            console.error('Unable to save the physiotherapist profile.', error)
            showErrorAlert('Unable to Save', 'Your profile could not be saved in this browser. Please try again.')
        }
    }

    if (!user || !data) return null

    const navItems = [
        ['overview', '🏠', 'Overview'],
        ['profile', '🪪', 'Profile & Credentials'],
        ['availability', '📅', 'Availability'],
        ['requests', '🗓️', 'Appointments & Queue'],
        ['earnings', '💰', 'Earnings & Reviews'],
    ]

    return (
        <div className="min-h-full bg-slate-50/70 py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-[#0D9488]">CarePoint Provider Portal</p>
                        <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Physiotherapist Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage your profile, rehabilitation sessions, schedule, and earnings.</p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">Demo workspace · saved in this browser</span>
                </header>

                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="space-y-4">
                        <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-5 text-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-teal-300/40 bg-[#0D9488] text-xl font-extrabold">{user.name?.charAt(0)?.toUpperCase() || 'P'}</span>
                                <div className="min-w-0">
                                    <p className="truncate font-bold">{user.name}</p>
                                    <p className="truncate text-xs text-teal-200">{SERVICE_CATEGORIES[user.category]?.label || 'Physiotherapist'}</p>
                                </div>
                            </div>
                            <div className="mt-4 rounded-xl bg-white/10 p-3">
                                <p className="text-xs text-slate-300">Session fee</p>
                                <p className="mt-1 text-xl font-extrabold text-teal-200">PKR {Number(user.fee) || 600}</p>
                                <p className="mt-1 text-[11px] text-slate-300">{user.experience || 0} years of experience</p>
                            </div>
                        </div>
                        <nav aria-label="Physiotherapist dashboard sections" className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            {navItems.map(([id, icon, label]) => (
                                <button key={id} type="button" onClick={() => setActiveTab(id)} className={`w-full border-b border-slate-100 px-4 py-3.5 text-left text-sm font-semibold last:border-0 ${
                                    activeTab === id ? 'border-l-4 border-l-[#0D9488] bg-teal-50 text-[#0D9488]' : 'text-slate-600 hover:bg-slate-50'
                                }`}><span className="mr-2">{icon}</span>{label}</button>
                            ))}
                        </nav>
                    </aside>

                    <main className="min-w-0">
                        {activeTab === 'overview' && <OverviewTab user={user} data={data} setActiveTab={setActiveTab} />}
                        {activeTab === 'profile' && <ProfileTab user={user} saveProfile={saveProfile} data={data} updateData={updateData} />}
                        {activeTab === 'availability' && <AvailabilityTab data={data} updateData={updateData} />}
                        {activeTab === 'requests' && <RequestsTab data={data} updateData={updateData} />}
                        {activeTab === 'earnings' && <EarningsTab user={user} data={data} />}
                    </main>
                </div>
            </div>
        </div>
    )
}

const Card = ({ title, icon, description, children }) => (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]"><span>{icon}</span>{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {children}
    </section>
)

const StatusBadge = ({ status }) => {
    const colors = {
        pending: 'bg-amber-100 text-amber-800',
        confirmed: 'bg-teal-100 text-teal-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        completed: 'bg-emerald-100 text-emerald-800',
        cancelled: 'bg-rose-100 text-rose-800',
    }
    return <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${colors[status] || 'bg-slate-100 text-slate-700'}`}>{status.replace('-', ' ')}</span>
}

const OverviewTab = ({ user, data, setActiveTab }) => {
    const todays = data.requests.filter((item) => item.date === localDate() && item.status !== 'cancelled')
    const completed = data.requests.filter((item) => item.status === 'completed')
    const net = Math.round(completed.reduce((sum, item) => sum + Number(item.fee || 0), 0) * 0.93)
    return (
        <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    ['New requests', data.requests.filter((item) => item.status === 'pending').length, '🛎️', 'bg-amber-50 text-amber-700'],
                    ["Today's sessions", todays.length, '🧑‍⚕️', 'bg-teal-50 text-teal-700'],
                    ['Completed programs', completed.length, '✓', 'bg-emerald-50 text-emerald-700'],
                    ['Net earnings', `PKR ${net}`, '💰', 'bg-blue-50 text-blue-700'],
                ].map(([label, value, icon, color]) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <span className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>{icon}</span>
                    <p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-extrabold text-[#0F172A]">{value}</p>
                </div>)}
            </div>
            <Card title="Today’s patient queue" icon="🗓️" description={`Welcome, ${user.name}. Review your scheduled sessions.`}>
                <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">Bookings and notifications are sample data only. Live patient communication requires a connected backend.</p>
                {todays.length ? <div className="space-y-3">{todays.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4">
                    <div><p className="font-bold text-[#0F172A]">{item.patientName}<span className="font-normal text-slate-500"> · {item.service}</span></p><p className="mt-1 text-xs text-slate-500">{item.time} · {item.location}</p></div><StatusBadge status={item.status} />
                </div>)}</div> : <p className="text-sm text-slate-500">No sessions scheduled for today.</p>}
                <button type="button" onClick={() => setActiveTab('requests')} className="mt-4 text-sm font-bold text-[#0D9488] hover:underline">Manage appointments →</button>
            </Card>
        </div>
    )
}

const ProfileTab = ({ user, saveProfile, data, updateData }) => {
    const category = ['general_physio', 'sports_physio'].includes(user.category) ? user.category : 'general_physio'
    const [profile, setProfile] = useState({
        name: user.name || '',
        gender: user.gender || 'female',
        category,
        specialty: user.specialty || '',
        qualification: user.qualification || '',
        licenseNumber: user.licenseNumber || '',
        licenseDocumentName: user.licenseDocumentName || '',
        fee: Number(user.fee) || SERVICE_CATEGORIES[category].minFee,
        experience: Number(user.experience) || 0,
        phone: user.phone || '',
        email: user.email || '',
        serviceModes: { homeVisit: true, rehabSessions: true, urgentCalls: false, ...user.serviceModes },
    })
    const [fileName, setFileName] = useState('')
    const [feeError, setFeeError] = useState('')
    const [workplace, setWorkplace] = useState({ name: '', kind: 'Home visit zone' })
    const bounds = SERVICE_CATEGORIES[profile.category].getBounds(profile.experience)

    const changeCategory = (nextCategory) => {
        const nextBounds = SERVICE_CATEGORIES[nextCategory].getBounds(profile.experience)
        setProfile((current) => ({ ...current, category: nextCategory, fee: Math.max(nextBounds.min, Math.min(current.fee, nextBounds.max)) }))
        setFeeError('')
    }

    const submitProfile = (event) => {
        event.preventDefault()
        const allowed = SERVICE_CATEGORIES[profile.category].getBounds(profile.experience)
        if (profile.fee < allowed.min || profile.fee > allowed.max) {
            setFeeError(`Select a session fee from PKR ${allowed.min} to PKR ${allowed.max}.`)
            return
        }
        saveProfile({
            ...user,
            ...profile,
            role: 'physiotherapist',
            fee: Number(profile.fee),
            experience: Number(profile.experience),
        })
    }

    const addWorkplace = () => {
        if (!workplace.name.trim()) return
        updateData((current) => ({ ...current, workplaces: [...current.workplaces, { id: crypto.randomUUID(), ...workplace, name: workplace.name.trim() }] }))
        setWorkplace({ name: '', kind: 'Home visit zone' })
    }

    return <div className="space-y-5">
        <Card title="Professional profile & credentials" icon="🪪" description="License files remain in this browser demo and are not submitted for verification.">
            <form onSubmit={submitProfile} className="space-y-5">
                <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">Credential verification status: {user.verificationStatus || 'Pending review'}. An administrator must review your license before it can be verified.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name"><input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} /></Field>
                    <Field label="Gender"><select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className={inputClass}><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select></Field>
                    <Field label="Physiotherapy specialization"><input required value={profile.specialty} onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} placeholder="e.g. Musculoskeletal, Neurological Rehab" className={inputClass} /></Field>
                    <Field label="Degree / qualification"><input value={profile.qualification} onChange={(e) => setProfile({ ...profile, qualification: e.target.value })} placeholder="e.g. DPT, MSc Sports Rehabilitation" className={inputClass} /></Field>
                    <Field label="Professional category"><select value={profile.category} onChange={(e) => changeCategory(e.target.value)} className={inputClass}><option value="general_physio">General Physiotherapist</option><option value="sports_physio">Sports Physiotherapist</option></select></Field>
                    <Field label="Years of experience"><input type="number" min="0" max="50" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: Math.max(0, Number(e.target.value)) })} className={inputClass} /></Field>
                    <Field label={`Session fee (PKR ${bounds.min}–${bounds.max})`}><input type="number" min={bounds.min} max={bounds.max} value={profile.fee} onChange={(e) => { setProfile({ ...profile, fee: Number(e.target.value) }); setFeeError('') }} className={inputClass} />{feeError && <p className="mt-1 text-xs font-semibold text-rose-600">{feeError}</p>}<p className="mt-1 text-xs text-slate-500">{bounds.note}</p></Field>
                    <Field label="License / professional registration number"><input required value={profile.licenseNumber} onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })} placeholder="Enter registration or license number" className={inputClass} /></Field>
                    <Field label="License or degree document"><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => { const file = e.target.files?.[0]; setFileName(file?.name || ''); if (file) setProfile((current) => ({ ...current, licenseDocumentName: file.name })) }} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-[#0D9488]" /><p className="mt-1 text-xs text-slate-500">{fileName || profile.licenseDocumentName || 'PDF, JPG, or PNG · local preview only'}</p></Field>
                    <Field label="Phone"><input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} /></Field>
                    <Field label="Email"><input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} /></Field>
                </div>
                <div><p className="mb-2 text-sm font-bold text-slate-700">Service modes</p><div className="grid gap-2 sm:grid-cols-3">{SERVICE_MODES.map(({ field, label }) => <label key={field} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">{label}<input type="checkbox" checked={Boolean(profile.serviceModes[field])} onChange={(e) => setProfile({ ...profile, serviceModes: { ...profile.serviceModes, [field]: e.target.checked } })} className="h-4 w-4 accent-[#0D9488]" /></label>)}</div></div>
                <button type="submit" className={primaryButton}>Save physiotherapist profile</button>
            </form>
        </Card>
        <Card title="Clinics, hospitals & home visit zones" icon="📍" description="Add multiple practice locations or areas you serve.">
            <div className="grid gap-3 sm:grid-cols-[1fr_190px_auto]"><input value={workplace.name} onChange={(e) => setWorkplace({ ...workplace, name: e.target.value })} placeholder="Clinic, hospital, or service area" className={inputClass} /><select value={workplace.kind} onChange={(e) => setWorkplace({ ...workplace, kind: e.target.value })} className={inputClass}><option>Home visit zone</option><option>Hospital</option><option>Clinic</option></select><button type="button" onClick={addWorkplace} className={secondaryButton}>Add</button></div>
            {data.workplaces.length > 0 && <ul className="mt-4 space-y-2">{data.workplaces.map((item) => <li key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span><strong className="text-slate-800">{item.name}</strong><span className="ml-2 text-slate-500">{item.kind}</span></span><button type="button" onClick={() => updateData((current) => ({ ...current, workplaces: current.workplaces.filter((place) => place.id !== item.id) }))} className="font-semibold text-rose-600 hover:underline">Remove</button></li>)}</ul>}
        </Card>
    </div>
}

const AvailabilityTab = ({ data, updateData }) => {
    const toggleDay = (day) => updateData((current) => ({ ...current, availability: { ...current.availability, [day]: { ...current.availability[day], enabled: !current.availability[day].enabled } } }))
    const toggleSlot = (day, slot) => updateData((current) => {
        const plan = current.availability[day]
        const slots = plan.slots.includes(slot) ? plan.slots.filter((item) => item !== slot) : [...plan.slots, slot]
        return { ...current, availability: { ...current.availability, [day]: { ...plan, enabled: true, slots } } }
    })
    return <Card title="Weekly availability & session slots" icon="📅" description="Choose clinic hours and time slots when patients can request a session.">
        <div className="space-y-3">{DAYS.map((day) => {
            const plan = data.availability[day] || { enabled: false, slots: [] }
            return <div key={day} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between"><span className="font-bold text-slate-800">{day}</span><label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><input type="checkbox" checked={plan.enabled} onChange={() => toggleDay(day)} className="h-4 w-4 accent-[#0D9488]" />{plan.enabled ? 'Available' : 'Day off'}</label></div>
                {plan.enabled && <div className="flex flex-wrap gap-2">{TIME_SLOTS.map((slot) => <button key={slot} type="button" onClick={() => toggleSlot(day, slot)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${plan.slots.includes(slot) ? 'border-[#0D9488] bg-[#0D9488] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-400'}`}>{slot}</button>)}</div>}
            </div>
        })}</div>
    </Card>
}

const RequestsTab = ({ data, updateData }) => {
    const [filter, setFilter] = useState('all')
    const [rescheduleId, setRescheduleId] = useState('')
    const [activePatient, setActivePatient] = useState(null)
    const requests = useMemo(() => data.requests.filter((item) => filter === 'all' || item.status === filter), [data.requests, filter])
    const updateRequest = (id, changes) => updateData((current) => ({ ...current, requests: current.requests.map((item) => item.id === id ? { ...item, ...changes } : item) }))
    const requestReschedule = (event, item) => {
        event.preventDefault()
        const values = new FormData(event.currentTarget)
        const date = values.get('date')
        const time = values.get('time')
        if (!date || !time) return
        updateRequest(item.id, { date, time })
        setRescheduleId('')
        showSuccessAlert('Session Rescheduled', `The sample appointment for ${item.patientName} has been updated.`)
    }
    const saveRehabPlan = (event) => {
        event.preventDefault()
        const values = Object.fromEntries(new FormData(event.currentTarget).entries())
        updateData((current) => ({
            ...current,
            rehabPlans: [...current.rehabPlans, { ...values, id: crypto.randomUUID(), requestId: activePatient.id, patientName: activePatient.patientName, createdAt: new Date().toISOString() }],
            requests: current.requests.map((item) => item.id === activePatient.id && item.status === 'confirmed' ? { ...item, status: 'in-progress' } : item),
        }))
        setActivePatient(null)
        showSuccessAlert('Rehabilitation Plan Saved', 'The exercise plan was saved in this browser demo. It was not sent to a patient.')
    }

    return <>
        <Card title="Appointment requests & session queue" icon="🗓️" description="Accept, reschedule, or cancel requests and track current rehabilitation sessions.">
            <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">These appointments are sample records only. Live booking alerts and patient messaging are not connected.</p>
            <div className="mb-4 flex flex-wrap gap-2">{['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => <button key={status} type="button" onClick={() => setFilter(status)} className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${filter === status ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{status.replace('-', ' ')}</button>)}</div>
            <div className="space-y-3">{requests.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[#0F172A]">{item.patientName}</h3><StatusBadge status={item.status} /></div><p className="mt-1 text-sm text-slate-600">{item.service}</p><p className="mt-1 text-xs text-slate-500">{item.date} at {item.time} · {item.location} · PKR {item.fee}</p></div><span className="text-xs font-semibold text-slate-400">{item.id}</span></div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {item.status === 'pending' && <><button type="button" onClick={() => { updateRequest(item.id, { status: 'confirmed' }); showSuccessAlert('Session Accepted', `${item.patientName}'s sample request has been accepted.`) }} className={smallPrimary}>✓ Accept</button><button type="button" onClick={() => setRescheduleId(rescheduleId === item.id ? '' : item.id)} className={smallNeutral}>↻ Reschedule</button><button type="button" onClick={() => { updateRequest(item.id, { status: 'cancelled' }); showSuccessAlert('Request Cancelled', 'The sample request was marked cancelled.') }} className={smallDanger}>Cancel</button></>}
                    {item.status === 'confirmed' && <><button type="button" onClick={() => updateRequest(item.id, { status: 'in-progress' })} className={smallPrimary}>Start session</button><button type="button" onClick={() => setRescheduleId(rescheduleId === item.id ? '' : item.id)} className={smallNeutral}>↻ Reschedule</button><button type="button" onClick={() => { updateRequest(item.id, { status: 'cancelled' }); showSuccessAlert('Request Cancelled', 'The sample request was marked cancelled.') }} className={smallDanger}>Cancel</button></>}
                    {['confirmed', 'in-progress'].includes(item.status) && <><button type="button" onClick={() => setActivePatient(item)} className={smallNeutral}>🏋️ Exercise plan</button><button type="button" onClick={() => { updateRequest(item.id, { status: 'completed' }); showSuccessAlert('Session Completed', 'The sample session has been marked complete.') }} className={smallPrimary}>Mark completed</button></>}
                    {data.rehabPlans.some((plan) => plan.requestId === item.id) && <span className="self-center text-xs font-semibold text-teal-700">✓ Rehab plan recorded</span>}
                </div>
                {rescheduleId === item.id && <form onSubmit={(event) => requestReschedule(event, item)} className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]"><label className="text-xs font-semibold text-slate-600">New date<input name="date" type="date" required defaultValue={item.date} className={inputClass} /></label><label className="text-xs font-semibold text-slate-600">New time<input name="time" type="time" required className={inputClass} /></label><button type="submit" className={`${smallPrimary} self-end`}>Save time</button></form>}
            </article>)}{requests.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No appointments in this status.</p>}</div>
        </Card>
        {activePatient && <RehabPlanModal patient={activePatient} onClose={() => setActivePatient(null)} onSubmit={saveRehabPlan} />}
    </>
}

const RehabPlanModal = ({ patient, onClose, onSubmit }) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
        <section role="dialog" aria-modal="true" aria-labelledby="rehab-plan-title" className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3"><div><h2 id="rehab-plan-title" className="text-xl font-extrabold text-[#0F172A]">Exercise prescription & rehab plan</h2><p className="mt-1 text-sm text-slate-500">{patient.patientName} · {patient.service}</p></div><button type="button" onClick={onClose} aria-label="Close rehabilitation plan" className="text-2xl leading-none text-slate-400">×</button></div>
            <form onSubmit={onSubmit} className="space-y-4">
                <Field label="Exercise / movement"><input name="exercise" required placeholder="e.g. Seated knee extension" className={inputClass} /></Field>
                <div className="grid gap-3 sm:grid-cols-3"><Field label="Sets"><input name="sets" type="number" min="1" defaultValue="3" className={inputClass} /></Field><Field label="Reps / duration"><input name="reps" required placeholder="e.g. 10 reps" className={inputClass} /></Field><Field label="Frequency"><input name="frequency" placeholder="e.g. Twice daily" className={inputClass} /></Field></div>
                <Field label="Posture & safety guidelines"><textarea name="posture" rows="2" placeholder="Alignment, precautions, and when to stop" className={inputClass} /></Field>
                <Field label="Session notes & home program"><textarea name="notes" rows="3" placeholder="Progress, goals, and follow-up plan" className={inputClass} /></Field>
                <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Demo only: the plan is saved locally and is not transmitted to a patient. Clinical plans should be tailored by a licensed professional.</p>
                <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className={secondaryButton}>Close</button><button type="submit" className={primaryButton}>Save exercise plan</button></div>
            </form>
        </section>
    </div>
)

const EarningsTab = ({ user, data }) => {
    const completed = data.requests.filter((item) => item.status === 'completed')
    const gross = completed.reduce((sum, item) => sum + Number(item.fee || 0), 0)
    const commission = Math.round(gross * 0.07)
    const accepted = data.requests.filter((item) => ['confirmed', 'in-progress', 'completed'].includes(item.status)).length
    const cancelled = data.requests.filter((item) => item.status === 'cancelled').length
    const reviews = [
        { name: 'S. Ahmed', rating: 5, comment: 'Clear instructions and a thoughtful recovery plan.' },
        { name: 'M. Khan', rating: 5, comment: 'Professional, patient, and encouraging throughout therapy.' },
        { name: 'A. Raza', rating: 4, comment: 'Helpful session and practical home exercises.' },
    ]
    return <div className="space-y-5">
        <Card title="Earnings & activity" icon="💰" description="Illustrative totals use the completed sample sessions.">
            <div className="grid gap-3 sm:grid-cols-3"><Metric label="Accepted sessions" value={accepted} /><Metric label="Completed programs" value={completed.length} /><Metric label="Cancelled requests" value={cancelled} /></div>
            <div className="mt-5 grid gap-3 rounded-xl bg-teal-50 p-4 sm:grid-cols-3"><Metric label="Completed session fees" value={`PKR ${gross}`} /><Metric label="Platform commission · 7%" value={`− PKR ${commission}`} /><Metric label="Estimated net payout" value={`PKR ${gross - commission}`} emphasized /></div>
            <p className="mt-3 text-xs text-slate-500">Payments, taxes, and payout settlement are not connected in this demo.</p>
        </Card>
        <Card title="Patient ratings & feedback" icon="⭐" description="Sample reviews for dashboard preview only.">
            <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 p-4"><p className="text-3xl font-extrabold text-[#0F172A]">4.8 <span className="text-lg text-amber-400">★★★★★</span></p><p className="mt-1 text-xs text-slate-500">Average demo rating · not linked to live patient reviews.</p></div>
            <div className="space-y-3">{reviews.map((review) => <div key={review.name} className="rounded-xl border border-slate-100 p-4"><div className="flex items-center justify-between"><p className="font-bold text-slate-800">{review.name}</p><p className="text-amber-400">{'★'.repeat(review.rating)}<span className="text-slate-200">{'★'.repeat(5 - review.rating)}</span></p></div><p className="mt-2 text-sm text-slate-600">{review.comment}</p></div>)}</div>
            <p className="mt-4 text-xs text-slate-500">Profile: {user.name} · {user.specialty || 'Physiotherapist'}</p>
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

export default PhysiotherapistDashboard
