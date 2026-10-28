import { useMemo, useState } from 'react'
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

const karachiAreas = [
    { name: 'Bahadurabad', latitude: 24.882, longitude: 67.064 },
    { name: 'Clifton', latitude: 24.813, longitude: 67.030 },
    { name: 'DHA', latitude: 24.795, longitude: 67.065 },
    { name: 'Federal B Area', latitude: 24.933, longitude: 67.065 },
    { name: 'Gulistan-e-Jauhar', latitude: 24.921, longitude: 67.137 },
    { name: 'Gulshan-e-Iqbal', latitude: 24.923, longitude: 67.090 },
    { name: 'Korangi', latitude: 24.830, longitude: 67.130 },
    { name: 'Landhi', latitude: 24.846, longitude: 67.200 },
    { name: 'Liaquatabad', latitude: 24.905, longitude: 67.045 },
    { name: 'Lyari', latitude: 24.874, longitude: 66.990 },
    { name: 'Malir', latitude: 24.894, longitude: 67.198 },
    { name: 'Nazimabad', latitude: 24.926, longitude: 67.035 },
    { name: 'North Karachi', latitude: 24.991, longitude: 67.065 },
    { name: 'North Nazimabad', latitude: 24.951, longitude: 67.045 },
    { name: 'Orangi Town', latitude: 24.955, longitude: 66.995 },
    { name: 'PECHS', latitude: 24.868, longitude: 67.060 },
    { name: 'Saddar', latitude: 24.860, longitude: 67.010 },
    { name: 'Shah Faisal Colony', latitude: 24.880, longitude: 67.170 },
    { name: 'Tariq Road', latitude: 24.875, longitude: 67.055 },
]

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

