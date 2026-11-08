import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showErrorAlert, showSuccessAlert } from '../utils/alert'
import { SERVICE_CATEGORIES } from '../utils/feeRules'
import { getDashboardPath, isLabTechnicianAccount, isPharmacyManagerAccount } from '../utils/accountRoles'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const COLLECTION_SLOTS = [
    { id: 'morning', label: 'Morning', hours: '08:00 AM – 12:00 PM' },
    { id: 'evening', label: 'Evening', hours: '04:00 PM – 07:00 PM' },
]
const STATUS_LABELS = {
    pending: 'New request',
    confirmed: 'Confirmed',
    'en-route': 'En-route',
    'sample-collected': 'Sample collected',
    'delivered-to-lab': 'Delivered to lab',
    completed: 'Completed',
    cancelled: 'Cancelled',
}
const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-teal-100 text-teal-800',
    'en-route': 'bg-blue-100 text-blue-800',
    'sample-collected': 'bg-indigo-100 text-indigo-800',
    'delivered-to-lab': 'bg-violet-100 text-violet-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-rose-100 text-rose-800',
}

const dateOffset = (offset = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const createInitialData = () => ({
    affiliations: [],
    availability: Object.fromEntries(DAYS.map((day) => [day, { enabled: false, slots: [] }])),
    requests: [
        { id: 'LAB-5001', patientName: 'Hiba A.', type: 'Home sample collection', date: dateOffset(), time: '09:00 AM', location: 'Gulberg, Lahore', fee: 300, tests: ['Complete Blood Count (CBC)', 'Blood Sugar'], status: 'pending' },
        { id: 'LAB-5002', patientName: 'Omar K.', type: 'Home sample collection', date: dateOffset(), time: '11:00 AM', location: 'DHA, Lahore', fee: 400, tests: ['Lipid Profile'], status: 'confirmed' },
        { id: 'LAB-5003', patientName: 'Sara M.', type: 'Lab dispatch', date: dateOffset(), time: '01:00 PM', location: 'City Diagnostic Lab, Lahore', fee: 250, tests: ['Complete Blood Count (CBC)', 'Lipid Profile'], status: 'sample-collected' },
        { id: 'LAB-5004', patientName: 'Bilal R.', type: 'Home sample collection', date: dateOffset(-1), time: '08:30 AM', location: 'F-7, Islamabad', fee: 350, tests: ['Blood Sugar'], status: 'completed' },
        { id: 'LAB-5005', patientName: 'Ayesha T.', type: 'Urgent lab dispatch', date: dateOffset(-1), time: '04:30 PM', location: 'Clifton, Karachi', fee: 500, tests: ['Lipid Profile'], status: 'cancelled' },
    ],
    reports: [],
    reviews: [
        { id: 'REV-1', patientName: 'M. A.', rating: 5, feedback: 'Punctual and professional sample collection.' },
        { id: 'REV-2', patientName: 'S. K.', rating: 4, feedback: 'Careful, courteous, and explained the process clearly.' },
    ],
})

const storageKey = (user) => `carepoint_lab_technician_dashboard_${user.email || 'technician'}`

const loadData = (user) => {
    const saved = localStorage.getItem(storageKey(user))
    if (!saved) return createInitialData()
    try {
        const parsed = JSON.parse(saved)
        if (!parsed || typeof parsed !== 'object') throw new Error('Saved lab technician dashboard data must be an object.')
        const defaults = createInitialData()
        return {
            ...defaults,
            ...parsed,
            availability: { ...defaults.availability, ...parsed.availability },
            affiliations: Array.isArray(parsed.affiliations) ? parsed.affiliations : [],
            requests: Array.isArray(parsed.requests) ? parsed.requests : defaults.requests,
            reports: Array.isArray(parsed.reports) ? parsed.reports : [],
            reviews: Array.isArray(parsed.reviews) ? parsed.reviews : defaults.reviews,
        }
    } catch (error) {
        console.error('Unable to load lab technician dashboard data.', error)
        return createInitialData()
    }
}

const LabTechnicianDashboard = () => {
    const navigate = useNavigate()
    const [session] = useState(() => {
        const saved = localStorage.getItem('carepoint_user')
        if (!saved) return { status: 'unauthenticated', user: null, data: null }
        try {
            const user = JSON.parse(saved)
            if (!user || typeof user !== 'object') throw new Error('Saved CarePoint account must be an object.')
            if (isPharmacyManagerAccount(user) || !isLabTechnicianAccount(user)) return { status: 'unauthorized', user, data: null }
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
            console.error('Unable to save lab technician dashboard data.', error)
            showErrorAlert('Unable to Save', 'Your changes could not be saved in this browser. Please try again.')
        }
    }, [data, user])

    const updateData = (updater) => setData((current) => typeof updater === 'function' ? updater(current) : updater)
    const saveProfile = (updated) => {
        try {
            localStorage.setItem('carepoint_user', JSON.stringify(updated))
            setUser(updated)
            showSuccessAlert('Profile Updated', 'Your lab technician profile has been saved on this device.')
        } catch (error) {
            console.error('Unable to save lab technician profile.', error)
            showErrorAlert('Unable to Save', 'Your profile could not be saved in this browser. Please try again.')
        }
    }

    if (!user || !data) return null

    const navItems = [
        ['overview', '🏠', 'Overview'],
        ['profile', '🪪', 'Profile & Credentials'],
        ['availability', '📅', 'Availability'],
        ['requests', '🧪', 'Collections & Reports'],
        ['earnings', '💰', 'Earnings & Reviews'],
    ]

    return (
        <div className="min-h-full bg-slate-50/70 py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-[#0D9488]">CarePoint Provider Portal</p>
                        <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Lab Technician Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage sample collections, lab dispatches, schedules, and reports.</p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">Demo workspace · saved in this browser</span>
                </header>
                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="space-y-4">
                        <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-5 text-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-teal-300/40 bg-[#0D9488] text-xl font-extrabold">{user.name?.charAt(0)?.toUpperCase() || 'L'}</span>
                                <div className="min-w-0"><p className="truncate font-bold">{user.name || 'Lab Technician'}</p><p className="truncate text-xs text-teal-200">{SERVICE_CATEGORIES.lab_technician.label}</p></div>
                            </div>
                            <div className="mt-4 rounded-xl bg-white/10 p-3"><p className="text-xs text-slate-300">Collection service fee</p><p className="mt-1 text-xl font-extrabold text-teal-200">PKR {Number(user.fee) || 150}</p><p className="mt-1 text-[11px] text-slate-300">Test catalog charges are separate</p></div>
                        </div>
                        <nav aria-label="Lab technician dashboard sections" className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            {navItems.map(([id, icon, label]) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`w-full border-b border-slate-100 px-4 py-3.5 text-left text-sm font-semibold last:border-0 ${activeTab === id ? 'border-l-4 border-l-[#0D9488] bg-teal-50 text-[#0D9488]' : 'text-slate-600 hover:bg-slate-50'}`}><span className="mr-2">{icon}</span>{label}</button>)}
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
        <div className="mb-5"><h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]"><span>{icon}</span>{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>
        {children}
    </section>
)

const StatusBadge = ({ status }) => <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-700'}`}>{STATUS_LABELS[status] || status}</span>

const OverviewTab = ({ user, data, setActiveTab }) => {
    const todayRequests = data.requests.filter((item) => item.date === dateOffset() && item.status !== 'cancelled')
    const pendingDispatches = data.requests.filter((item) => ['en-route', 'sample-collected'].includes(item.status)).length
    const completed = data.requests.filter((item) => item.status === 'completed')
    const net = Math.round(completed.reduce((sum, item) => sum + Number(item.fee || 0), 0) * 0.93)
    const metrics = [
        ['New collection requests', data.requests.filter((item) => item.status === 'pending').length, '🛎️', 'bg-amber-50 text-amber-700'],
        ["Today's collection queue", todayRequests.length, '🧪', 'bg-teal-50 text-teal-700'],
        ['Pending lab dispatches', pendingDispatches, '🚚', 'bg-blue-50 text-blue-700'],
        ['Net earnings', `PKR ${net}`, '💰', 'bg-emerald-50 text-emerald-700'],
    ]
    return <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, icon, style]) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><span className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${style}`}>{icon}</span><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-extrabold text-[#0F172A]">{value}</p></div>)}</div>
        <Card title="Today’s collection queue" icon="🧪" description={`Welcome, ${user.name || 'Technician'}. Review your sample bookings and lab dispatches.`}>
            <DemoNotice />
            {todayRequests.length ? <div className="space-y-3">{todayRequests.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"><div><p className="font-bold text-[#0F172A]">{item.patientName}<span className="font-normal text-slate-500"> · {item.type}</span></p><p className="mt-1 text-xs text-slate-500">{item.time} · {item.location}</p></div><StatusBadge status={item.status} /></div>)}</div> : <p className="text-sm text-slate-500">No collections scheduled for today.</p>}
            <button type="button" onClick={() => setActiveTab('requests')} className="mt-4 text-sm font-bold text-[#0D9488] hover:underline">Manage collections →</button>
        </Card>
    </div>
}

const ProfileTab = ({ user, saveProfile, data, updateData }) => {
    const [profile, setProfile] = useState(() => ({
        name: user.name || '',
        gender: user.gender || '',
        specialty: user.specialty || '',
        qualification: user.qualification || '',
        licenseNumber: user.licenseNumber || '',
        credentialName: user.credentialName || '',
        fee: Number(user.fee) || 150,
        experience: Number(user.experience) || 0,
        homeCollection: user.homeCollection ?? true,
        urgentDispatch: Boolean(user.urgentDispatch),
    }))
    const [affiliation, setAffiliation] = useState({ name: '', kind: 'Diagnostic lab', city: '' })
    const [fileName, setFileName] = useState('')
    const [feeError, setFeeError] = useState('')

    const addAffiliation = () => {
        if (!affiliation.name.trim()) {
            showErrorAlert('Lab or Zone Required', 'Enter a diagnostic lab or service-zone name before adding it.')
            return
        }
        updateData((current) => ({ ...current, affiliations: [...current.affiliations, { ...affiliation, id: crypto.randomUUID(), name: affiliation.name.trim() }] }))
        setAffiliation({ name: '', kind: 'Diagnostic lab', city: '' })
    }

    const submit = (event) => {
        event.preventDefault()
        if (profile.fee < 150 || profile.fee > 500) {
            setFeeError('Collection service fees must be between PKR 150 and PKR 500.')
            return
        }
        saveProfile({ ...user, ...profile, role: 'lab_technician', category: 'lab_technician' })
    }

    return <div className="space-y-5">
        <Card title="Technician profile & credentials" icon="🪪" description="Set up your professional information and verification details.">
            <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Full name"><input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} /></Field>
                    <Field label="Gender"><select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className={inputClass}><option value="">Select</option><option>Female</option><option>Male</option><option>Prefer not to say</option></select></Field>
                    <Field label="Phlebotomy / lab certification"><input value={profile.specialty} onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} placeholder="e.g. Phlebotomy, MLT" className={inputClass} /></Field>
                    <Field label="Professional qualification"><input value={profile.qualification} onChange={(e) => setProfile({ ...profile, qualification: e.target.value })} placeholder="e.g. Diploma in Medical Laboratory Technology" className={inputClass} /></Field>
                    <Field label="License / registration number"><input value={profile.licenseNumber} onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })} className={inputClass} /></Field>
                    <Field label="License / diploma document"><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => { const file = e.target.files?.[0]; setFileName(file?.name || ''); if (file) setProfile((current) => ({ ...current, credentialName: file.name })) }} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-[#0D9488]" /><span className="mt-1 block text-xs font-normal text-slate-500">{fileName || profile.credentialName || 'PDF, JPG, or PNG · local filename only'}</span></Field>
                    <Field label="Collection service fee (PKR 150–500)"><input type="number" min="150" max="500" value={profile.fee} onChange={(e) => { setProfile({ ...profile, fee: Number(e.target.value) }); setFeeError('') }} className={inputClass} />{feeError && <span className="mt-1 block text-xs font-semibold text-rose-600">{feeError}</span>}<span className="mt-1 block text-xs font-normal text-slate-500">This is the collection service fee only. Lab test prices come from the test catalog.</span></Field>
                    <Field label="Years of experience"><input type="number" min="0" max="50" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: Math.max(0, Number(e.target.value)) })} className={inputClass} /></Field>
                </div>
                <div><p className="mb-2 text-sm font-bold text-slate-700">Service modes</p><div className="grid gap-2 sm:grid-cols-2">{[{ field: 'homeCollection', label: 'Home sample collection' }, { field: 'urgentDispatch', label: 'Urgent lab dispatch' }].map(({ field, label }) => <label key={field} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">{label}<input type="checkbox" checked={Boolean(profile[field])} onChange={(e) => setProfile({ ...profile, [field]: e.target.checked })} className="h-4 w-4 accent-[#0D9488]" /></label>)}</div></div>
                <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Credential verification is not connected. Files are not uploaded or persisted; only the selected filename may be saved in this browser.</p>
                <button type="submit" className={primaryButton}>Save technician profile</button>
            </form>
        </Card>
        <Card title="Lab affiliations & home collection zones" icon="📍" description="Add partner diagnostic labs or the areas where you collect samples.">
            <div className="grid gap-3 sm:grid-cols-[1fr_180px_1fr_auto]">
                <input value={affiliation.name} onChange={(e) => setAffiliation({ ...affiliation, name: e.target.value })} placeholder="Lab, diagnostic center, or service zone" className={inputClass} />
                <select value={affiliation.kind} onChange={(e) => setAffiliation({ ...affiliation, kind: e.target.value })} className={inputClass}><option>Diagnostic lab</option><option>Diagnostic center</option><option>Home service zone</option></select>
                <input value={affiliation.city} onChange={(e) => setAffiliation({ ...affiliation, city: e.target.value })} placeholder="City / area" className={inputClass} />
                <button type="button" onClick={addAffiliation} className={secondaryButton}>Add</button>
            </div>
            {data.affiliations.length > 0 && <ul className="mt-4 space-y-2">{data.affiliations.map((item) => <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm"><span><strong className="text-slate-800">{item.name}</strong><span className="ml-2 text-slate-500">{item.kind}{item.city ? ` · ${item.city}` : ''}</span></span><button type="button" onClick={() => updateData((current) => ({ ...current, affiliations: current.affiliations.filter((place) => place.id !== item.id) }))} className="font-semibold text-rose-600 hover:underline">Remove</button></li>)}</ul>}
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
    return <Card title="Collection availability" icon="📅" description="Choose days and home collection windows for your weekly schedule.">
        <div className="mb-4 flex flex-wrap gap-2 rounded-xl bg-teal-50 p-4 text-xs font-semibold text-teal-900"><span>Morning: 08:00 AM – 12:00 PM</span><span className="hidden sm:inline">·</span><span>Evening: 04:00 PM – 07:00 PM</span></div>
        <div className="space-y-3">{DAYS.map((day) => {
            const schedule = data.availability[day] || { enabled: false, slots: [] }
            return <div key={day} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between"><span className="font-bold text-slate-800">{day}</span><label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><input type="checkbox" checked={schedule.enabled} onChange={() => toggleDay(day)} className="h-4 w-4 accent-[#0D9488]" />{schedule.enabled ? 'Available' : 'Day off'}</label></div>
                {schedule.enabled && <div className="flex flex-wrap gap-2">{COLLECTION_SLOTS.map((slot) => <button key={slot.id} type="button" onClick={() => toggleSlot(day, slot.id)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${schedule.slots.includes(slot.id) ? 'border-[#0D9488] bg-[#0D9488] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-400'}`}>{slot.label} · {slot.hours}</button>)}</div>}
            </div>
        })}</div>
    </Card>
}

