import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showErrorAlert, showSuccessAlert } from '../utils/alert'
import { SERVICE_CATEGORIES } from '../utils/feeRules'
import { getDashboardPath, isPharmacyManagerAccount } from '../utils/accountRoles'

const PRODUCT_TYPES = ['OTC medicine', 'Prescription-only medicine', 'Wellness product', 'Diagnostic kit']
const ORDER_STATUSES = ['received', 'verified', 'packed', 'out-for-delivery', 'delivered', 'returned', 'cancelled']
const STATUS_LABELS = {
    received: 'Order received',
    verified: 'Prescription verified',
    packed: 'Packed',
    'out-for-delivery': 'Out for delivery',
    delivered: 'Delivered',
    returned: 'Returned',
    cancelled: 'Cancelled',
}
const STATUS_COLORS = {
    received: 'bg-amber-100 text-amber-800',
    verified: 'bg-blue-100 text-blue-800',
    packed: 'bg-indigo-100 text-indigo-800',
    'out-for-delivery': 'bg-violet-100 text-violet-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    returned: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-rose-100 text-rose-800',
}

const createInitialData = () => ({
    inventory: [
        { id: 'MED-101', name: 'Paracetamol 500 mg', type: 'OTC medicine', price: 75, stock: 32, lowStockAt: 8 },
        { id: 'MED-102', name: 'Cetirizine 10 mg', type: 'OTC medicine', price: 95, stock: 6, lowStockAt: 8 },
        { id: 'MED-103', name: 'Metformin 500 mg', type: 'Prescription-only medicine', price: 220, stock: 14, lowStockAt: 5 },
        { id: 'MED-104', name: 'Vitamin D3 1000 IU', type: 'Wellness product', price: 360, stock: 0, lowStockAt: 5 },
        { id: 'MED-105', name: 'Blood Glucose Test Kit', type: 'Diagnostic kit', price: 1250, stock: 9, lowStockAt: 3 },
    ],
    orders: [
        { id: 'CP-6101', customer: 'Hiba A.', type: 'prescription', prescriptionStatus: 'pending', prescriptionNote: 'Prescription uploaded by patient · Dr. A. Khan · Metformin 500 mg', items: [{ productId: 'MED-103', name: 'Metformin 500 mg', quantity: 2, price: 220 }], deliveryFee: 120, date: new Date().toISOString(), status: 'received', rider: '' },
        { id: 'CP-6102', customer: 'Omar K.', type: 'direct', prescriptionStatus: 'not-required', prescriptionNote: '', items: [{ productId: 'MED-101', name: 'Paracetamol 500 mg', quantity: 2, price: 75 }, { productId: 'MED-105', name: 'Blood Glucose Test Kit', quantity: 1, price: 1250 }], deliveryFee: 100, date: new Date().toISOString(), status: 'received', rider: '' },
        { id: 'CP-6103', customer: 'Sara M.', type: 'prescription', prescriptionStatus: 'verified', prescriptionNote: 'Prescription verified · Cetirizine 10 mg', items: [{ productId: 'MED-102', name: 'Cetirizine 10 mg', quantity: 1, price: 95 }], deliveryFee: 150, date: new Date(Date.now() - 86400000).toISOString(), status: 'packed', rider: '' },
        { id: 'CP-6104', customer: 'Bilal R.', type: 'direct', prescriptionStatus: 'not-required', prescriptionNote: '', items: [{ productId: 'MED-101', name: 'Paracetamol 500 mg', quantity: 1, price: 75 }], deliveryFee: 80, date: new Date(Date.now() - 86400000).toISOString(), status: 'delivered', rider: 'CarePoint Rider · R-24' },
        { id: 'CP-6105', customer: 'Ayesha T.', type: 'prescription', prescriptionStatus: 'pending', prescriptionNote: 'Prescription uploaded by patient · doctor note pending review', items: [{ productId: 'MED-103', name: 'Metformin 500 mg', quantity: 1, price: 220 }], deliveryFee: 110, date: new Date(Date.now() - 86400000).toISOString(), status: 'cancelled', rider: '' },
    ],
    reviews: [
        { id: 'REV-1', customer: 'M. A.', rating: 5, speed: 5, packaging: 5, service: 5, feedback: 'Fast delivery, carefully packed, and helpful service.' },
        { id: 'REV-2', customer: 'S. K.', rating: 4, speed: 4, packaging: 5, service: 4, feedback: 'Medicines arrived in good condition.' },
    ],
})