const pharmacyBranches = karachiAreas.flatMap((area, index) => {
    const branchTypes = [
        { type: 'Pharmacy', offset: 1 },
        { type: 'Hospital pharmacy', offset: -1 },
    ]

    return branchTypes.map(({ type, offset }, branchIndex) => {
        const branchSeed = index * branchTypes.length + branchIndex

        return {
        id: `${area.name.toLowerCase().replaceAll(' ', '-')}-${type.toLowerCase().replaceAll(' ', '-')}`,
        name: `Sample ${type} · ${area.name}`,
        area: area.name,
        type,
        latitude: area.latitude + offset * 0.006,
        longitude: area.longitude + offset * 0.007,
        inventory: inventoryCatalog
            .filter((_, medicineIndex) => (medicineIndex + branchSeed) % 5 !== 0 || medicineIndex === 2 || medicineIndex === 7)
            .map((medicine, medicineIndex) => ({
                name: medicine.name,
                price: medicine.basePrice + ((branchSeed + medicineIndex) % 4) * 5,
                stock: medicine.restricted ? 1 + ((branchSeed + medicineIndex) % 4) : 4 + ((branchSeed * 7 + medicineIndex * 3) % 30),
                restricted: medicine.restricted,
            })),
        }
    })
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
    const [location, setLocation] = useState('')
    const [userCoordinates, setUserCoordinates] = useState(null)
    const [areaSearch, setAreaSearch] = useState('')
    const [medicineSearch, setMedicineSearch] = useState('')
    const [selectedArea, setSelectedArea] = useState('')
    const [selectedBranch, setSelectedBranch] = useState(null)
    const [shoppingList, setShoppingList] = useState([])
    const [inventoryNotice, setInventoryNotice] = useState('')
    const [inventoryFulfillment, setInventoryFulfillment] = useState(false)

    const filteredAreas = useMemo(() => {
        const query = areaSearch.trim().toLowerCase()
        return karachiAreas.filter((area) => area.name.toLowerCase().includes(query))
    }, [areaSearch])

    const filteredInventory = useMemo(() => {
        const query = medicineSearch.trim().toLowerCase()
        return (selectedBranch?.inventory ?? []).filter((medicine) => medicine.name.toLowerCase().includes(query))
    }, [medicineSearch, selectedBranch])

    const nearbyBranches = useMemo(() => {
        if (userCoordinates) {
            return pharmacyBranches
                .map((branch) => ({ ...branch, distance: distanceInKm(userCoordinates, branch) }))
                .sort((first, second) => first.distance - second.distance)
                .filter((branch, index) => branch.distance <= 20 || index < 5)
        }
        if (selectedArea) return pharmacyBranches.filter((branch) => branch.area === selectedArea)
        return []
    }, [selectedArea, userCoordinates])

    if (!featureDetails[feature]) return <Navigate to="/pharmacy" replace />

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

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            setLocation('Location services are not available in this browser. Search for a Karachi area below.')
            return
        }
        setLocation('Requesting your location…')
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                if (coords.latitude < 24.6 || coords.latitude > 25.5 || coords.longitude < 66.6 || coords.longitude > 67.5) {
                    setUserCoordinates(null)
                    setLocation('Your current location appears to be outside Karachi. Search for a Karachi area to browse the demo branch list.')
                    return
                }
                setSelectedArea('')
                setSelectedBranch(null)
                setUserCoordinates({ latitude: coords.latitude, longitude: coords.longitude })
                setShoppingList([])
                setMedicineSearch('')
                setLocation('Location received. Nearby demo branches are sorted by approximate distance.')
            },
            () => setLocation('Location access was not granted. Search for a Karachi area below.'),
            { timeout: 10000 },
        )
    }

    const handleSelectArea = (areaName) => {
        setSelectedArea(areaName)
        setSelectedBranch(null)
        setUserCoordinates(null)
        setMedicineSearch('')
        setShoppingList([])
        setInventoryNotice('')
        setInventoryFulfillment(false)
        setLocation('')
    }

    const handleSelectBranch = (branch) => {
        setSelectedBranch(branch)
        setMedicineSearch('')
        setShoppingList([])
        setInventoryNotice('')
        setInventoryFulfillment(false)
    }

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
                        This prototype has no pharmacy partner feed. Branches, approximate map points, prices, stock, delivery, and pickup below are sample data and are not live or orderable.
                    </div>
                    <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                        <label className="text-sm font-semibold text-slate-700">
                            Enter or search a Karachi area
                            <input
                                type="search"
                                value={areaSearch}
                                onChange={(event) => setAreaSearch(event.target.value)}
                                placeholder="e.g. Gulshan-e-Iqbal"
                                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100"
                            />
                        </label>
                        <button type="button" onClick={handleUseLocation} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            Use my location
                        </button>
                    </div>
                    {location && <p role="status" className="mt-2 text-xs text-slate-500">{location}</p>}
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="Karachi area suggestions">
                        {filteredAreas.map((area) => (
                            <button
                                key={area.name}
                                type="button"
                                onClick={() => handleSelectArea(area.name)}
                                aria-pressed={selectedArea === area.name}
                                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${selectedArea === area.name ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 text-slate-700 hover:border-teal-500'}`}
                            >
                                {area.name}
                            </button>
                        ))}
                        {filteredAreas.length === 0 && <p className="text-sm text-slate-500">No Karachi areas match this search.</p>}
                    </div>

                    {(selectedArea || userCoordinates) && (
                        <div className="mt-6">
                            <h2 className="text-lg font-bold text-[#0F172A]">
                                {userCoordinates ? 'Nearby pharmacy and hospital branches' : `Branches in ${selectedArea}`}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {userCoordinates
                                    ? 'Sorted by approximate distance to your location. Approximate branch coordinates are demo data.'
                                    : 'Select an example branch to preview that branch’s separate inventory.'}
                            </p>
                            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {nearbyBranches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        type="button"
                                        onClick={() => handleSelectBranch(branch)}
                                        aria-pressed={selectedBranch?.id === branch.id}
                                        className={`rounded-xl border p-4 text-left transition-colors hover:border-[#0D9488] hover:bg-teal-50 ${selectedBranch?.id === branch.id ? 'border-[#0D9488] bg-teal-50' : 'border-slate-200'}`}
                                    >
                                        <span className="block font-bold text-[#0F172A]">{branch.name}</span>
                                        <span className="mt-1 block text-xs text-slate-500">{branch.type} · {branch.area}</span>
                                        {Number.isFinite(branch.distance) && <span className="mt-1 block text-xs font-semibold text-teal-800">~{branch.distance.toFixed(1)} km away</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedBranch && (
                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <button type="button" onClick={() => setSelectedBranch(null)} className="text-sm font-semibold text-[#0D9488] hover:underline">
                                ← Back to branch list
                            </button>
                            <h2 className="mt-3 text-lg font-bold text-[#0F172A]">{selectedBranch.name} inventory</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Sample branch-specific items for {selectedBranch.area}. Stock and prices are not live.
                            </p>
                            <label className="mt-4 block text-sm font-semibold text-slate-700">
                                Search this branch’s inventory
                                <input
                                    type="search"
                                    value={medicineSearch}
                                    onChange={(event) => setMedicineSearch(event.target.value)}
                                    placeholder="Type a medicine name..."
                                    className="mt-1 block w-full sm:max-w-md rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100"
                                />
                            </label>
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
                                                <td className="px-4 py-3 text-slate-600">{medicine.stock} (sample)</td>
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
                                        {filteredInventory.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">No medicines match this branch’s inventory.</td></tr>}
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
                    )}
                </section>
            )}
        </div>
    )
}

export default PharmacyFeaturePage
