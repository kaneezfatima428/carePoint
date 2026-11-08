import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

const featureDetails = {
    consultation: {
        icon: '💬',
        title: 'Online Consultation',
        description: 'Choose a consultation channel to prepare your request.',
    },
    prescription: {
        icon: '📋',
        title: 'Prescription Upload & Verification',
        description: 'Upload a clear image or PDF of your prescription for pharmacist review.',
    },
    inventory: {
        icon: '📍',
        title: 'Local Pharmacy Inventory',
        description: 'Search medicines and explore pharmacy coverage across Pakistan.',
    },
}

const inventoryCatalog = [
    { name: 'Amlodipine 5 mg', basePrice: 180 },
    { name: 'Cetirizine 10 mg', basePrice: 95 },
    { name: 'Diazepam 5 mg (controlled)', basePrice: 240, restricted: true },
    { name: 'Metformin 500 mg', basePrice: 220 },
    { name: 'Omeprazole 20 mg', basePrice: 160 },
    { name: 'Paracetamol 500 mg', basePrice: 75 },
    { name: 'Salbutamol inhaler', basePrice: 390 },
    { name: 'Warfarin 5 mg (high-alert)', basePrice: 190, restricted: true },
]

const pharmacyBranches = [
    { name: 'Sehat Pharmacy · Clifton', city: 'Karachi', latitude: 24.8138, longitude: 67.0305 },
    { name: 'City Care Pharmacy · Gulshan', city: 'Karachi', latitude: 24.9263, longitude: 67.0822 },
    { name: 'MedPoint Pharmacy · DHA', city: 'Karachi', latitude: 24.8015, longitude: 67.0609 },
    { name: 'Wellness Pharmacy · North Nazimabad', city: 'Karachi', latitude: 24.9425, longitude: 67.0348 },
    { name: 'Sehat Pharmacy · Gulberg', city: 'Lahore', latitude: 31.5204, longitude: 74.3587 },
    { name: 'City Care Pharmacy · DHA', city: 'Lahore', latitude: 31.4697, longitude: 74.4104 },
    { name: 'MedPoint Pharmacy · Johar Town', city: 'Lahore', latitude: 31.4697, longitude: 74.2728 },
    { name: 'Wellness Pharmacy · Model Town', city: 'Lahore', latitude: 31.4833, longitude: 74.3167 },
    { name: 'Sehat Pharmacy · F-7', city: 'Islamabad', latitude: 33.7207, longitude: 73.0652 },
    { name: 'City Care Pharmacy · G-10', city: 'Islamabad', latitude: 33.6796, longitude: 73.0128 },
    { name: 'MedPoint Pharmacy · Blue Area', city: 'Islamabad', latitude: 33.7077, longitude: 73.0551 },
    { name: 'Sehat Pharmacy · Cantt', city: 'Multan', latitude: 30.1575, longitude: 71.5249 },
    { name: 'City Care Pharmacy · Gulgasht', city: 'Multan', latitude: 30.1984, longitude: 71.4687 },
    { name: 'Sehat Pharmacy · D Ground', city: 'Faisalabad', latitude: 31.4181, longitude: 73.0776 },
    { name: 'City Care Pharmacy · Madina Town', city: 'Faisalabad', latitude: 31.3944, longitude: 73.1150 },
    { name: 'Sehat Pharmacy · University Road', city: 'Peshawar', latitude: 34.0151, longitude: 71.5249 },
    { name: 'City Care Pharmacy · Hayatabad', city: 'Peshawar', latitude: 33.9938, longitude: 71.4370 },
].map((branch, index) => {
    const branchNumber = index + 1

    return {
        ...branch,
        id: `pharmacy-${branchNumber}`,
        inventory: inventoryCatalog
            .filter((_, medicineIndex) => (medicineIndex + branchNumber) % 4 !== 0 || medicineIndex === 2 || medicineIndex === 7)
            .map((medicine, medicineIndex) => ({
                name: medicine.name,
                price: medicine.basePrice + ((branchNumber + medicineIndex) % 4) * 5,
                stock: medicine.restricted ? 1 + ((branchNumber + medicineIndex) % 4) : 4 + ((branchNumber * 7 + medicineIndex * 3) % 30),
                restricted: medicine.restricted,
            })),
    }
})