const storageKey = (user) => `carepoint_pharmacy_manager_dashboard_${user.email || 'store'}`

const loadData = (user) => {
    const saved = localStorage.getItem(storageKey(user))
    if (!saved) return createInitialData()
    try {
        const parsed = JSON.parse(saved)
        if (!parsed || typeof parsed !== 'object') throw new Error('Saved pharmacy dashboard data must be an object.')
        const defaults = createInitialData()
        return {
            ...defaults,
            ...parsed,
            inventory: Array.isArray(parsed.inventory) ? parsed.inventory : defaults.inventory,
            orders: Array.isArray(parsed.orders) ? parsed.orders : defaults.orders,
            reviews: Array.isArray(parsed.reviews) ? parsed.reviews : defaults.reviews,
        }
    } catch (error) {
        console.error('Unable to load pharmacy manager dashboard data.', error)
        return createInitialData()
    }
}

const PharmacyManagerDashboard = () => {
    const navigate = useNavigate()
    const [session] = useState(() => {
        const saved = localStorage.getItem('carepoint_user')
        if (!saved) return { status: 'unauthenticated', user: null, data: null }
        try {
            const user = JSON.parse(saved)
            if (!user || typeof user !== 'object') throw new Error('Saved CarePoint account must be an object.')
            if (!isPharmacyManagerAccount(user)) return { status: 'unauthorized', user, data: null }
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
            console.error('Unable to save pharmacy dashboard data.', error)
            showErrorAlert('Unable to Save', 'Your changes could not be saved in this browser. Please try again.')
        }
    }, [data, user])

    const updateData = (updater) => setData((current) => typeof updater === 'function' ? updater(current) : updater)
    const saveProfile = (updated) => {
        try {
            localStorage.setItem('carepoint_user', JSON.stringify(updated))
            setUser(updated)
            showSuccessAlert('Store Profile Updated', 'Your pharmacy profile has been saved on this device.')
        } catch (error) {
            console.error('Unable to save pharmacy profile.', error)
            showErrorAlert('Unable to Save', 'Your profile could not be saved in this browser. Please try again.')
        }
    }

    if (!user || !data) return null

    const navItems = [
        ['overview', '🏠', 'Overview'],
        ['profile', '🏪', 'Store & Licenses'],
        ['inventory', '📦', 'Inventory'],
        ['orders', '🧾', 'Order Queue'],
        ['earnings', '💰', 'Earnings & Reviews'],
    ]

    return (
        <div className="min-h-full bg-slate-50/70 py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-[#0D9488]">CarePoint Provider Portal</p>
                        <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Online Pharmacy & Pharmacist Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage store operations, stock, prescriptions, orders, riders, and earnings.</p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">Demo workspace · saved in this browser</span>
                </header>
                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="space-y-4">
                        <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-5 text-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-teal-300/40 bg-[#0D9488] text-xl font-extrabold">{(user.storeName || user.name)?.charAt(0)?.toUpperCase() || 'P'}</span>
                                <div className="min-w-0"><p className="truncate font-bold">{user.storeName || user.name || 'CarePoint Pharmacy'}</p><p className="truncate text-xs text-teal-200">{SERVICE_CATEGORIES.pharmacy_delivery.label} · {user.name || 'Pharmacist / Manager'}</p></div>
                            </div>
                            <div className="mt-4 rounded-xl bg-white/10 p-3"><p className="text-xs text-slate-300">Delivery service charge</p><p className="mt-1 text-xl font-extrabold text-teal-200">PKR {Number(user.deliveryFee) || Number(user.fee) || 50}</p><p className="mt-1 text-[11px] text-slate-300">Medicine prices are set in inventory</p></div>
                        </div>
                        <nav aria-label="Pharmacy dashboard sections" className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            {navItems.map(([id, icon, label]) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`w-full border-b border-slate-100 px-4 py-3.5 text-left text-sm font-semibold last:border-0 ${activeTab === id ? 'border-l-4 border-l-[#0D9488] bg-teal-50 text-[#0D9488]' : 'text-slate-600 hover:bg-slate-50'}`}><span className="mr-2">{icon}</span>{label}</button>)}
                        </nav>
                    </aside>
                    <main className="min-w-0">
                        {activeTab === 'overview' && <OverviewTab user={user} data={data} setActiveTab={setActiveTab} />}
                        {activeTab === 'profile' && <ProfileTab user={user} saveProfile={saveProfile} />}
                        {activeTab === 'inventory' && <InventoryTab data={data} updateData={updateData} />}
                        {activeTab === 'orders' && <OrdersTab data={data} updateData={updateData} />}
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

const getStockStatus = (product) => {
    if (product.stock <= 0) return { label: 'Out of stock', style: 'bg-rose-100 text-rose-700' }
    if (product.stock <= product.lowStockAt) return { label: 'Low stock', style: 'bg-amber-100 text-amber-800' }
    return { label: 'In stock', style: 'bg-emerald-100 text-emerald-800' }
}

const getOrderTotal = (order) => order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
const getDateLabel = (value) => new Date(value).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })

