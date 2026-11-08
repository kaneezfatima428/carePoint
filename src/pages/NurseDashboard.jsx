import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showErrorAlert, showSuccessAlert } from '../utils/alert'
import { SERVICE_CATEGORIES } from '../utils/feeRules'
import { getDashboardPath, isDietitianAccount, isLabTechnicianAccount, isNurseAccount, isPharmacyManagerAccount, isPhysiotherapistAccount, isUltrasoundAccount } from '../utils/accountRoles'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SHIFTS = ['Morning', 'Evening', 'Night', '12-hour bedside', '24-hour bedside']
const SERVICE_MODES = [
    { field: 'homeVisit', label: 'Home visits' },
    { field: 'bedsideCare', label: 'Bedside care' },
    { field: 'emergencyCall', label: 'Emergency calls' },
    { field: 'nightShifts', label: 'Night shifts' },
]

const getDateOffset = (days) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const createInitialData = () => ({
    workplaces: [],
    availability: Object.fromEntries(DAYS.map((day) => [day, { enabled: false, shifts: [] }])),
    requests: [
        {
            id: 'NUR-1001',
            patientName: 'Amina R.',
            service: 'Home visit · wound dressing',
            date: getDateOffset(0),
            time: '10:00',
            status: 'pending',
            fee: 1200,
            location: 'Gulberg, Lahore',
        },
        {
            id: 'NUR-1002',
            patientName: 'Hassan M.',
            service: 'Bedside care · 12-hour shift',
            date: getDateOffset(0),
            time: '14:00',
            status: 'confirmed',
            fee: 1800,
            location: 'Clifton, Karachi',
        },
        {
            id: 'NUR-1003',
            patientName: 'Sara K.',
            service: 'Home visit · vitals check',
            date: getDateOffset(-1),
            time: '11:00',
            status: 'completed',
            fee: 1000,
            location: 'F-7, Islamabad',
        },
        {
            id: 'NUR-1004',
            patientName: 'Usman A.',
            service: 'Night shift · recovery care',
            date: getDateOffset(-1),
            time: '20:00',
            status: 'cancelled',
            fee: 2200,
            location: 'DHA, Lahore',
        },
    ],
    careNotes: [],
})

const getDataStorageKey = (user) => `carepoint_nurse_dashboard_${user.email || 'nurse'}`

const readDashboardData = (user) => {
    const saved = localStorage.getItem(getDataStorageKey(user))
    if (!saved) return createInitialData()

    try {
        const parsed = JSON.parse(saved)
        if (!parsed || typeof parsed !== 'object') throw new Error('Saved nurse dashboard data must be an object.')
        const initialData = createInitialData()
        return {
            ...initialData,
            ...parsed,
            availability: { ...initialData.availability, ...parsed.availability },
            requests: Array.isArray(parsed.requests) ? parsed.requests : initialData.requests,
            workplaces: Array.isArray(parsed.workplaces) ? parsed.workplaces : [],
            careNotes: Array.isArray(parsed.careNotes) ? parsed.careNotes : [],
        }
    } catch (error) {
        console.error('Unable to load nurse dashboard data.', error)
        return createInitialData()
    }
}

const saveDashboardData = (user, data) => {
    try {
        localStorage.setItem(getDataStorageKey(user), JSON.stringify(data))
        return true
    } catch (error) {
        console.error('Unable to save nurse dashboard data.', error)
        showErrorAlert('Unable to Save', 'Your changes could not be saved in this browser. Please try again.')
        return false
    }
}

const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
})