const getCartStorageKey = (branchId) => `carepoint_pharmacy_cart_${branchId}`

const getSavedCart = (branchId) => {
    const savedCart = localStorage.getItem(getCartStorageKey(branchId))
    if (!savedCart) return []

    try {
        const parsedCart = JSON.parse(savedCart)
        if (!Array.isArray(parsedCart)) throw new Error('Saved cart must be an array.')
        return parsedCart
    } catch (error) {
        console.error(`Unable to load the saved cart for ${branchId}.`, error)
        return []
    }
}

const distanceInKm = (start, end) => {
    const radians = (degrees) => degrees * Math.PI / 180
    const latitudeDelta = radians(end.latitude - start.latitude)
    const longitudeDelta = radians(end.longitude - start.longitude)
    const haversine = Math.sin(latitudeDelta / 2) ** 2
        + Math.cos(radians(start.latitude)) * Math.cos(radians(end.latitude))
        * Math.sin(longitudeDelta / 2) ** 2

    return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

const PharmacyFeaturePage = () => {
    const { feature } = useParams()
    const navigate = useNavigate()
    const [consultType, setConsultType] = useState('')
    const [consultRequested, setConsultRequested] = useState(false)
    const [prescriptionFile, setPrescriptionFile] = useState(null)
    const [prescriptionStatus, setPrescriptionStatus] = useState('locked')
    const [fulfillment, setFulfillment] = useState('')
    const [location, setLocation] = useState('Karachi')
    const [locationStatus, setLocationStatus] = useState('Detecting your location…')
    const [userCoordinates, setUserCoordinates] = useState(null)
    const [medicineSearch, setMedicineSearch] = useState('')
    const [selectedBranch, setSelectedBranch] = useState(null)
    const [shoppingList, setShoppingList] = useState([])
    const [cart, setCart] = useState([])
    const [inventoryNotice, setInventoryNotice] = useState('')
    const [isBagOpen, setIsBagOpen] = useState(false)
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [orderPreviewName, setOrderPreviewName] = useState('')
    const [isOrderPreviewOpen, setIsOrderPreviewOpen] = useState(false)
    const locationRequestStarted = useRef(false)

    const cartTotal = useMemo(
        () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
        [cart],
    )
    const cartItemCount = useMemo(
        () => cart.reduce((total, item) => total + item.quantity, 0),
        [cart],
    )

    const filteredInventory = useMemo(() => {
        const query = medicineSearch.trim().toLowerCase()
        return (selectedBranch?.inventory ?? []).filter((medicine) => medicine.name.toLowerCase().includes(query))
    }, [medicineSearch, selectedBranch])

    const nearbyBranches = useMemo(() => {
        const query = location.trim().toLowerCase()
        return pharmacyBranches
            .filter((branch) => !query || branch.city.toLowerCase().includes(query) || branch.name.toLowerCase().includes(query))
            .map((branch) => ({
                ...branch,
                distance: userCoordinates ? distanceInKm(userCoordinates, branch) : null,
                matches: branch.inventory.filter((medicine) => !medicineSearch.trim() || medicine.name.toLowerCase().includes(medicineSearch.trim().toLowerCase())),
            }))
            .sort((first, second) => (first.distance ?? 0) - (second.distance ?? 0))
    }, [location, medicineSearch, userCoordinates])

    const details = featureDetails[feature]

    const handlePrescriptionSubmit = (event) => {
        event.preventDefault()
        if (!prescriptionFile) return
        setPrescriptionStatus('pending')
        setFulfillment('')
    }

    const handleAddToList = (medicine) => {
        setShoppingList((current) => current.includes(medicine.name) ? current : [...current, medicine.name])
        setInventoryNotice(`${medicine.name} added to your pickup list.`)
    }

    const handleAddToCart = (medicine) => {
        if (!localStorage.getItem('carepoint_user')) {
            navigate('/login')
            return
        }

        const existingItem = cart.find((item) => item.name === medicine.name)
        if (existingItem?.quantity >= medicine.stock) {
            setInventoryNotice(`Only ${medicine.stock} units of ${medicine.name} are available in this sample.`)
            return
        }

        setCart((current) => {
            const currentItem = current.find((item) => item.name === medicine.name)
            return currentItem
                ? current.map((item) => item.name === medicine.name
                    ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
                    : item)
                : [...current, { name: medicine.name, price: medicine.price, stock: medicine.stock, quantity: 1 }]
        })
        setInventoryNotice(`${medicine.name} added to your cart.`)
    }

    const handleChangeCartQuantity = (medicineName, change) => {
        setCart((current) => current.flatMap((item) => {
            if (item.name !== medicineName) return [item]
            const quantity = Math.min(item.stock, item.quantity + change)
            return quantity > 0 ? [{ ...item, quantity }] : []
        }))
    }

    const handleDeliverySubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        setOrderPreviewName(formData.get('name').trim())
        setIsCheckoutOpen(false)
        setIsOrderPreviewOpen(true)
    }

    const handleUseLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationStatus('Location services are not available. Search by city or pharmacy name.')
            return
        }
        setLocationStatus('Requesting your location…')
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                if (coords.latitude < 23.5 || coords.latitude > 37.1 || coords.longitude < 60.8 || coords.longitude > 77.9) {
                    setUserCoordinates(null)
                    setLocation('Karachi')
                    setLocationStatus('Your location is outside our sample coverage in Pakistan. Search by city or pharmacy name.')
                    return
                }
                const nearestBranch = pharmacyBranches.reduce((nearest, branch) => (
                    distanceInKm(coords, branch) < distanceInKm(coords, nearest) ? branch : nearest
                ))
                setSelectedBranch(null)
                setUserCoordinates({ latitude: coords.latitude, longitude: coords.longitude })
                setShoppingList([])
                setMedicineSearch('')
                setLocation(nearestBranch.city)
                setLocationStatus(`Location detected near ${nearestBranch.city}. Pharmacy samples are sorted by approximate distance.`)
            },
            () => setLocationStatus('Location access was not granted. Search by city or pharmacy name.'),
            { timeout: 10000 },
        )
    }, [])

    const handleSelectBranch = (branch) => {
        setSelectedBranch(branch)
        setMedicineSearch('')
        setShoppingList([])
        setCart(getSavedCart(branch.id))
        setInventoryNotice('')
        setIsBagOpen(false)
        setIsCheckoutOpen(false)
        setIsOrderPreviewOpen(false)
    }

    useEffect(() => {
        if (feature === 'inventory' && !locationRequestStarted.current) {
            locationRequestStarted.current = true
            handleUseLocation()
        }
    }, [feature, handleUseLocation])

    useEffect(() => {
        if (selectedBranch) {
            localStorage.setItem(getCartStorageKey(selectedBranch.id), JSON.stringify(cart))
        }
    }, [cart, selectedBranch])

    if (!details) return <Navigate to="/pharmacy" replace />

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 w-full">
            <Link to="/pharmacy" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D9488] hover:underline">
                ← Online Pharmacy
            </Link>
            <div className="mt-6 mb-8">
                <span className="text-3xl" aria-hidden="true">{details.icon}</span>
                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0F172A]">{details.title}</h1>
                <p className="mt-2 text-sm sm:text-base text-slate-500">{details.description}</p>
            </div>

            {feature === 'consultation' && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { id: 'chat', icon: '💬', title: 'Live text chat', detail: 'For quick questions and general guidance.' },
                            { id: 'video', icon: '📹', title: 'Video call', detail: 'For a detailed, face-to-face consultation with a doctor or pharmacist.' },
                        ].map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => { setConsultType(option.id); setConsultRequested(false) }}
                                aria-pressed={consultType === option.id}
                                className={`text-left border rounded-xl p-5 transition-colors hover:border-[#0D9488] ${consultType === option.id ? 'border-[#0D9488] bg-teal-50' : 'border-slate-200'}`}
                            >
                                <span className="font-semibold text-[#0F172A]">{option.icon} {option.title}</span>
                                <span className="block text-sm text-slate-500 mt-2">{option.detail}</span>
                            </button>
                        ))}
                    </div>
                    {consultType && (
                        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                            <button type="button" onClick={() => setConsultRequested(true)} className="rounded-xl bg-[#0D9488] px-5 py-3 font-semibold text-white hover:bg-[#0F766E]">
                                Request {consultType === 'chat' ? 'text chat' : 'video call'}
                            </button>
                            {consultRequested && <p role="status" className="text-sm text-teal-700">Request preference saved for this session. A live consultation service is not connected.</p>}
                        </div>
                    )}
                </section>
            )}


            {feature === 'inventory' && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                 
                    <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-3 items-end">
                        <label className="text-sm font-semibold text-slate-700">
                            Search medication
                            <input
                                type="search"
                                value={medicineSearch}
                                onChange={(event) => setMedicineSearch(event.target.value)}
                                placeholder="Medicine name..."
                                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100"
                            />
                        </label>
                        <label className="text-sm font-semibold text-slate-700">
                            Search location
                            <input
                                type="search"
                                value={location}
                                onChange={(event) => {
                                    setLocation(event.target.value)
                                    setSelectedBranch(null)
                                    setUserCoordinates(null)
                                }}
                                placeholder="City or pharmacy name..."
                                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100"
                            />
                        </label>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <p role="status" className="text-xs text-slate-500">{locationStatus}</p>
                        <button type="button" onClick={handleUseLocation} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            Detect my location
                        </button>
                    </div>

                    {selectedBranch ? (
                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <button type="button" onClick={() => setSelectedBranch(null)} className="text-sm font-semibold text-[#0D9488] hover:underline">
                                ← Back to pharmacy samples
                            </button>
                            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-[#0F172A]">{selectedBranch.name} · {selectedBranch.city}</h2>
                                    <p className="mt-1 text-sm text-slate-500">Branch-specific sample inventory. Stock and prices are not live.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsBagOpen(true)}
                                    aria-label={`View bag, ${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'}`}
                                    className="rounded-lg bg-[#0D9488] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0F766E]"
                                >
                                    🛍 Bag ({cartItemCount})
                                </button>
                            </div>
                            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full min-w-[620px] text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                        <tr><th className="px-4 py-3">Medicine</th><th className="px-4 py-3">Sample price</th><th className="px-4 py-3">Sample stock</th><th className="px-4 py-3">Options</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredInventory.map((medicine) => (
                                            <tr key={medicine.name}>
                                                <td className="px-4 py-3 font-semibold text-slate-800">
                                                    {medicine.name}
                                                    {medicine.restricted && <span className="ml-2 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">Restricted</span>}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">PKR {medicine.price}</td>
                                                <td className="px-4 py-3 text-slate-600">{medicine.stock}</td>
                                                <td className="px-4 py-3">
                                                    {medicine.restricted ? (
                                                        <span className="text-xs font-semibold text-rose-700">In-person only · follow local regulations</span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            <button type="button" onClick={() => handleAddToCart(medicine)} className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-800">Add to cart</button>
                                                            <button type="button" onClick={() => handleAddToList(medicine)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Add for pickup</button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredInventory.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">No medicines match this pharmacy’s inventory.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
                                <strong>Safety notice:</strong> High-alert medications, controlled substances, and heavy sedatives cannot be ordered online. Obtain them in person in accordance with local regulations.
                            </div>
                            {(shoppingList.length > 0 || inventoryNotice) && (
                                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
                                    {shoppingList.length > 0 && (
                                        <div>
                                            <h3 className="font-bold text-[#0F172A]">Pickup list · {selectedBranch.name}</h3>
                                            <p className="mt-1 text-slate-600">{shoppingList.join(', ')}</p>
                                        </div>
                                    )}
                                    {inventoryNotice && <p role="status" className="mt-1 text-teal-800">{inventoryNotice}</p>}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-6">
                            <h2 className="text-lg font-bold text-[#0F172A]">{location.trim() || 'All'} pharmacies</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {userCoordinates ? 'Samples are sorted by approximate distance from your detected location.' : 'Enter a medicine and/or location to filter the pharmacy samples.'}
                            </p>
                            <div className="mt-4 grid sm:grid-cols-2 gap-4">
                                {nearbyBranches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        type="button"
                                        onClick={() => handleSelectBranch(branch)}
                                        className="rounded-xl border border-slate-200 p-4 text-left transition-colors hover:border-[#0D9488] hover:bg-teal-50"
                                    >
                                        <span className="flex items-center justify-between gap-2">
                                            <span className="font-bold text-[#0F172A]">{branch.name}</span>
                                            {Number.isFinite(branch.distance) && <span className="text-xs font-semibold text-teal-800">~{branch.distance.toFixed(1)} km</span>}
                                        </span>
                                        <span className="mt-1 block text-xs text-slate-500">{branch.city}, Pakistan · {branch.matches.length} matching medicines</span>
                                        <span className="mt-3 block space-y-1">
                                            {branch.matches.slice(0, 3).map((medicine) => (
                                                <span key={medicine.name} className="flex justify-between gap-2 text-xs text-slate-600">
                                                    <span>{medicine.name}</span>
                                                    <span className="shrink-0">PKR {medicine.price} · {medicine.stock} in stock</span>
                                                </span>
                                            ))}
                                            {branch.matches.length > 3 && <span className="block text-xs font-semibold text-[#0D9488]">+ {branch.matches.length - 3} more matching medicines</span>}
                                            {branch.matches.length === 0 && <span className="block text-xs text-slate-500">No matching medicines in this sample branch.</span>}
                                        </span>
                                    </button>
                                ))}
                                {nearbyBranches.length === 0 && <p className="col-span-full rounded-xl border border-slate-200 p-5 text-sm text-slate-500">No pharmacy samples match both searches.</p>}
                            </div>
                        </div>
                    )}
                </section>
            )}
            {feature === 'inventory' && selectedBranch && isBagOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) setIsBagOpen(false)
                    }}
                >
                    <aside role="dialog" aria-modal="true" aria-labelledby="bag-title" className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-xl">
                        <header className="flex items-center justify-between bg-[#0D9488] px-5 py-4 text-white">
                            <h2 id="bag-title" className="text-xl font-bold"><span className="mr-2 text-2xl text-yellow-400" aria-hidden="true">🛒</span>Your Bag</h2>
                            <button type="button" onClick={() => setIsBagOpen(false)} aria-label="Close bag" className="text-3xl leading-none text-slate-400 hover:text-white">×</button>
                        </header>
                        <div className="flex-1 overflow-y-auto p-5">
                            {cart.length > 0 ? (
                                <ul className="space-y-3">
                                    {cart.map((item) => (
                                        <li key={item.name} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white text-2xl" aria-hidden="true">💊</span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-slate-900">{item.name}</p>
                                                <p className="mt-1 text-sm text-slate-500">PKR {item.price} × {item.quantity}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => handleChangeCartQuantity(item.name, -1)} aria-label={`Decrease ${item.name} quantity`} className="h-8 w-8 rounded border border-slate-400 text-slate-600 hover:bg-white">−</button>
                                                <span className="min-w-4 text-center font-semibold">{item.quantity}</span>
                                                <button type="button" onClick={() => handleChangeCartQuantity(item.name, 1)} disabled={item.quantity >= item.stock} aria-label={`Increase ${item.name} quantity`} className="h-8 w-8 rounded border border-slate-400 text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">+</button>
                                                <button type="button" onClick={() => handleChangeCartQuantity(item.name, -item.quantity)} aria-label={`Remove ${item.name} from bag`} className="ml-1 text-lg text-rose-600 hover:text-rose-800">🗑</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="py-8 text-center text-slate-500">Your bag is empty.</p>
                            )}
                        </div>
                        <footer className="border-t border-slate-200 p-5">
                            <div className="mb-4 flex items-center justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span className="text-[#0D9488]">PKR {cartTotal}</span>
                            </div>
                            <button type="button" disabled={cart.length === 0} onClick={() => { setIsBagOpen(false); setIsCheckoutOpen(true) }} className="w-full rounded-lg bg-[#0D9488] px-4 py-3 font-bold text-white hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50">
                                Proceed to Checkout
                            </button>
                        </footer>
                    </aside>
                </div>
            )}
            {feature === 'inventory' && selectedBranch && isCheckoutOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/55 p-3 sm:p-6"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) setIsCheckoutOpen(false)
                    }}
                >
                    <section role="dialog" aria-modal="true" aria-labelledby="shipping-title" className="my-auto w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
                        <header className="flex items-center justify-between bg-[#0D9488] px-5 py-4 text-white">
                            <h2 id="shipping-title" className="text-xl font-bold"><span className="mr-2 text-2xl text-yellow-400" aria-hidden="true">🚚</span>Shipping Details</h2>
                            <button type="button" onClick={() => setIsCheckoutOpen(false)} aria-label="Close shipping details" className="text-3xl leading-none text-slate-400 hover:text-white">×</button>
                        </header>
                        <form onSubmit={handleDeliverySubmit} className="p-5 sm:p-7">
                            <p className="mb-4 text-sm text-slate-500">Sample delivery from {selectedBranch.name}, {selectedBranch.city}. This preview does not place an order.</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="text-sm font-semibold text-slate-900 sm:col-span-2">
                                    Full Name
                                    <input name="name" type="text" required autoComplete="name" placeholder="John Doe" className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100" />
                                </label>
                                <label className="text-sm font-semibold text-slate-900">
                                    Email
                                    <input name="email" type="email" required autoComplete="email" placeholder="name@example.com" className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100" />
                                </label>
                                <label className="text-sm font-semibold text-slate-900">
                                    Phone Number
                                    <input name="phone" type="tel" required autoComplete="tel" placeholder="0300-1234567" className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100" />
                                </label>
                                <label className="text-sm font-semibold text-slate-900 sm:col-span-2">
                                    Shipping Address
                                    <textarea name="address" required autoComplete="street-address" rows="2" placeholder="House/Flat No, Street, Area" className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100" />
                                </label>
                                <label className="text-sm font-semibold text-slate-900 sm:col-span-2">
                                    City
                                    <input name="city" type="text" required autoComplete="address-level2" placeholder="Karachi / Lahore / Islamabad" defaultValue={selectedBranch.city} className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100" />
                                </label>
                            </div>
                            <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Total Payable Amount:</p>
                                    <p className="text-xl font-bold text-[#0D9488]">PKR {cartTotal}</p>
                                </div>
                                <button type="submit" className="rounded-lg bg-[#0D9488] px-6 py-3 font-bold text-white hover:bg-[#0F766E]">Place Order</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
            {feature === 'inventory' && isOrderPreviewOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
                    <section role="dialog" aria-modal="true" aria-labelledby="order-preview-title" className="w-full max-w-xl rounded-lg bg-white px-6 py-10 text-center shadow-2xl sm:px-12">
                        <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-teal-100 text-6xl font-light text-[#0D9488]" aria-hidden="true">✓</span>
                        <h2 id="order-preview-title" className="mt-8 text-2xl font-semibold text-slate-700 sm:text-3xl">Order Preview Complete!</h2>
                        <p className="mt-4 text-lg text-slate-600">Thank you, <strong>{orderPreviewName}</strong></p>
                        <button type="button" onClick={() => setIsOrderPreviewOpen(false)} className="mt-8 rounded-md bg-[#0D9488] px-6 py-3 font-bold text-white hover:bg-[#0F766E]">OK</button>
                    </section>
                </div>
            )}
        </div>
    )
}

export default PharmacyFeaturePage