const RequestsTab = ({ data, updateData }) => {
    const [filter, setFilter] = useState('all')
    const [rescheduleId, setRescheduleId] = useState('')
    const requests = useMemo(() => data.requests.filter((item) => filter === 'all' || item.status === filter), [data.requests, filter])
    const updateRequest = (id, changes) => updateData((current) => ({ ...current, requests: current.requests.map((item) => item.id === id ? { ...item, ...changes } : item) }))
    const submitReschedule = (event, item) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const date = formData.get('date')
        const time = formData.get('time')
        if (!date || !time) return
        updateRequest(item.id, { date, time })
        setRescheduleId('')
        showSuccessAlert('Collection Rescheduled', `The sample booking for ${item.patientName} has been updated.`)
    }
    const saveReport = (event, item) => {
        event.preventDefault()
        const file = new FormData(event.currentTarget).get('report')
        if (!(file instanceof File) || file.size === 0 || !file.name.toLowerCase().endsWith('.pdf')) {
            showErrorAlert('PDF Report Required', 'Select a processed PDF report before completing this lab request.')
            return
        }
        updateData((current) => ({
            ...current,
            reports: [...current.reports, { id: crypto.randomUUID(), requestId: item.id, patientName: item.patientName, fileName: file.name, tests: item.tests, uploadedAt: new Date().toISOString() }],
            requests: current.requests.map((request) => request.id === item.id ? { ...request, status: 'completed' } : request),
        }))
        showSuccessAlert('Report Saved', 'The sample report filename was saved in this browser; it has not been uploaded or sent to the patient.')
    }

    return <div className="space-y-5">
        <Card title="Sample collection & lab dispatch queue" icon="🧪" description="Accept, reschedule, or cancel bookings and track each sample to the lab.">
            <DemoNotice />
            <div className="mb-4 flex flex-wrap gap-2" aria-label="Filter requests">{['all', 'pending', 'confirmed', 'en-route', 'sample-collected', 'delivered-to-lab', 'completed', 'cancelled'].map((status) => <button key={status} type="button" onClick={() => setFilter(status)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === status ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{status === 'all' ? 'All' : STATUS_LABELS[status]}</button>)}</div>
            <div className="space-y-3">
                {requests.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0"><p className="font-bold text-[#0F172A]">{item.patientName}<span className="font-normal text-slate-500"> · {item.type}</span></p><p className="mt-1 text-xs text-slate-500">{item.date} · {item.time} · {item.location}</p><p className="mt-1 text-xs font-semibold text-slate-600">Collection service fee: PKR {item.fee}</p><div className="mt-2 flex flex-wrap gap-1.5">{item.tests.map((test) => <span key={test} className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-800">{test}</span>)}</div></div>
                        <StatusBadge status={item.status} />
                    </div>
                    {rescheduleId === item.id && <form onSubmit={(event) => submitReschedule(event, item)} className="mt-3 flex flex-wrap items-end gap-2 rounded-lg bg-slate-50 p-3"><Field label="New date"><input name="date" type="date" defaultValue={item.date} required className={inputClass} /></Field><Field label="New time"><input name="time" type="time" required className={inputClass} /></Field><button type="submit" className={primaryButton}>Save time</button><button type="button" onClick={() => setRescheduleId('')} className={secondaryButton}>Close</button></form>}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {item.status === 'pending' && <button type="button" onClick={() => updateRequest(item.id, { status: 'confirmed' })} className={primaryButton}>Accept</button>}
                        {!['completed', 'cancelled'].includes(item.status) && <button type="button" onClick={() => setRescheduleId(rescheduleId === item.id ? '' : item.id)} className={secondaryButton}>Reschedule</button>}
                        {item.status === 'confirmed' && <button type="button" onClick={() => updateRequest(item.id, { status: 'en-route' })} className={secondaryButton}>Start collection · En-route</button>}
                        {item.status === 'en-route' && <button type="button" onClick={() => updateRequest(item.id, { status: 'sample-collected' })} className={secondaryButton}>Mark sample collected</button>}
                        {item.status === 'sample-collected' && <button type="button" onClick={() => updateRequest(item.id, { status: 'delivered-to-lab' })} className={secondaryButton}>Mark delivered to lab</button>}
                        {item.status === 'delivered-to-lab' && <form onSubmit={(event) => saveReport(event, item)} className="flex flex-wrap items-end gap-2 rounded-lg bg-slate-50 p-3"><Field label="Processed lab report (PDF)"><input name="report" type="file" accept=".pdf,application/pdf" required className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-[#0D9488]" /></Field><button type="submit" className={primaryButton}>Save report & complete</button></form>}
                        {!['completed', 'cancelled'].includes(item.status) && <button type="button" onClick={() => updateRequest(item.id, { status: 'cancelled' })} className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50">Cancel</button>}
                    </div>
                </article>)}
                {requests.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No requests in this status.</p>}
            </div>
        </Card>
        <Card title="Saved lab reports" icon="📄" description="Report metadata associated with sample orders.">
            {data.reports.length ? <div className="space-y-3">{data.reports.map((report) => <article key={report.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-[#0F172A]">{report.patientName} · {report.requestId}</p><span className="text-xs text-slate-500">{new Date(report.uploadedAt).toLocaleDateString()}</span></div><p className="mt-1 text-sm text-slate-600">PDF: {report.fileName}</p><p className="mt-1 text-xs text-slate-500">Tests: {report.tests.join(', ')}</p></article>)}</div> : <p className="text-sm text-slate-500">No reports saved yet.</p>}
        </Card>
    </div>
}

const EarningsTab = ({ user, data }) => {
    const completed = data.requests.filter((item) => item.status === 'completed')
    const gross = completed.reduce((sum, item) => sum + Number(item.fee || 0), 0)
    const commission = Math.round(gross * 0.07)
    const rating = data.reviews.length ? (data.reviews.reduce((sum, item) => sum + Number(item.rating), 0) / data.reviews.length).toFixed(1) : '—'
    const stats = [
        ['Completed home collections', completed.length],
        ['Pending dispatches', data.requests.filter((item) => ['en-route', 'sample-collected'].includes(item.status)).length],
        ['Cancelled requests', data.requests.filter((item) => item.status === 'cancelled').length],
        ['Average rating', `${rating} / 5`],
    ]
    return <div className="space-y-5">
        <Card title="Earnings & analytics" icon="💰" description="Earnings are calculated from collection fees only; test catalog costs are excluded.">
            <DemoNotice />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-extrabold text-[#0F172A]">{value}</p></div>)}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3"><Amount label="Gross service fees" value={gross} /><Amount label="Estimated commission (7%)" value={commission} /><Amount label="Estimated net payout" value={gross - commission} emphasized /></div>
            <p className="mt-3 text-xs text-slate-500">Your collection service fee is PKR {Number(user.fee) || 150}. Actual earnings and payouts are not connected to a payment system.</p>
        </Card>
        <Card title="Patient ratings & feedback" icon="⭐" description="Feedback here is illustrative sample content for punctuality and collection professionalism.">
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

export default LabTechnicianDashboard