const NurseDashboard = () => {
    const navigate = useNavigate()
    const [initialSession] = useState(() => {
        const savedUser = localStorage.getItem('carepoint_user')
        if (!savedUser) return { status: 'unauthenticated', user: null, data: null }

        try {
            const parsedUser = JSON.parse(savedUser)
            if (!parsedUser || typeof parsedUser !== 'object') throw new Error('Saved CarePoint account must be an object.')
            if (isPhysiotherapistAccount(parsedUser) || isDietitianAccount(parsedUser) || isUltrasoundAccount(parsedUser) || isLabTechnicianAccount(parsedUser) || isPharmacyManagerAccount(parsedUser)) return { status: 'unauthorized', user: parsedUser, data: null }
            if (!isNurseAccount(parsedUser)) return { status: 'unauthorized', user: parsedUser, data: null }
            return { status: 'ready', user: parsedUser, data: readDashboardData(parsedUser) }
        } catch (error) {
            console.error('Unable to read the current CarePoint account.', error)
            return { status: 'invalid', user: null, data: null }
        }
    })
    const [user, setUser] = useState(initialSession.user)
    const [data, setData] = useState(initialSession.data)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        if (initialSession.status === 'unauthenticated' || initialSession.status === 'invalid') {
            navigate('/login')
            return
        }
        if (initialSession.status === 'unauthorized') {
            navigate(getDashboardPath(initialSession.user), { replace: true })
        }
    }, [initialSession, navigate])

    useEffect(() => {
        if (user && data) saveDashboardData(user, data)
    }, [user, data])

    const updateData = (updater) => {
        setData((current) => {
            return typeof updater === 'function' ? updater(current) : updater
        })
    }

    const updateUser = (updated) => {
        try {
            localStorage.setItem('carepoint_user', JSON.stringify(updated))
            setUser(updated)
            showSuccessAlert('Profile Updated', 'Your nurse profile has been saved on this device.')
        } catch (error) {
            console.error('Unable to save the nurse profile.', error)
            showErrorAlert('Unable to Save', 'Your profile could not be saved in this browser. Please try again.')
        }
    }

    if (!user || !data) return null

    return (
        <div className="min-h-full bg-slate-50/70 py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-[#0D9488]">CarePoint Provider Portal</p>
                        <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Nurse Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage your profile, availability, care requests, and earnings.</p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                        Demo workspace · saved in this browser
                    </span>
                </div>

                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="space-y-4">
                        <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-5 text-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-teal-300/40 bg-[#0D9488] text-xl font-extrabold">
                                    {user.name?.charAt(0)?.toUpperCase() || 'N'}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate font-bold">{user.name}</p>
                                    <p className="truncate text-xs text-teal-200">{SERVICE_CATEGORIES[user.category]?.label || 'Nursing Professional'}</p>
                                </div>
                            </div>
                            <div className="mt-4 rounded-xl bg-white/10 p-3">
                                <p className="text-xs text-slate-300">Visit / shift fee</p>
                                <p className="mt-1 text-xl font-extrabold text-teal-200">PKR {Number(user.fee) || 500}</p>
                                <p className="mt-1 text-[11px] text-slate-300">{user.experience || 0} years of experience</p>
                            </div>
                        </div>
                        <nav aria-label="Nurse dashboard sections" className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            {[
                                ['overview', '🏠', 'Overview'],
                                ['profile', '🪪', 'Profile & Credentials'],
                                ['availability', '📅', 'Availability'],
                                ['requests', '🗓️', 'Requests & Care Queue'],
                                ['earnings', '💰', 'Earnings & Reviews'],
                            ].map(([id, icon, label]) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full border-b border-slate-100 px-4 py-3.5 text-left text-sm font-semibold last:border-0 ${
                                        activeTab === id ? 'border-l-4 border-l-[#0D9488] bg-teal-50 text-[#0D9488]' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <span className="mr-2">{icon}</span>{label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className="min-w-0">
                        {activeTab === 'overview' && <OverviewTab user={user} data={data} setActiveTab={setActiveTab} />}
                        {activeTab === 'profile' && <ProfileTab user={user} updateUser={updateUser} data={data} updateData={updateData} />}
                        {activeTab === 'availability' && <AvailabilityTab data={data} updateData={updateData} />}
                        {activeTab === 'requests' && <RequestsTab data={data} updateData={updateData} />}
                        {activeTab === 'earnings' && <EarningsTab user={user} data={data} />}
                    </main>
                </div>
            </div>
        </div>
    )
}

const SectionCard = ({ title, icon, children, description }) => (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#0F172A]"><span>{icon}</span>{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {children}
    </section>
)

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-100 text-amber-800',
        confirmed: 'bg-teal-100 text-teal-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        completed: 'bg-emerald-100 text-emerald-800',
        cancelled: 'bg-rose-100 text-rose-800',
    }
    return <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${styles[status] || 'bg-slate-100 text-slate-700'}`}>{status.replace('-', ' ')}</span>
}

const OverviewTab = ({ user, data, setActiveTab }) => {
    const today = getDateOffset(0)
    const todayRequests = data.requests.filter((request) => request.date === today && !['cancelled'].includes(request.status))
    const pending = data.requests.filter((request) => request.status === 'pending').length
    const completed = data.requests.filter((request) => request.status === 'completed').length
    const gross = data.requests.filter((request) => request.status === 'completed').reduce((total, request) => total + Number(request.fee || 0), 0)

    return (
        <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    ['New requests', pending, '🛎️', 'text-amber-700 bg-amber-50'],
                    ["Today's visits", todayRequests.length, '📍', 'text-teal-700 bg-teal-50'],
                    ['Completed care', completed, '✓', 'text-emerald-700 bg-emerald-50'],
                    ['Net earnings', `PKR ${Math.round(gross * 0.93)}`, '💰', 'text-blue-700 bg-blue-50'],
                ].map(([label, value, icon, color]) => (
                    <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>{icon}</div>
                        <p className="text-xs font-semibold text-slate-500">{label}</p>
                        <p className="mt-1 text-xl font-extrabold text-[#0F172A]">{value}</p>
                    </div>
                ))}
            </div>

            <SectionCard title="Today’s care schedule" icon="🗓️" description={`Welcome, ${user.name}. Here are your current demo bookings.`}>
                <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                    These are sample bookings for interface demonstration only. Live patient booking and notifications require a connected backend.
                </p>
                {todayRequests.length ? (
                    <div className="space-y-3">
                        {todayRequests.map((request) => (
                            <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4">
                                <div>
                                    <p className="font-bold text-[#0F172A]">{request.patientName} <span className="font-normal text-slate-500">· {request.service}</span></p>
                                    <p className="mt-1 text-xs text-slate-500">{request.time} · {request.location}</p>
                                </div>
                                <StatusBadge status={request.status} />
                            </div>
                        ))}
                    </div>
                ) : <p className="text-sm text-slate-500">No care visits scheduled for today.</p>}
                <button type="button" onClick={() => setActiveTab('requests')} className="mt-4 text-sm font-bold text-[#0D9488] hover:underline">
                    Manage care requests →
                </button>
            </SectionCard>
        </div>
    )
}

const ProfileTab = ({ user, updateUser, data, updateData }) => {
    const [form, setForm] = useState({
        name: user.name || '',
        gender: user.gender || 'female',
        category: ['routine_nurse', 'emergency_nurse'].includes(user.category) ? user.category : 'routine_nurse',
        specialty: user.specialty || '',
        qualification: user.qualification || '',
        licenseNumber: user.licenseNumber || '',
        licenseDocumentName: user.licenseDocumentName || '',
        experience: Number(user.experience) || 0,
        fee: Number(user.fee) || SERVICE_CATEGORIES[user.category]?.minFee || 500,
        phone: user.phone || '',
        email: user.email || '',
        serviceModes: { homeVisit: true, bedsideCare: true, emergencyCall: false, nightShifts: false, ...user.serviceModes },
    })
    const [place, setPlace] = useState({ name: '', kind: 'Service zone' })
    const [areaDraft, setAreaDraft] = useState((user.serviceAreas || []).join(', '))
    const [licenseFile, setLicenseFile] = useState(null)
    const [feeError, setFeeError] = useState('')
    const feeBounds = SERVICE_CATEGORIES[form.category].getBounds(form.experience)

    const changeCategory = (category) => {
        const categoryBounds = SERVICE_CATEGORIES[category].getBounds(form.experience)
        setForm((current) => ({
            ...current,
            category,
            fee: Math.max(categoryBounds.min, Math.min(current.fee, categoryBounds.max)),
        }))
        setFeeError('')
    }

    const saveProfile = (event) => {
        event.preventDefault()
        const bounds = SERVICE_CATEGORIES[form.category].getBounds(form.experience)
        if (form.fee < bounds.min || form.fee > bounds.max) {
            setFeeError(`Select a fee from PKR ${bounds.min} to PKR ${bounds.max}.`)
            return
        }
        updateUser({
            ...user,
            ...form,
            role: 'nurse',
            fee: Number(form.fee),
            experience: Number(form.experience),
            serviceAreas: areaDraft.split(',').map((area) => area.trim()).filter(Boolean),
        })
    }

    const addWorkplace = () => {
        if (!place.name.trim()) return
        updateData((current) => ({
            ...current,
            workplaces: [...current.workplaces, { id: crypto.randomUUID(), ...place, name: place.name.trim() }],
        }))
        setPlace({ name: '', kind: 'Service zone' })
    }

    const removeWorkplace = (id) => {
        updateData((current) => ({ ...current, workplaces: current.workplaces.filter((item) => item.id !== id) }))
    }

    return (
        <div className="space-y-5">
            <SectionCard title="Nurse profile & credentials" icon="🪪" description="Keep your professional details current. License files are not uploaded to a server in this demo.">
                <form onSubmit={saveProfile} className="space-y-5">
                    <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">
                        Credential verification status: {user.verificationStatus || 'Pending review'}. An administrator must verify your license before it can be marked verified.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Full name">
                            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} />
                        </FormField>
                        <FormField label="Gender">
                            <select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} className={inputClass}>
                                <option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
                            </select>
                        </FormField>
                        <FormField label="Nursing specialization">
                            <input required value={form.specialty} onChange={(event) => setForm({ ...form, specialty: event.target.value })} placeholder="e.g. General Care, ICU / Critical Care" className={inputClass} />
                        </FormField>
                        <FormField label="Nursing qualification">
                            <input value={form.qualification} onChange={(event) => setForm({ ...form, qualification: event.target.value })} placeholder="e.g. BSN, RN" className={inputClass} />
                        </FormField>
                        <FormField label="Nursing service category">
                            <select value={form.category} onChange={(event) => changeCategory(event.target.value)} className={inputClass}>
                                <option value="routine_nurse">Routine Home Care Nurse</option>
                                <option value="emergency_nurse">Emergency / ICU Nurse</option>
                            </select>
                        </FormField>
                        <FormField label="Years of experience">
                            <input type="number" min="0" max="50" value={form.experience} onChange={(event) => setForm({ ...form, experience: Math.max(0, Number(event.target.value)) })} className={inputClass} />
                        </FormField>
                        <FormField label={`Visit / shift fee (PKR ${feeBounds.min}–${feeBounds.max})`}>
                            <input type="number" min={feeBounds.min} max={feeBounds.max} value={form.fee} onChange={(event) => { setForm({ ...form, fee: Number(event.target.value) }); setFeeError('') }} className={inputClass} />
                            {feeError && <p className="mt-1 text-xs font-semibold text-rose-600">{feeError}</p>}
                            <p className="mt-1 text-xs text-slate-500">{feeBounds.note}</p>
                        </FormField>
                        <FormField label="Nursing license / diploma number">
                            <input required value={form.licenseNumber} onChange={(event) => setForm({ ...form, licenseNumber: event.target.value })} placeholder="Enter registration or license number" className={inputClass} />
                        </FormField>
                        <FormField label="License or diploma document">
                            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => {
                                const file = event.target.files?.[0]
                                setLicenseFile(file || null)
                                if (file) setForm((current) => ({ ...current, licenseDocumentName: file.name }))
                            }} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-[#0D9488]" />
                            <p className="mt-1 text-xs text-slate-500">{licenseFile?.name || form.licenseDocumentName || 'PDF, JPG, or PNG · local preview only'}</p>
                        </FormField>
                        <FormField label="Phone number">
                            <input type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={inputClass} />
                        </FormField>
                        <FormField label="Email">
                            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} />
                        </FormField>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-bold text-slate-700">Service availability modes</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {SERVICE_MODES.map(({ field, label }) => (
                                <label key={field} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                                    {label}
                                    <input type="checkbox" checked={Boolean(form.serviceModes[field])} onChange={(event) => setForm({ ...form, serviceModes: { ...form.serviceModes, [field]: event.target.checked } })} className="h-4 w-4 accent-[#0D9488]" />
                                </label>
                            ))}
                        </div>
                    </div>

                    <FormField label="Field service areas (comma-separated)">
                        <input value={areaDraft} onChange={(event) => setAreaDraft(event.target.value)} placeholder="e.g. Gulberg, DHA, Johar Town" className={inputClass} />
                    </FormField>
                    <button type="submit" className={primaryButton}>Save nurse profile</button>
                </form>
            </SectionCard>

            <SectionCard title="Workplaces & service zones" icon="📍" description="Add more than one clinic, hospital, or home-service zone.">
                <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                    <input value={place.name} onChange={(event) => setPlace({ ...place, name: event.target.value })} placeholder="Workplace or service area" className={inputClass} />
                    <select value={place.kind} onChange={(event) => setPlace({ ...place, kind: event.target.value })} className={inputClass}>
                        <option>Service zone</option><option>Hospital</option><option>Clinic</option>
                    </select>
                    <button type="button" onClick={addWorkplace} className={secondaryButton}>Add</button>
                </div>
                {data.workplaces.length > 0 && (
                    <ul className="mt-4 space-y-2">
                        {data.workplaces.map((item) => (
                            <li key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                                <span><strong className="text-slate-800">{item.name}</strong><span className="ml-2 text-slate-500">{item.kind}</span></span>
                                <button type="button" onClick={() => removeWorkplace(item.id)} className="text-sm font-semibold text-rose-600 hover:underline">Remove</button>
                            </li>
                        ))}
                    </ul>
                )}
            </SectionCard>
        </div>
    )
}

const AvailabilityTab = ({ data, updateData }) => {
    const toggleDay = (day) => updateData((current) => ({
        ...current,
        availability: {
            ...current.availability,
            [day]: { ...current.availability[day], enabled: !current.availability[day].enabled },
        },
    }))

    const toggleShift = (day, shift) => updateData((current) => {
        const dayPlan = current.availability[day]
        const shifts = dayPlan.shifts.includes(shift)
            ? dayPlan.shifts.filter((item) => item !== shift)
            : [...dayPlan.shifts, shift]
        return {
            ...current,
            availability: { ...current.availability, [day]: { ...dayPlan, enabled: true, shifts } },
        }
    })

    return (
        <SectionCard title="Weekly shift availability" icon="📅" description="Choose service days and the shifts or care blocks you can accept.">
            <div className="space-y-3">
                {DAYS.map((day) => {
                    const plan = data.availability[day] || { enabled: false, shifts: [] }
                    return (
                        <div key={day} className="rounded-xl border border-slate-200 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="font-bold text-slate-800">{day}</span>
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                    <input type="checkbox" checked={plan.enabled} onChange={() => toggleDay(day)} className="h-4 w-4 accent-[#0D9488]" />
                                    {plan.enabled ? 'Available' : 'Day off'}
                                </label>
                            </div>
                            {plan.enabled && <div className="flex flex-wrap gap-2">
                                {SHIFTS.map((shift) => (
                                    <button key={shift} type="button" onClick={() => toggleShift(day, shift)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                                        plan.shifts.includes(shift) ? 'border-[#0D9488] bg-[#0D9488] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-400'
                                    }`}>{shift}</button>
                                ))}
                            </div>}
                        </div>
                    )
                })}
            </div>
        </SectionCard>
    )
}