const OverviewTab = ({ user, data, setActiveTab }) => {
    const pendingRx = data.orders.filter((order) => order.type === 'prescription' && order.prescriptionStatus === 'pending' && order.status !== 'cancelled').length
    const completed = data.orders.filter((order) => order.status === 'delivered')
    const sales = completed.reduce((sum, order) => sum + getOrderTotal(order), 0)
    const delivery = completed.reduce((sum, order) => sum + Number(order.deliveryFee || 0), 0)
    const metrics = [
        ['Orders to review', data.orders.filter((order) => order.status === 'received').length, '🧾', 'bg-amber-50 text-amber-700'],
        ['Prescription approvals', pendingRx, '📋', 'bg-violet-50 text-violet-700'],
        ['Completed deliveries', completed.length, '🚚', 'bg-emerald-50 text-emerald-700'],
        ['Estimated net earnings', `PKR ${sales + delivery - Math.round(sales * 0.07)}`, '💰', 'bg-teal-50 text-teal-700'],
    ]
    const activeOrders = data.orders.filter((order) => !['delivered', 'cancelled'].includes(order.status))
    return <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, icon, style]) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><span className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${style}`}>{icon}</span><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-extrabold text-[#0F172A]">{value}</p></div>)}</div>
        <Card title="Store operations" icon="🏪" description={`Welcome, ${user.storeName || user.name || 'Pharmacy Manager'}. Here is the current demo order activity.`}>
            <DemoNotice />
            <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Catalog products</p><p className="mt-1 text-xl font-extrabold text-[#0F172A]">{data.inventory.length}</p></div><div className="rounded-xl bg-amber-50 p-4"><p className="text-xs font-semibold text-amber-800">Low / out of stock</p><p className="mt-1 text-xl font-extrabold text-amber-900">{data.inventory.filter((item) => item.stock <= item.lowStockAt).length}</p></div><div className="rounded-xl bg-teal-50 p-4"><p className="text-xs font-semibold text-teal-800">Active orders</p><p className="mt-1 text-xl font-extrabold text-teal-900">{activeOrders.length}</p></div></div>
            <h3 className="mb-3 mt-5 text-sm font-extrabold text-[#0F172A]">Latest orders</h3>
            <div className="space-y-3">{activeOrders.slice(0, 4).map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"><div><p className="font-bold text-[#0F172A]">{order.id} · {order.customer}<span className="font-normal text-slate-500"> · {order.type === 'prescription' ? 'Prescription order' : 'Direct OTC order'}</span></p><p className="mt-1 text-xs text-slate-500">{order.items.length} product line(s) · PKR {getOrderTotal(order)} medicine total</p></div><StatusBadge status={order.status} /></div>)}</div>
            <button type="button" onClick={() => setActiveTab('orders')} className="mt-4 text-sm font-bold text-[#0D9488] hover:underline">Manage order queue →</button>
        </Card>
    </div>
}

const ProfileTab = ({ user, saveProfile }) => {
    const [profile, setProfile] = useState(() => ({
        storeName: user.storeName || '',
        pharmacistName: user.pharmacistName || user.name || '',
        name: user.name || '',
        gender: user.gender || '',
        licenseNumber: user.licenseNumber || '',
        licenseName: user.licenseName || '',
        address: user.address || '',
        city: user.city || '',
        deliveryFee: Number(user.deliveryFee) || Number(user.fee) || 50,
        experience: Number(user.experience) || 0,
        expressDelivery: Boolean(user.expressDelivery),
        emergencyDispatch: Boolean(user.emergencyDispatch),
        standardDelivery: user.standardDelivery ?? true,
    }))
    const [fileName, setFileName] = useState('')
    const [feeError, setFeeError] = useState('')

    const submit = (event) => {
        event.preventDefault()
        if (profile.deliveryFee < 50 || profile.deliveryFee > 200) {
            setFeeError('Delivery service charges must be between PKR 50 and PKR 200.')
            return
        }
        saveProfile({ ...user, ...profile, role: 'pharmacy_manager', category: 'pharmacy_delivery', name: profile.pharmacistName })
    }

    return <Card title="Pharmacy profile, license & service setup" icon="🏪" description="Manage store details, pharmacist credentials, delivery charge, and operating modes.">
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Pharmacy / store name"><input required value={profile.storeName} onChange={(e) => setProfile({ ...profile, storeName: e.target.value })} placeholder="e.g. CarePoint Community Pharmacy" className={inputClass} /></Field>
                <Field label="Pharmacist / manager name"><input required value={profile.pharmacistName} onChange={(e) => setProfile({ ...profile, pharmacistName: e.target.value, name: e.target.value })} className={inputClass} /></Field>
                <Field label="Gender"><select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className={inputClass}><option value="">Select</option><option>Female</option><option>Male</option><option>Prefer not to say</option></select></Field>
                <Field label="Pharmacy license / registration number"><input value={profile.licenseNumber} onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })} placeholder="Pharmacy / pharmacist registration number" className={inputClass} /></Field>
                <Field label="License / registration document"><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => { const file = e.target.files?.[0]; setFileName(file?.name || ''); if (file) setProfile((current) => ({ ...current, licenseName: file.name })) }} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-[#0D9488]" /><span className="mt-1 block text-xs font-normal text-slate-500">{fileName || profile.licenseName || 'PDF, JPG, or PNG · local filename only'}</span></Field>
                <Field label="Operating city"><input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="City" className={inputClass} /></Field>
                <div className="sm:col-span-2"><Field label="Operating address"><textarea required rows="2" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Street address, area, and landmarks" className={inputClass} /></Field></div>
                <Field label="Delivery service charge (PKR 50–200)"><input type="number" min="50" max="200" value={profile.deliveryFee} onChange={(e) => { setProfile({ ...profile, deliveryFee: Number(e.target.value) }); setFeeError('') }} className={inputClass} />{feeError && <span className="mt-1 block text-xs font-semibold text-rose-600">{feeError}</span>}<span className="mt-1 block text-xs font-normal text-slate-500">Medicine prices are set separately in the inventory catalog.</span></Field>
                <Field label="Years in operation"><input type="number" min="0" max="100" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: Math.max(0, Number(e.target.value)) })} className={inputClass} /></Field>
            </div>
            <div><p className="mb-2 text-sm font-bold text-slate-700">Operating modes</p><div className="grid gap-2 sm:grid-cols-3">{[{ field: 'expressDelivery', label: 'Express delivery' }, { field: 'emergencyDispatch', label: '24/7 emergency dispatch' }, { field: 'standardDelivery', label: 'Standard home delivery' }].map(({ field, label }) => <label key={field} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">{label}<input type="checkbox" checked={Boolean(profile[field])} onChange={(e) => setProfile({ ...profile, [field]: e.target.checked })} className="h-4 w-4 accent-[#0D9488]" /></label>)}</div></div>
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">License verification and document uploads require a secure backend. This demo only stores the selected filename in this browser.</p>
            <button type="submit" className={primaryButton}>Save pharmacy profile</button>
        </form>
    </Card>
}

const InventoryTab = ({ data, updateData }) => {
    const [filter, setFilter] = useState('all')
    const [form, setForm] = useState({ name: '', type: 'OTC medicine', price: '', stock: '', lowStockAt: '5' })
    const inventory = useMemo(() => data.inventory.filter((item) => filter === 'all' || (filter === 'low' ? item.stock > 0 && item.stock <= item.lowStockAt : filter === 'out' ? item.stock === 0 : item.type === filter)), [data.inventory, filter])

    const addProduct = (event) => {
        event.preventDefault()
        const price = Number(form.price)
        const stock = Number(form.stock)
        const threshold = Number(form.lowStockAt)
        if (!form.name.trim() || price <= 0 || !Number.isInteger(stock) || stock < 0 || !Number.isInteger(threshold) || threshold < 0) {
            showErrorAlert('Check Product Details', 'Enter a product name, positive price, and valid stock values.')
            return
        }
        updateData((current) => ({ ...current, inventory: [{ ...form, id: crypto.randomUUID(), name: form.name.trim(), price, stock, lowStockAt: threshold }, ...current.inventory] }))
        setForm({ name: '', type: 'OTC medicine', price: '', stock: '', lowStockAt: '5' })
        showSuccessAlert('Product Added', 'The product was added to this browser’s demo catalog.')
    }
    const updateStock = (product, stock) => {
        if (!Number.isInteger(stock) || stock < 0) return
        updateData((current) => ({ ...current, inventory: current.inventory.map((item) => item.id === product.id ? { ...item, stock } : item) }))
    }

    return <div className="space-y-5">
        <Card title="Add catalog product" icon="➕" description="Manage OTC medicines, prescription-only products, wellness items, and diagnostic kits.">
            <form onSubmit={addProduct} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Field label="Product name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Medicine / product name" className={inputClass} /></Field>
                <Field label="Product type"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>{PRODUCT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></Field>
                <Field label="Unit price (PKR)"><input required type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} /></Field>
                <Field label="Units in stock"><input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} /></Field>
                <div className="flex items-end gap-2"><div className="min-w-0 flex-1"><Field label="Low stock at"><input required type="number" min="0" value={form.lowStockAt} onChange={(e) => setForm({ ...form, lowStockAt: e.target.value })} className={inputClass} /></Field></div><button type="submit" className={primaryButton}>Add</button></div>
            </form>
        </Card>
        <Card title="Inventory & stock levels" icon="📦" description="Track retail unit pricing and quickly update quantity on hand.">
            <DemoNotice />
            <div className="mb-4 flex flex-wrap gap-2" aria-label="Filter inventory">{['all', 'OTC medicine', 'Prescription-only medicine', 'Wellness product', 'Diagnostic kit', 'low', 'out'].map((type) => <button key={type} type="button" onClick={() => setFilter(type)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === type ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{type === 'all' ? 'All products' : type === 'low' ? 'Low stock' : type === 'out' ? 'Out of stock' : type}</button>)}</div>
            <div className="space-y-3">{inventory.map((item) => {
                const stock = getStockStatus(item)
                return <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
                    <div className="min-w-0"><p className="font-bold text-[#0F172A]">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.type} · PKR {item.price} per unit</p></div>
                    <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${stock.style}`}>{stock.label}</span><label className="flex items-center gap-2 text-xs font-semibold text-slate-600">Qty <input aria-label={`Stock quantity for ${item.name}`} type="number" min="0" value={item.stock} onChange={(e) => updateStock(item, Number(e.target.value))} className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm" /></label><button type="button" onClick={() => updateData((current) => ({ ...current, inventory: current.inventory.filter((product) => product.id !== item.id) }))} className="text-xs font-semibold text-rose-600 hover:underline">Remove</button></div>
                </article>
            })}{inventory.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No products match this filter.</p>}</div>
        </Card>
    </div>
}

