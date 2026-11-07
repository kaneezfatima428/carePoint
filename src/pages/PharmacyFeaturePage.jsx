import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

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
        description: 'Search medicines and explore pharmacy coverage in Karachi.',
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

const pharmacyBranches = Array.from({ length: 4 }, (_, index) => {
    const branchNumber = index + 1

    return {
        id: `pharmacy-${branchNumber}`,
        name: `Pharmacy ${branchNumber}`,
        city: 'Karachi',
        latitude: 24.86 + index * 0.025,
        longitude: 67.01 + index * 0.02,
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
    const [inventoryNotice, setInventoryNotice] = useState('')
    const [inventoryFulfillment, setInventoryFulfillment] = useState(false)
    const locationRequestStarted = useRef(false)

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

    const handleUseLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationStatus('Location services are not available. Showing Karachi pharmacy samples.')
            return
        }
        setLocationStatus('Requesting your location…')
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                if (coords.latitude < 24.6 || coords.latitude > 25.5 || coords.longitude < 66.6 || coords.longitude > 67.5) {
                    setUserCoordinates(null)
                    setLocation('Karachi')
                    setLocationStatus('Your location is outside Karachi. Inventory remains restricted to Karachi pharmacy samples.')
                    return
                }
                setSelectedBranch(null)
                setUserCoordinates({ latitude: coords.latitude, longitude: coords.longitude })
                setShoppingList([])
                setMedicineSearch('')
                setLocation('Karachi')
                setLocationStatus('Location detected in Karachi. Pharmacy samples are sorted by approximate distance.')
            },
            () => setLocationStatus('Location access was not granted. Showing Karachi pharmacy samples; you can search by pharmacy name.'),
            { timeout: 10000 },
        )
    }, [])

    const handleSelectBranch = (branch) => {
        setSelectedBranch(branch)
        setMedicineSearch('')
        setShoppingList([])
        setInventoryNotice('')
        setInventoryFulfillment(false)
    }

    useEffect(() => {
        if (feature === 'inventory' && !locationRequestStarted.current) {
            locationRequestStarted.current = true
            handleUseLocation()
        }
    }, [feature, handleUseLocation])

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

            {feature === 'prescription' && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                        <div>
                            <h2 className="text-lg font-bold text-[#0F172A]">Prescription review</h2>
                            <p className="text-sm text-slate-500 mt-1">Pharmacist verification is required to unlock approved medicines.</p>
                        </div>
                        <span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${prescriptionStatus === 'approved' ? 'bg-teal-100 text-teal-800' : prescriptionStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                            {prescriptionStatus === 'approved' ? 'Unlocked · Verified' : prescriptionStatus === 'pending' ? 'Pending pharmacist review' : '🔒 Medication access locked'}
                        </span>
                    </div>
                    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        Prescription submission and pharmacist review require a secure backend and staff workflow, which are not connected in this website yet. Do not upload real medical records here.
                    </div>
                    <form onSubmit={handlePrescriptionSubmit} className="flex flex-col sm:flex-row sm:items-end gap-3">
                        <label className="flex-1 text-sm font-semibold text-slate-700">
                            Prescription file (preview only)
                            <input
                                type="file"
                                accept="image/*,.pdf,application/pdf"
                                onChange={(event) => setPrescriptionFile(event.target.files?.[0] ?? null)}
                                className="mt-2 block w-full rounded-xl border border-slate-200 p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-teal-800"
                            />
                        </label>
                        <button type="submit" disabled={!prescriptionFile} className="rounded-xl bg-[#0D9488] px-5 py-3 font-semibold text-white hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:bg-slate-300">
                            Preview submission
                        </button>
                    </form>
                    {prescriptionFile && <p className="text-xs text-slate-500 mt-2">Selected locally: {prescriptionFile.name}</p>}
                    {prescriptionStatus === 'pending' && (
                        <>
                            <div role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                Preview only: no prescription has been sent to or reviewed by a pharmacist. Medication access remains locked.
                            </div>
                            <details className="mt-4 text-sm text-slate-500">
                                <summary className="cursor-pointer">Prototype state preview (not pharmacist approval)</summary>
                                <p className="mt-2">This local preview is not a clinical or pharmacy verification and must not be used to order medicine.</p>
                                <button type="button" onClick={() => setPrescriptionStatus('approved')} className="mt-2 rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">
                                    Preview unlocked layout
                                </button>
                            </details>
                        </>
                    )}
                    {prescriptionStatus !== 'approved' ? (
                        <div aria-label="Approved medications locked" className="relative mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="pointer-events-none select-none blur-sm" aria-hidden="true">
                                <p className="font-bold">Approved medications</p>
                                <p className="mt-2 text-sm">Medicines, quantity, and dosage as listed on a verified prescription</p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-bold text-slate-700">🔒 Locked until verified</div>
                        </div>
                    ) : (
                        <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50/60 p-4 sm:p-5">
                            <h3 className="font-bold text-teal-900">Unlocked layout preview</h3>
                            <p className="mt-2 text-sm text-slate-700">In a connected service, this area displays pharmacist-approved medicines. No medicines are approved in this preview.</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button type="button" onClick={() => setFulfillment('delivery')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${fulfillment === 'delivery' ? 'bg-teal-800 text-white' : 'border border-teal-300 text-teal-900 hover:bg-teal-100'}`}>Home delivery</button>
                                <button type="button" onClick={() => setFulfillment('pickup')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${fulfillment === 'pickup' ? 'bg-teal-800 text-white' : 'border border-teal-300 text-teal-900 hover:bg-teal-100'}`}>Local pickup</button>
                            </div>
                            {fulfillment && <p role="status" className="mt-3 text-sm text-teal-900">Selected {fulfillment} in the layout preview only. Ordering is not connected.</p>}
                        </div>
                    )}
                </section>
            )}

            {feature === 'inventory' && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        Showing Karachi pharmacy samples by default. This prototype has no live pharmacy feed; branch listings, prices, and stock are illustrative and orders are not connected.
                    </div>
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
                                placeholder="Karachi or pharmacy name..."
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
                            <h2 className="mt-3 text-lg font-bold text-[#0F172A]">{selectedBranch.name} · Karachi</h2>
                            <p className="mt-1 text-sm text-slate-500">Branch-specific sample inventory. Stock and prices are not live.</p>
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
                                                            <button type="button" onClick={() => setInventoryFulfillment(true)} className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-800">Home delivery</button>
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
                            {(shoppingList.length > 0 || inventoryNotice || inventoryFulfillment) && (
                                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
                                    <h3 className="font-bold text-[#0F172A]">Pickup list · {selectedBranch.name}</h3>
                                    {shoppingList.length > 0 && <p className="mt-1 text-slate-600">{shoppingList.join(', ')}</p>}
                                    {inventoryNotice && <p role="status" className="mt-1 text-teal-800">{inventoryNotice}</p>}
                                    {inventoryFulfillment && <p role="status" className="mt-1 text-teal-800">Home delivery selected for this preview only; ordering is not connected.</p>}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-6">
                            <h2 className="text-lg font-bold text-[#0F172A]">Karachi pharmacies</h2>
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
                                        <span className="mt-1 block text-xs text-slate-500">Karachi, Pakistan · {branch.matches.length} matching medicines</span>
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
                                {nearbyBranches.length === 0 && <p className="col-span-full rounded-xl border border-slate-200 p-5 text-sm text-slate-500">No Karachi pharmacy samples match both searches.</p>}
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}

export default PharmacyFeaturePage