const RequestsTab = ({ data, updateData }) => {
    const [filter, setFilter] = useState('all')
    const [editingReschedule, setEditingReschedule] = useState('')
    const [activeCareRequest, setActiveCareRequest] = useState(null)
    const filteredRequests = useMemo(
        () => data.requests.filter((request) => filter === 'all' || request.status === filter),
        [data.requests, filter],
    )

    const updateRequest = (id, changes) => updateData((current) => ({
        ...current,
        requests: current.requests.map((request) => request.id === id ? { ...request, ...changes } : request),
    }))

    const saveReschedule = (event, request) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const date = formData.get('date')
        const time = formData.get('time')
        if (!date || !time) return
        updateRequest(request.id, { date, time })
        setEditingReschedule('')
        showSuccessAlert('Schedule Updated', `The visit for ${request.patientName} has been rescheduled in this demo.`)
    }

    const saveCareNote = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const note = Object.fromEntries(formData.entries())
        updateData((current) => ({
            ...current,
            careNotes: [...current.careNotes, {
                ...note,
                id: crypto.randomUUID(),
                requestId: activeCareRequest.id,
                patientName: activeCareRequest.patientName,
                createdAt: new Date().toISOString(),
            }],
            requests: current.requests.map((request) => request.id === activeCareRequest.id && request.status === 'confirmed'
                ? { ...request, status: 'in-progress' }
                : request),
        }))
        setActiveCareRequest(null)
        showSuccessAlert('Care Notes Saved', 'The vital signs and care notes were saved in this browser demo.')
    }

    return (
        <>
            <SectionCard title="Service requests & patient queue" icon="🗓️" description="Review requests, update visit status, and record care notes. Sample data is not connected to live patients.">
                <div className="mb-4 flex flex-wrap gap-2">
                    {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
                        <button key={status} type="button" onClick={() => setFilter(status)} className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                            filter === status ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}>{status.replace('-', ' ')}</button>
                    ))}
                </div>
                <div className="space-y-3">
                    {filteredRequests.map((request) => (
                        <article key={request.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-bold text-[#0F172A]">{request.patientName}</h3>
                                        <StatusBadge status={request.status} />
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600">{request.service}</p>
                                    <p className="mt-1 text-xs text-slate-500">{formatDate(request.date)} at {request.time} · {request.location} · PKR {request.fee}</p>
                                </div>
                                <span className="text-xs font-semibold text-slate-400">{request.id}</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {request.status === 'pending' && <>
                                    <button type="button" onClick={() => { updateRequest(request.id, { status: 'confirmed' }); showSuccessAlert('Request Accepted', `${request.patientName}'s request has been accepted.`) }} className={smallPrimary}>✓ Accept</button>
                                    <button type="button" onClick={() => setEditingReschedule(editingReschedule === request.id ? '' : request.id)} className={smallNeutral}>↻ Reschedule</button>
                                    <button type="button" onClick={() => { updateRequest(request.id, { status: 'cancelled' }); showSuccessAlert('Request Cancelled', 'The sample request was marked as cancelled.') }} className={smallDanger}>Cancel</button>
                                </>}
                                {request.status === 'confirmed' && <>
                                    <button type="button" onClick={() => updateRequest(request.id, { status: 'in-progress' })} className={smallPrimary}>Start care</button>
                                    <button type="button" onClick={() => setEditingReschedule(editingReschedule === request.id ? '' : request.id)} className={smallNeutral}>↻ Reschedule</button>
                                    <button type="button" onClick={() => { updateRequest(request.id, { status: 'cancelled' }); showSuccessAlert('Request Cancelled', 'The sample request was marked as cancelled.') }} className={smallDanger}>Cancel</button>
                                </>}
                                {['confirmed', 'in-progress'].includes(request.status) && <>
                                    <button type="button" onClick={() => setActiveCareRequest(request)} className={smallNeutral}>🩺 Record vitals & care notes</button>
                                    <button type="button" onClick={() => { updateRequest(request.id, { status: 'completed' }); showSuccessAlert('Visit Completed', 'The care visit has been marked complete.') }} className={smallPrimary}>Mark completed</button>
                                </>}
                                {data.careNotes.some((note) => note.requestId === request.id) && <span className="self-center text-xs font-semibold text-teal-700">✓ Care notes recorded</span>}
                            </div>
                            {editingReschedule === request.id && (
                                <form onSubmit={(event) => saveReschedule(event, request)} className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]">
                                    <label className="text-xs font-semibold text-slate-600">New date<input name="date" type="date" required defaultValue={request.date} className={inputClass} /></label>
                                    <label className="text-xs font-semibold text-slate-600">New time<input name="time" type="time" required defaultValue={request.time} className={inputClass} /></label>
                                    <button type="submit" className={`${smallPrimary} self-end`}>Save schedule</button>
                                </form>
                            )}
                        </article>
                    ))}
                    {filteredRequests.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No requests in this status.</p>}
                </div>
            </SectionCard>

            {activeCareRequest && <CareNoteModal request={activeCareRequest} onClose={() => setActiveCareRequest(null)} onSubmit={saveCareNote} />}
        </>
    )
}