const OrdersTab = ({ data, updateData }) => {
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [prescriptionView, setPrescriptionView] = useState('')
    const orders = useMemo(() => data.orders.filter((order) => (typeFilter === 'all' || order.type === typeFilter) && (statusFilter === 'all' || order.status === statusFilter)), [data.orders, typeFilter, statusFilter])

    const updateOrder = (id, changes) => updateData((current) => ({ ...current, orders: current.orders.map((order) => order.id === id ? { ...order, ...changes } : order) }))
    const verifyPrescription = (order) => {
        updateOrder(order.id, { prescriptionStatus: 'verified', status: 'verified' })
        setPrescriptionView('')
        showSuccessAlert('Prescription Verified', `${order.id} is approved to proceed to packing.`)
    }
    const assignRider = (order, event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const rider = String(formData.get('rider') || '').trim()
        if (!rider) {
            showErrorAlert('Rider Required', 'Enter a rider name or logistics partner before dispatch.')
            return
        }
        updateOrder(order.id, { rider, status: 'out-for-delivery' })
        showSuccessAlert('Order Dispatched', `${order.id} is now marked out for delivery with ${rider}.`)
    }
    const advanceOrder = (order) => {
        if (order.type === 'prescription' && order.prescriptionStatus !== 'verified') {
            showErrorAlert('Prescription Review Required', 'Verify the prescription before packing this order.')
            return
        }
        const unavailable = order.items.find((line) => {
            const product = data.inventory.find((item) => item.id === line.productId)
            return !product || product.stock < line.quantity
        })
        if (unavailable) {
            showErrorAlert('Insufficient Stock', `${unavailable.name} is unavailable or has insufficient stock. Update inventory before packing this order.`)
            return
        }
        updateData((current) => ({
            ...current,
            inventory: current.inventory.map((product) => {
                const line = order.items.find((item) => item.productId === product.id)
                return line ? { ...product, stock: product.stock - line.quantity } : product
            }),
            orders: current.orders.map((item) => item.id === order.id ? { ...item, status: 'packed' } : item),
        }))
    }

    return <div className="space-y-5">
        <Card title="Prescription verification & order queue" icon="🧾" description="Review direct OTC and prescription-based orders, verify prescriptions, and move orders through fulfillment.">
            <DemoNotice />
            <div className="mb-3 flex flex-wrap gap-2" aria-label="Filter orders by category">{[['all', 'All orders'], ['direct', 'Direct OTC'], ['prescription', 'Prescription-based']].map(([value, label]) => <button key={value} type="button" onClick={() => setTypeFilter(value)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${typeFilter === value ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{label}</button>)}</div>
            <div className="mb-4"><label className="text-xs font-bold text-slate-600">Order status <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">{[['all', 'All statuses'], ...ORDER_STATUSES.map((status) => [status, STATUS_LABELS[status]])].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
            <div className="space-y-3">
                {orders.map((order) => <article key={order.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div><p className="font-bold text-[#0F172A]">{order.id} · {order.customer}<span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">{order.type === 'prescription' ? 'Prescription order' : 'Direct OTC'}</span></p><p className="mt-1 text-xs text-slate-500">{getDateLabel(order.date)} · {order.items.length} product line(s)</p><div className="mt-2 space-y-1">{order.items.map((item) => <p key={`${order.id}-${item.productId}`} className="text-sm text-slate-700">{item.name} × {item.quantity} <span className="text-xs text-slate-500">· PKR {item.price * item.quantity}</span></p>)}</div><p className="mt-2 text-xs font-semibold text-slate-600">Medicines: PKR {getOrderTotal(order)} · Delivery: PKR {order.deliveryFee}</p>{order.rider && <p className="mt-1 text-xs font-semibold text-teal-700">Rider: {order.rider}</p>}</div>
                        <StatusBadge status={order.status} />
                    </div>
                    {prescriptionView === order.id && <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-extrabold text-violet-950">Prescription review · demo preview</p><p className="mt-1 text-sm text-violet-900">{order.prescriptionNote || 'No note supplied.'}</p><p className="mt-2 text-xs text-violet-700">This sample note is not a real prescription. Secure prescription access requires a live patient-record backend.</p></div><button type="button" onClick={() => setPrescriptionView('')} aria-label="Close prescription preview" className="text-xl leading-none text-violet-500">×</button></div>{order.prescriptionStatus === 'pending' && order.status !== 'cancelled' && <button type="button" onClick={() => verifyPrescription(order)} className={`${primaryButton} mt-3`}>Approve & verify prescription</button>}{order.prescriptionStatus === 'verified' && <p className="mt-3 text-xs font-bold text-emerald-800">✓ Prescription verified</p>}</div>}
                    <div className="mt-3 flex flex-wrap items-end gap-2">
                        {order.type === 'prescription' && order.status !== 'cancelled' && <button type="button" onClick={() => setPrescriptionView(prescriptionView === order.id ? '' : order.id)} className={secondaryButton}>{prescriptionView === order.id ? 'Hide prescription' : 'View prescription'}</button>}
                        {order.status === 'received' && order.type === 'direct' && <button type="button" onClick={() => updateOrder(order.id, { status: 'verified' })} className={primaryButton}>Confirm OTC order</button>}
                        {['received', 'verified'].includes(order.status) && (order.type !== 'prescription' || order.prescriptionStatus === 'verified') && <button type="button" onClick={() => advanceOrder(order)} className={secondaryButton}>Mark packed</button>}
                        {order.status === 'packed' && <form onSubmit={(event) => assignRider(order, event)} className="flex flex-wrap items-end gap-2 rounded-lg bg-slate-50 p-3"><Field label="Assign rider / logistics partner"><input name="rider" required placeholder="e.g. CarePoint Rider · R-18" className={inputClass} /></Field><button type="submit" className={primaryButton}>Assign & dispatch</button></form>}
                        {order.status === 'out-for-delivery' && <button type="button" onClick={() => updateOrder(order.id, { status: 'delivered' })} className={primaryButton}>Confirm delivery</button>}
                        {order.status === 'delivered' && <button type="button" onClick={() => updateOrder(order.id, { status: 'returned' })} className={secondaryButton}>Record return</button>}
                        {['received', 'verified'].includes(order.status) && <button type="button" onClick={() => updateOrder(order.id, { status: 'cancelled' })} className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50">Cancel order</button>}
                    </div>
                </article>)}
                {orders.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No orders match these filters.</p>}
            </div>
        </Card>
    </div>
}

const EarningsTab = ({ user, data }) => {
    const delivered = data.orders.filter((order) => order.status === 'delivered')
    const medicineSales = delivered.reduce((sum, order) => sum + getOrderTotal(order), 0)
    const deliveryCollected = delivered.reduce((sum, order) => sum + Number(order.deliveryFee || 0), 0)
    const commission = Math.round(medicineSales * 0.07)
    const rating = data.reviews.length ? (data.reviews.reduce((sum, review) => sum + Number(review.rating), 0) / data.reviews.length).toFixed(1) : '—'
    const stats = [
        ['Completed deliveries', delivered.length],
        ['Pending prescription approvals', data.orders.filter((order) => order.type === 'prescription' && order.prescriptionStatus === 'pending' && order.status !== 'cancelled').length],
        ['Cancelled / returned orders', data.orders.filter((order) => ['cancelled', 'returned'].includes(order.status)).length],
        ['Store rating', `${rating} / 5`],
    ]
    return <div className="space-y-5">
        <Card title="Revenue & order analytics" icon="💰" description="Illustrative revenue breakdown uses delivered orders; 7% commission is estimated on medicine sales.">
            <DemoNotice />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-extrabold text-[#0F172A]">{value}</p></div>)}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Amount label="Medicine sales" value={medicineSales} /><Amount label="Delivery fees collected" value={deliveryCollected} /><Amount label="Estimated platform commission" value={commission} /><Amount label="Estimated net payout" value={medicineSales + deliveryCollected - commission} emphasized /></div>
            <p className="mt-3 text-xs text-slate-500">Configured delivery charge: PKR {Number(user.deliveryFee) || Number(user.fee) || 50}. Order charges can vary by delivery mode. Payments and settlement are not connected.</p>
        </Card>
        <Card title="Customer feedback" icon="⭐" description="Sample ratings for delivery speed, packaging, and service quality.">
            <div className="mb-4 rounded-xl bg-teal-50 p-4"><span className="text-2xl font-extrabold text-teal-800">{rating}</span><span className="ml-2 text-amber-500">{'★'.repeat(Math.round(Number(rating) || 0))}{'☆'.repeat(5 - Math.round(Number(rating) || 0))}</span><span className="ml-2 text-xs text-slate-500">{data.reviews.length} sample reviews</span></div>
            <div className="space-y-3">{data.reviews.map((review) => <article key={review.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-[#0F172A]">{review.customer}</p><span className="text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div><p className="mt-1 text-sm text-slate-600">{review.feedback}</p><div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500"><span>Speed: {review.speed}/5</span><span>Packaging: {review.packaging}/5</span><span>Service: {review.service}/5</span></div></article>)}</div>
        </Card>
    </div>
}

const Amount = ({ label, value, emphasized }) => <div className={`rounded-xl p-4 ${emphasized ? 'bg-[#0D9488] text-white' : 'border border-slate-200 bg-white text-slate-800'}`}><p className={`text-xs font-semibold ${emphasized ? 'text-teal-100' : 'text-slate-500'}`}>{label}</p><p className="mt-1 text-xl font-extrabold">PKR {value}</p></div>
const DemoNotice = () => <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">Demo only: orders, prescription verification, patient records, rider dispatch, notifications, payments, license verification, and file uploads are not connected to a live backend.</p>
const Field = ({ label, children }) => <label className="block text-xs font-bold text-slate-600">{label}<span className="mt-1 block">{children}</span></label>
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100'
const primaryButton = 'rounded-xl bg-[#0D9488] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0F766E]'
const secondaryButton = 'rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-teal-400 hover:text-[#0D9488]'

export default PharmacyManagerDashboard