const CareNoteModal = ({ request, onClose, onSubmit }) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
        <section role="dialog" aria-modal="true" aria-labelledby="care-note-title" className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div><h2 id="care-note-title" className="text-xl font-extrabold text-[#0F172A]">Vital signs & care notes</h2><p className="mt-1 text-sm text-slate-500">{request.patientName} · {request.service}</p></div>
                <button type="button" onClick={onClose} aria-label="Close care notes" className="text-2xl leading-none text-slate-400 hover:text-slate-700">×</button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Blood pressure (mmHg)"><input name="bloodPressure" placeholder="e.g. 120/80" className={inputClass} /></FormField>
                    <FormField label="Blood sugar (mg/dL)"><input name="bloodSugar" type="number" min="0" step="any" placeholder="e.g. 98" className={inputClass} /></FormField>
                    <FormField label="Temperature (°C)"><input name="temperature" type="number" min="25" max="45" step="0.1" placeholder="e.g. 36.8" className={inputClass} /></FormField>
                    <FormField label="Pulse (bpm)"><input name="pulse" type="number" min="0" placeholder="e.g. 72" className={inputClass} /></FormField>
                </div>
                <FormField label="Medication administration notes"><textarea name="medicationNotes" rows="2" placeholder="Medication, dose, route, and time administered" className={inputClass} /></FormField>
                <FormField label="Care instructions / handover"><textarea name="careInstructions" rows="3" placeholder="Record observations and instructions for the next caregiver" className={inputClass} /></FormField>
                <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Demo note: information is stored only in this browser and is not sent to a patient record.</p>
                <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className={secondaryButton}>Close</button><button type="submit" className={primaryButton}>Save care note</button></div>
            </form>
        </section>
    </div>
)

const EarningsTab = ({ user, data }) => {
    const completed = data.requests.filter((request) => request.status === 'completed')
    const gross = completed.reduce((total, request) => total + Number(request.fee || 0), 0)
    const commission = Math.round(gross * 0.07)
    const net = gross - commission
    const accepted = data.requests.filter((request) => ['confirmed', 'in-progress', 'completed'].includes(request.status)).length
    const cancelled = data.requests.filter((request) => request.status === 'cancelled').length
    const reviews = [
        { name: 'S. Ahmed', rating: 5, comment: 'Kind, punctual, and explained each step of the care plan.' },
        { name: 'M. Khan', rating: 5, comment: 'Very attentive during the bedside care shift.' },
        { name: 'A. Raza', rating: 4, comment: 'Professional service and clear handover notes.' },
    ]

    return (
        <div className="space-y-5">
            <SectionCard title="Earnings & activity" icon="💰" description="Illustrative totals are calculated from completed demo requests.">
                <div className="grid gap-3 sm:grid-cols-3">
                    <Metric label="Accepted visits / shifts" value={accepted} />
                    <Metric label="Completed care" value={completed.length} />
                    <Metric label="Cancelled requests" value={cancelled} />
                </div>
                <div className="mt-5 grid gap-3 rounded-xl bg-teal-50 p-4 sm:grid-cols-3">
                    <Metric label="Completed service fees" value={`PKR ${gross}`} />
                    <Metric label="Platform commission · 7%" value={`− PKR ${commission}`} />
                    <Metric label="Estimated net payout" value={`PKR ${net}`} emphasized />
                </div>
                <p className="mt-3 text-xs text-slate-500">Payouts, tax treatment, and payment settlement are not connected in this demo.</p>
            </SectionCard>
            <SectionCard title="Ratings & patient feedback" icon="⭐" description="Sample reviews shown for dashboard preview only.">
                <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                    <p className="text-3xl font-extrabold text-[#0F172A]">4.8 <span className="text-lg text-amber-400">★★★★★</span></p>
                    <p className="mt-1 text-xs text-slate-500">Average demo rating · Feedback is not linked to live patients.</p>
                </div>
                <div className="space-y-3">
                    {reviews.map((review) => <div key={review.name} className="rounded-xl border border-slate-100 p-4">
                        <div className="flex items-center justify-between"><p className="font-bold text-slate-800">{review.name}</p><p className="text-amber-400">{'★'.repeat(review.rating)}<span className="text-slate-200">{'★'.repeat(5 - review.rating)}</span></p></div>
                        <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                    </div>)}
                </div>
                <p className="mt-4 text-xs text-slate-500">Profile: {user.name} · {user.specialty || 'Nursing professional'}</p>
            </SectionCard>
        </div>
    )
}

const Metric = ({ label, value, emphasized = false }) => (
    <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className={`mt-1 text-xl font-extrabold ${emphasized ? 'text-[#0D9488]' : 'text-[#0F172A]'}`}>{value}</p></div>
)

const FormField = ({ label, children }) => (
    <label className="block text-xs font-bold text-slate-600">{label}<span className="mt-1 block">{children}</span></label>
)

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100'
const primaryButton = 'rounded-xl bg-[#0D9488] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0F766E]'
const secondaryButton = 'rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50'
const smallPrimary = 'rounded-lg bg-[#0D9488] px-3 py-2 text-xs font-bold text-white hover:bg-[#0F766E]'
const smallNeutral = 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50'
const smallDanger = 'rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100'

export default NurseDashboard
