import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCNIC, validateCNIC } from '../utils/feeRules'
import {
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showInfoAlert,
    showConfirmAlert
} from '../utils/alert'

const DEFAULT_MEDICAL_HISTORY = {
    chronicConditions: ['Type 2 Diabetes', 'Hypertension (High BP)', 'Seasonal Asthma'],
    surgeries: [
        { id: 'surg-1', name: 'Laparoscopic Appendectomy', year: '2021', hospital: 'Shifa International Hospital, Islamabad' },
        { id: 'surg-2', name: 'Right Knee Meniscus Repair', year: '2023', hospital: 'Doctors Hospital, Lahore' }
    ],
    allergies: [
        { id: 'alg-1', allergen: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis & Facial Swelling' },
        { id: 'alg-2', allergen: 'Sulfa Drugs', severity: 'High', reaction: 'Skin Rash & Hives' },
        { id: 'alg-3', allergen: 'Dust & Pollen', severity: 'Moderate', reaction: 'Allergic Rhinitis / Sneezing' }
    ],
    familyHistory: [
        { id: 'fam-1', relation: 'Father', condition: 'Ischemic Heart Disease & Type 2 Diabetes' },
        { id: 'fam-2', relation: 'Maternal Grandmother', condition: 'Hypertension & Osteoporosis' }
    ],
    ongoingMedications: [
        { id: 'med-1', name: 'Glucophage (Metformin) 500mg', dosage: '1 tablet twice daily', purpose: 'Blood Glucose Control' },
        { id: 'med-2', name: 'Concor (Bisoprolol) 5mg', dosage: '1 tablet once in the morning', purpose: 'Blood Pressure Regulation' },
        { id: 'med-3', name: 'Ventolin Inhaler', dosage: '2 puffs as needed', purpose: 'Asthma Symptom Relief' }
    ],
    diagnosticReports: [
        { id: 'rep-1', name: 'HbA1c & Fasting Glucose Report.pdf', type: 'Blood Test', lab: 'Chughtai Healthcare Lab', date: '18 Oct 2026', size: '1.2 MB' },
        { id: 'rep-2', name: 'Chest X-Ray Digital PA View.jpg', type: 'Radiology', lab: 'Aga Khan Diagnostic Center', date: '04 Aug 2026', size: '2.6 MB' },
        { id: 'rep-3', name: 'Lipid Profile & Renal Function.pdf', type: 'Lab Test', lab: 'IDC Islamabad', date: '12 May 2026', size: '950 KB' }
    ]
}

const DEFAULT_DIGITAL_PRESCRIPTIONS = [
    {
        id: 'CP-RX-94021',
        doctorName: 'Dr. Aisha Malik',
        doctorTitle: 'Consultant General Physician (MBBS, FCPS)',
        pmdcNo: 'PMDC #48291-P',
        date: '28 Oct 2026',
        diagnosis: 'Acute Pharyngitis & Upper Respiratory Tract Infection',
        vitals: 'BP: 120/80 mmHg | Temp: 101.2°F | SpO2: 98%',
        medicines: [
            { name: 'Augmentin 625mg (Amoxicillin/Clavulanate)', dosage: '1 Tablet', frequency: 'Twice daily (Morning & Night)', duration: '5 Days', timing: 'After meals' },
            { name: 'Panadol Extra 500mg (Paracetamol)', dosage: '1 Tablet', frequency: 'Every 8 hours if fever > 100°F', duration: '3 Days', timing: 'SOS' },
            { name: 'Risek 20mg (Omeprazole)', dosage: '1 Capsule', frequency: 'Once daily in the morning', duration: '5 Days', timing: '30 mins before breakfast' },
            { name: 'Sancos Cough Syrup', dosage: '2 Teaspoons', frequency: 'Three times daily', duration: '5 Days', timing: 'After meals' }
        ],
        advice: 'Drink warm fluids, steam inhalation twice daily, and avoid cold beverages. Complete the antibiotic course.',
        ordered: false
    },
    {
        id: 'CP-RX-88104',
        doctorName: 'Dr. Tariq Mehmood',
        doctorTitle: 'Specialist Internal Medicine (MRCP, PMDC #51203)',
        pmdcNo: 'PMDC #51203-S',
        date: '12 Sep 2026',
        diagnosis: 'Gastritis & Acid Peptic Disease with Dyspepsia',
        vitals: 'BP: 125/82 mmHg | Pulse: 76 bpm',
        medicines: [
            { name: 'Nexum 40mg (Esomeprazole)', dosage: '1 Tablet', frequency: 'Once daily before breakfast', duration: '14 Days', timing: 'Before meals' },
            { name: 'Gaviscon Liquid Suspension', dosage: '2 Tablespoons', frequency: 'After meals and at bedtime', duration: '7 Days', timing: 'After meals' },
            { name: 'Motilium 10mg (Domperidone)', dosage: '1 Tablet', frequency: 'Twice daily before meals', duration: '7 Days', timing: '15 mins before meals' }
        ],
        advice: 'Avoid spicy and deep-fried foods. Take light frequent meals and do not lie down immediately after eating.',
        ordered: true
    }
]

const DEFAULT_APPOINTMENTS = [
    {
        id: 'CP-APT-701',
        doctorName: 'Dr. Ahmed Raza',
        specialty: 'Home Doctor Service',
        type: 'At-Home Visit',
        avatar: '👨‍⚕️',
        date: '10 Nov 2026',
        timeSlot: '11:30 AM - 12:30 PM',
        countdown: 'Starts in 18 hours',
        status: 'confirmed',
        location: 'House #42, Street 8, F-10/2, Islamabad',
        isOnline: false,
        feeBreakdown: { baseFee: 1000, platformFee: 70, tax: 5, total: 1075 }
    },
    {
        id: 'CP-APT-692',
        doctorName: 'Dr. Sana Tariq',
        specialty: 'Emergency Specialist Physician',
        type: 'Urgent Video Consultation',
        avatar: '👩‍⚕️',
        date: '11 Nov 2026',
        timeSlot: '04:00 PM - 04:30 PM',
        countdown: 'Tomorrow',
        status: 'pending',
        location: 'Encrypted Video Room #CR-882',
        isOnline: true,
        feeBreakdown: { baseFee: 800, platformFee: 56, tax: 4, total: 860 }
    },
    {
        id: 'CP-APT-510',
        doctorName: 'Dr. Aisha Malik',
        specialty: 'General Physician',
        type: 'Video Consultation',
        avatar: '👩‍⚕️',
        date: '28 Oct 2026',
        timeSlot: '10:00 AM',
        status: 'completed',
        location: 'CarePoint Tele-Room',
        isOnline: true,
        hasPrescription: true,
        prescriptionId: 'CP-RX-94021',
        feeBreakdown: { baseFee: 500, platformFee: 35, tax: 3, total: 538 }
    },
    {
        id: 'CP-APT-405',
        doctorName: 'Dr. Usman Shah',
        specialty: 'Home Doctor',
        type: 'At-Home Visit',
        avatar: '👨‍⚕️',
        date: '14 Oct 2026',
        timeSlot: '03:00 PM',
        status: 'completed',
        location: 'House #42, Street 8, F-10/2, Islamabad',
        isOnline: false,
        hasPrescription: true,
        prescriptionId: 'CP-RX-88104',
        feeBreakdown: { baseFee: 1200, platformFee: 84, tax: 6, total: 1290 }
    },
    {
        id: 'CP-APT-301',
        doctorName: 'Dr. Bilal Khan',
        specialty: 'General Physician',
        type: 'Clinic Appointment',
        avatar: '👨‍⚕️',
        date: '05 Sep 2026',
        timeSlot: '02:00 PM',
        status: 'cancelled',
        location: 'CarePoint Partner Clinic, Blue Area',
        cancelReason: 'Patient rescheduled due to official travel',
        feeBreakdown: { baseFee: 400, platformFee: 28, tax: 2, total: 430 }
    }
]

const PatientDashboard = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState('history')

    // 1. Medical History State
    const [medicalHistory, setMedicalHistory] = useState(DEFAULT_MEDICAL_HISTORY)
    const [newCondition, setNewCondition] = useState('')
    const [showSurgeryModal, setShowSurgeryModal] = useState(false)
    const [surgeryForm, setSurgeryForm] = useState({ name: '', year: '', hospital: '' })
    const [showAllergyModal, setShowAllergyModal] = useState(false)
    const [allergyForm, setAllergyForm] = useState({ allergen: '', severity: 'Moderate', reaction: '' })
    const [showMedModal, setShowMedModal] = useState(false)
    const [medForm, setMedForm] = useState({ name: '', dosage: '', purpose: '' })

    // 2. Prescriptions State
    const [prescriptionSubTab, setPrescriptionSubTab] = useState('digital') // 'digital' or 'uploaded'
    const [digitalPrescriptions, setDigitalPrescriptions] = useState(DEFAULT_DIGITAL_PRESCRIPTIONS)
    const [uploadedSlips, setUploadedSlips] = useState([])
    const [selectedSlip, setSelectedSlip] = useState(null)
    const [zoomModal, setZoomModal] = useState(false)
    const [activePrescriptionModal, setActivePrescriptionModal] = useState(null)

    // 3. Appointments State
    const [appointmentTab, setAppointmentTab] = useState('upcoming') // 'upcoming' | 'completed' | 'cancelled'
    const [appointments, setAppointments] = useState(DEFAULT_APPOINTMENTS)
    const [feeReceiptModal, setFeeReceiptModal] = useState(null)

    // 4. Patient Profile State
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        cnic: '',
        age: '',
        gender: 'male',
        bloodGroup: 'O+',
        phone: '+92 300 1234567',
        emergencyContactName: 'Kamran Ahmed (Brother)',
        emergencyContactPhone: '+92 321 9876543',
        address: 'House #42, Street 8, Sector F-10/2',
        city: 'Islamabad',
        area: 'F-10',
        walletBalance: 2450
    })
    const [profileSaveNotice, setProfileSaveNotice] = useState('')

    // Initialize user and storage
    useEffect(() => {
        const storedUser = localStorage.getItem('carepoint_user')
        if (storedUser) {
            const parsed = JSON.parse(storedUser)
            if (parsed.role === 'doctor') {
                navigate('/doctor-dashboard')
                return
            }
            setUser(parsed)

            // Sync profile state with stored user
            setProfileForm(prev => ({
                ...prev,
                name: parsed.name || 'Ali Ahmed',
                email: parsed.email || 'ali.ahmed@example.com',
                cnic: parsed.cnic || '35201-1234567-1',
                age: parsed.age || '32',
                gender: parsed.gender || 'male',
                bloodGroup: parsed.bloodGroup || 'O+',
                phone: parsed.phone || '+92 300 1234567',
                address: parsed.address || parsed.location || 'House #42, Street 8, F-10/2',
                city: parsed.city || parsed.location || 'Islamabad'
            }))

            // Load saved medical history
            const historyKey = `carepoint_med_history_${parsed.email || 'patient'}`
            const savedHistory = localStorage.getItem(historyKey)
            if (savedHistory) {
                try { setMedicalHistory(JSON.parse(savedHistory)) } catch (e) { console.warn(e) }
            }

            // Load saved prescription slips
            const slipKey = `carepoint_prescriptions_${parsed.email || 'patient'}`
            const savedSlips = localStorage.getItem(slipKey)
            if (savedSlips) {
                try {
                    const parsedSlips = JSON.parse(savedSlips)
                    if (Array.isArray(parsedSlips) && parsedSlips.length > 0) {
                        setUploadedSlips(parsedSlips)
                        setSelectedSlip(parsedSlips[0])
                    }
                } catch (e) { console.warn(e) }
            }
        } else {
            navigate('/login')
        }
    }, [navigate])

    if (!user) return null

    const storagePrefix = user.email || 'patient'

    const handleLogout = () => {
        localStorage.removeItem('carepoint_user')
        navigate('/login')
    }

    // Save Medical History Helper
    const saveMedicalHistory = (updated) => {
        setMedicalHistory(updated)
        try {
            localStorage.setItem(`carepoint_med_history_${storagePrefix}`, JSON.stringify(updated))
        } catch (e) { console.warn(e) }
    }

    // 1. History Handlers
    const handleAddCondition = () => {
        if (!newCondition.trim()) return
        if (medicalHistory.chronicConditions.includes(newCondition.trim())) return
        const updated = {
            ...medicalHistory,
            chronicConditions: [...medicalHistory.chronicConditions, newCondition.trim()]
        }
        saveMedicalHistory(updated)
        setNewCondition('')
    }

    const handleRemoveCondition = (condition) => {
        const updated = {
            ...medicalHistory,
            chronicConditions: medicalHistory.chronicConditions.filter(c => c !== condition)
        }
        saveMedicalHistory(updated)
    }

    const handleAddSurgery = (e) => {
        e.preventDefault()
        if (!surgeryForm.name) return
        const newSurgery = { id: `surg-${Date.now()}`, ...surgeryForm }
        const updated = { ...medicalHistory, surgeries: [newSurgery, ...medicalHistory.surgeries] }
        saveMedicalHistory(updated)
        setSurgeryForm({ name: '', year: '', hospital: '' })
        setShowSurgeryModal(false)
    }

    const handleRemoveSurgery = (id) => {
        const updated = { ...medicalHistory, surgeries: medicalHistory.surgeries.filter(s => s.id !== id) }
        saveMedicalHistory(updated)
    }

    const handleAddAllergy = (e) => {
        e.preventDefault()
        if (!allergyForm.allergen) return
        const newAllergy = { id: `alg-${Date.now()}`, ...allergyForm }
        const updated = { ...medicalHistory, allergies: [newAllergy, ...medicalHistory.allergies] }
        saveMedicalHistory(updated)
        setAllergyForm({ allergen: '', severity: 'Moderate', reaction: '' })
        setShowAllergyModal(false)
    }

    const handleRemoveAllergy = (id) => {
        const updated = { ...medicalHistory, allergies: medicalHistory.allergies.filter(a => a.id !== id) }
        saveMedicalHistory(updated)
    }

    const handleAddMedication = (e) => {
        e.preventDefault()
        if (!medForm.name) return
        const newMed = { id: `med-${Date.now()}`, ...medForm }
        const updated = { ...medicalHistory, ongoingMedications: [newMed, ...medicalHistory.ongoingMedications] }
        saveMedicalHistory(updated)
        setMedForm({ name: '', dosage: '', purpose: '' })
        setShowMedModal(false)
    }

    const handleRemoveMedication = (id) => {
        const updated = { ...medicalHistory, ongoingMedications: medicalHistory.ongoingMedications.filter(m => m.id !== id) }
        saveMedicalHistory(updated)
    }

    // Diagnostic Report File Upload
    const handleReportUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const newReport = {
            id: `rep-${Date.now()}`,
            name: file.name,
            type: file.type?.includes('image') ? 'X-Ray / Scan' : 'Diagnostic Lab Report',
            lab: 'Patient Uploaded Record',
            date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        }
        const updated = { ...medicalHistory, diagnosticReports: [newReport, ...medicalHistory.diagnosticReports] }
        saveMedicalHistory(updated)
        e.target.value = ''
    }

    const handleRemoveReport = (id) => {
        const updated = { ...medicalHistory, diagnosticReports: medicalHistory.diagnosticReports.filter(r => r.id !== id) }
        saveMedicalHistory(updated)
    }

    // 2. Prescription Handlers
    const handlePrescriptionFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
            const newSlip = {
                id: `slip-${Date.now()}`,
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                url: event.target?.result,
                type: file.type || 'image/jpeg'
            }
            const updated = [newSlip, ...uploadedSlips]
            setUploadedSlips(updated)
            setSelectedSlip(newSlip)
            try {
                localStorage.setItem(`carepoint_prescriptions_${storagePrefix}`, JSON.stringify(updated))
            } catch (err) { console.warn(err) }
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    const handleDeleteSlip = async (id) => {
        const confirmed = await showConfirmAlert(
            'Delete Prescription Slip?',
            'Are you sure you want to delete this prescription file?',
            'Yes, Delete',
            'Keep'
        )
        if (!confirmed) return
        const updated = uploadedSlips.filter(s => s.id !== id)
        setUploadedSlips(updated)
        if (selectedSlip?.id === id) {
            setSelectedSlip(updated.length > 0 ? updated[0] : null)
        }
        try {
            localStorage.setItem(`carepoint_prescriptions_${storagePrefix}`, JSON.stringify(updated))
        } catch (err) { console.warn(err) }
        showSuccessAlert('Deleted', 'Prescription slip has been removed.')
    }

    const handleOrderViaPharmacy = async (rx) => {
        await showSuccessAlert(
            'Prescription Loaded!',
            `All prescribed medicines from Dr. ${rx.doctorName}'s prescription have been added to your order. Navigating to Pharmacy...`
        )
        navigate('/pharmacy')
    }

    // 3. Appointment Handlers
    const handleCancelAppointment = async (id) => {
        const confirmed = await showConfirmAlert(
            'Cancel Appointment?',
            'Are you sure you want to cancel this booking? A 100% refund will be credited to your CarePoint Wallet.',
            'Yes, Cancel Booking',
            'Keep Appointment'
        )
        if (!confirmed) return
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled', cancelReason: 'Cancelled by patient' } : a))
        showSuccessAlert('Booking Cancelled', 'Appointment has been cancelled and funds refunded to your CarePoint wallet.')
    }

    const handleReschedule = (id) => {
        showInfoAlert(
            'Reschedule Requested',
            `Rescheduling request submitted for Booking ${id}. Our patient coordinator will contact you to select a new slot.`
        )
    }

    // 4. Profile Save Handler
    const handleSaveProfile = (e) => {
        e.preventDefault()
        if (profileForm.cnic && !validateCNIC(profileForm.cnic)) {
            showErrorAlert('Invalid CNIC', 'Please enter a valid 13-digit Pakistani CNIC (XXXXX-XXXXXXX-X).')
            return
        }
        const updatedUser = { ...user, ...profileForm }
        setUser(updatedUser)
        localStorage.setItem('carepoint_user', JSON.stringify(updatedUser))
        showSuccessAlert('Profile Saved', 'Profile updated successfully! All emergency and delivery details saved.')
    }

    const sidebarItems = [
        { id: 'profile', label: 'Patient Profile', icon: '👤', desc: 'Identity, Contact & Addresses' },
        { id: 'history', label: 'Past Medical History', icon: '📋', desc: 'Conditions, Surgeries & Allergies' },
        { id: 'prescriptions', label: 'My Prescriptions', icon: '💊', desc: 'Digital Rx & Uploaded Slips' },
        { id: 'appointments', label: 'My Appointments', icon: '📅', desc: 'Upcoming, Past & Receipts' },
        { id: 'settings', label: 'Account & Security', icon: '⚙️', desc: 'Security & Consent' },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
            {/* Top Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span>›</span>
                <span className="text-[#0D9488] font-medium">Patient Health Portal</span>
                <span>›</span>
                <span className="text-slate-700 font-semibold capitalize">{activeTab}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Modern Patient Sidebar */}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D9488]/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white/20 shrink-0">
                                {profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'P'}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-extrabold text-lg text-white truncate">{profileForm.name}</h3>
                                <p className="text-teal-300 text-xs font-mono font-medium mt-0.5">ID: CP-PT-98124</p>
                                <span className="inline-block mt-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                                    ● Active Patient
                                </span>
                            </div>
                        </div>

                        {/* Health Quick Badges */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-700/60 text-xs">
                            <div className="bg-white/5 rounded-xl p-2.5">
                                <span className="text-slate-400 text-[10px] block">Blood Group</span>
                                <span className="font-bold text-rose-400 text-sm">{profileForm.bloodGroup}</span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-2.5">
                                <span className="text-slate-400 text-[10px] block">CarePoint Wallet</span>
                                <span className="font-bold text-teal-300 text-sm">PKR {profileForm.walletBalance}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden p-2 space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all cursor-pointer ${
                                    activeTab === item.id
                                        ? 'bg-[#0D9488] text-white shadow-md'
                                        : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{item.icon}</span>
                                    <div>
                                        <p className="font-bold text-sm leading-tight">{item.label}</p>
                                        <p className={`text-[11px] ${activeTab === item.id ? 'text-teal-100' : 'text-slate-400'}`}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs opacity-60">→</span>
                            </button>
                        ))}

                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-[#F43F5E] hover:bg-rose-50 transition-all text-left cursor-pointer"
                            >
                                <span>🚪</span> Logout Securely
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Dynamic Viewport */}
                <main className="flex-1 min-w-0 w-full space-y-6">

                    {/* ========================================================= */}
                    {/* 1. PAST MEDICAL HISTORY TAB                               */}
                    {/* ========================================================= */}
                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            {/* Header Banner */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-[#0D9488] px-3.5 py-1 rounded-full text-xs font-bold mb-2">
                                            📋 Complete Patient Health Record
                                        </div>
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                                            Past Medical History
                                        </h1>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1">
                                            A unified medical record shared securely with CarePoint doctors and specialists during visits.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md cursor-pointer inline-flex items-center gap-2 transition-all">
                                            <span>📤</span> Attach Lab / X-Ray
                                            <input type="file" accept="image/*,.pdf" onChange={handleReportUpload} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Section 1A: Existing & Chronic Conditions Tags */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <h3 className="text-base font-extrabold text-[#0F172A] mb-1 flex items-center gap-2">
                                    <span>🩺</span> Existing &amp; Chronic Conditions
                                </h3>
                                <p className="text-slate-500 text-xs mb-4">
                                    Pre-existing chronic illnesses that attending doctors must know before prescribing treatment.
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {medicalHistory.chronicConditions.map((condition, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-teal-50 border border-teal-200 text-[#0D9488] font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-2xs"
                                        >
                                            <span>●</span> {condition}
                                            <button
                                                onClick={() => handleRemoveCondition(condition)}
                                                className="text-teal-400 hover:text-rose-500 font-bold ml-1 cursor-pointer"
                                                title="Remove tag"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                {/* Add Condition Input */}
                                <div className="flex items-center gap-2 max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Add condition (e.g. Arthritis, Migraine, Thyroid)"
                                        value={newCondition}
                                        onChange={(e) => setNewCondition(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCondition() } }}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#0D9488]"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCondition}
                                        className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                                    >
                                        + Add Tag
                                    </button>
                                </div>
                            </div>

                            {/* Section 1B: Allergies & Drug Reactions (High Priority Red Section) */}
                            <div className="bg-rose-50/40 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-black text-sm">
                                            ⚠️
                                        </span>
                                        <div>
                                            <h3 className="text-base font-extrabold text-rose-950">
                                                Allergies &amp; Adverse Drug Reactions
                                            </h3>
                                            <p className="text-rose-700/80 text-xs">
                                                High-priority safety alert section visible to all prescribing doctors to prevent fatal reactions.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowAllergyModal(true)}
                                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                                    >
                                        + Add Allergy
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                                    {medicalHistory.allergies.map((allergy) => (
                                        <div
                                            key={allergy.id}
                                            className="bg-white border border-rose-200 rounded-2xl p-3.5 shadow-2xs relative flex flex-col justify-between"
                                        >
                                            <button
                                                onClick={() => handleRemoveAllergy(allergy.id)}
                                                className="absolute top-2.5 right-2.5 text-slate-300 hover:text-rose-600 text-xs font-bold cursor-pointer"
                                            >
                                                ✕
                                            </button>
                                            <div>
                                                <span className="inline-block text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 mb-1.5">
                                                    {allergy.severity} Severity
                                                </span>
                                                <p className="font-extrabold text-slate-900 text-sm">{allergy.allergen}</p>
                                                <p className="text-slate-500 text-xs mt-1">Reaction: {allergy.reaction}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 1C: Ongoing Medications & Past Surgeries (Two Columns) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Ongoing Medications */}
                                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                                <span>💊</span> Ongoing Daily Medications
                                            </h3>
                                            <button
                                                onClick={() => setShowMedModal(true)}
                                                className="text-[#0D9488] hover:text-[#0F766E] font-bold text-xs cursor-pointer"
                                            >
                                                + Add Med
                                            </button>
                                        </div>
                                        <p className="text-slate-500 text-xs mb-4">Medications currently taken every day.</p>

                                        <div className="space-y-2.5">
                                            {medicalHistory.ongoingMedications.map((med) => (
                                                <div key={med.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="font-bold text-xs text-[#0F172A]">{med.name}</p>
                                                        <p className="text-[11px] text-[#0D9488] font-semibold">{med.dosage}</p>
                                                        <p className="text-[10px] text-slate-400">{med.purpose}</p>
                                                    </div>
                                                    <button onClick={() => handleRemoveMedication(med.id)} className="text-slate-400 hover:text-rose-500 text-xs cursor-pointer">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Past Surgeries & Procedures */}
                                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                                <span>🏥</span> Past Surgeries &amp; Procedures
                                            </h3>
                                            <button
                                                onClick={() => setShowSurgeryModal(true)}
                                                className="text-[#0D9488] hover:text-[#0F766E] font-bold text-xs cursor-pointer"
                                            >
                                                + Add Surgery
                                            </button>
                                        </div>
                                        <p className="text-slate-500 text-xs mb-4">Major inpatient hospitalizations or operative history.</p>

                                        <div className="space-y-2.5">
                                            {medicalHistory.surgeries.map((surg) => (
                                                <div key={surg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-xs text-[#0F172A]">{surg.name}</p>
                                                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">{surg.year}</span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-400 mt-0.5">📍 {surg.hospital}</p>
                                                    </div>
                                                    <button onClick={() => handleRemoveSurgery(surg.id)} className="text-slate-400 hover:text-rose-500 text-xs cursor-pointer">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 1D: Family History */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <h3 className="text-base font-extrabold text-[#0F172A] mb-1 flex items-center gap-2">
                                    <span>🧬</span> Family Medical History (Hereditary Risks)
                                </h3>
                                <p className="text-slate-500 text-xs mb-4">
                                    Genetic pre-dispositions that help doctors assess cardiovascular, oncological, and metabolic risks.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {medicalHistory.familyHistory.map((fam) => (
                                        <div key={fam.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-base shrink-0">
                                                👨‍👩‍👧
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">{fam.relation}</p>
                                                <p className="text-xs text-slate-500 font-medium">{fam.condition}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 1E: Lab & Diagnostic Uploads */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                                            <span>🔬</span> Lab &amp; Diagnostic Reports Uploaded
                                        </h3>
                                        <p className="text-slate-500 text-xs mt-0.5">
                                            Attach blood tests, MRI scans, Ultrasounds, and X-ray records.
                                        </p>
                                    </div>
                                    <label className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm">
                                        <span>📁</span> Choose File
                                        <input type="file" accept="image/*,.pdf" onChange={handleReportUpload} className="hidden" />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {medicalHistory.diagnosticReports.map((rep) => (
                                        <div key={rep.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-[#0D9488] flex items-center justify-center text-lg shrink-0">
                                                    📄
                                                </div>
                                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                                                    {rep.type}
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <p className="font-bold text-xs text-slate-900 truncate" title={rep.name}>{rep.name}</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">📍 {rep.lab} • {rep.date}</p>
                                                <p className="text-[10px] text-teal-600 font-semibold mt-1">Size: {rep.size}</p>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-3">
                                                <button
                                                    onClick={() => showInfoAlert('Accessing Diagnostic Record', `Opening ${rep.name} from lab archive.`)}
                                                    className="text-xs text-[#0D9488] hover:underline font-bold cursor-pointer"
                                                >
                                                    View / Download
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveReport(rep.id)}
                                                    className="text-xs text-slate-400 hover:text-rose-500 cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 2. MY PRESCRIPTIONS TAB                                   */}
                    {/* ========================================================= */}
                    {activeTab === 'prescriptions' && (
                        <div className="space-y-6">
                            {/* Sub-tab Navigation */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] flex items-center gap-2">
                                        <span>💊</span> Patient Prescriptions &amp; Meds
                                    </h1>
                                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                                        View verified doctor e-prescriptions or upload your handwritten physical prescription slips.
                                    </p>
                                </div>

                                <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0">
                                    <button
                                        onClick={() => setPrescriptionSubTab('digital')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            prescriptionSubTab === 'digital'
                                                ? 'bg-[#0D9488] text-white shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        📝 Digital e-Prescriptions ({digitalPrescriptions.length})
                                    </button>
                                    <button
                                        onClick={() => setPrescriptionSubTab('uploaded')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            prescriptionSubTab === 'uploaded'
                                                ? 'bg-[#0D9488] text-white shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        📸 Uploaded Slips ({uploadedSlips.length})
                                    </button>
                                </div>
                            </div>

                            {/* SUB-TAB A: DIGITAL e-PRESCRIPTIONS (Table layout with 1-click Order) */}
                            {prescriptionSubTab === 'digital' && (
                                <div className="space-y-6">
                                    {digitalPrescriptions.map((rx) => (
                                        <div key={rx.id} className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                                            {/* Prescription Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-[#0D9488] flex items-center justify-center text-2xl font-bold shrink-0">
                                                        🩺
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-extrabold text-[#0F172A]">{rx.doctorName}</h2>
                                                        <p className="text-xs text-[#0D9488] font-bold">{rx.doctorTitle}</p>
                                                        <p className="text-[11px] text-slate-400">{rx.pmdcNo} • CarePoint Verified Specialist</p>
                                                    </div>
                                                </div>

                                                <div className="flex sm:flex-col sm:items-end justify-between text-xs text-slate-500">
                                                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">ID: {rx.id}</span>
                                                    <span className="mt-1">🗓️ {rx.date}</span>
                                                </div>
                                            </div>

                                            {/* Diagnosis & Symptoms */}
                                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Diagnosis</span>
                                                    <p className="font-bold text-[#0F172A] text-sm">{rx.diagnosis}</p>
                                                </div>
                                                {rx.vitals && (
                                                    <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 font-mono text-[11px] text-slate-600">
                                                        {rx.vitals}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Medicines Table */}
                                            <div>
                                                <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-3">
                                                    Prescribed Medications &amp; Schedule
                                                </h3>
                                                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                                                    <table className="w-full text-left text-xs">
                                                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                                                            <tr>
                                                                <th className="py-3 px-4">Medicine Name</th>
                                                                <th className="py-3 px-4">Dosage &amp; Frequency</th>
                                                                <th className="py-3 px-4">Duration &amp; Timing</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {rx.medicines.map((med, mIdx) => (
                                                                <tr key={mIdx} className="hover:bg-slate-50/50">
                                                                    <td className="py-3 px-4 font-extrabold text-slate-900">
                                                                        💊 {med.name}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-[#0D9488] font-bold">
                                                                        {med.dosage} — {med.frequency}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-slate-600 font-medium">
                                                                        {med.duration} ({med.timing})
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Doctor Notes & Lifestyle Advice */}
                                            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-2.5">
                                                <span className="text-base">💡</span>
                                                <div>
                                                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-800 block mb-0.5">
                                                        Doctor's Clinical Notes &amp; Lifestyle Advice
                                                    </span>
                                                    <p className="leading-relaxed">{rx.advice}</p>
                                                </div>
                                            </div>

                                            {/* Actions & Quick Options */}
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                                                <button
                                                    onClick={() => showSuccessAlert('Generating PDF', `Downloading official e-prescription document for ${rx.id}...`)}
                                                    className="w-full sm:w-auto bg-white border border-slate-200 hover:border-[#0D9488] hover:text-[#0D9488] text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    <span>⬇️</span> Download Official PDF
                                                </button>

                                                <button
                                                    onClick={() => handleOrderViaPharmacy(rx)}
                                                    className="w-full sm:w-auto bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    <span>🛒</span> 1-Click Order via Pharmacy →
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* SUB-TAB B: UPLOADED PRESCRIPTION SLIPS (Big-size viewer & zoom modal) */}
                            {prescriptionSubTab === 'uploaded' && (
                                <div className="space-y-6">
                                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                                        <div>
                                            <h3 className="font-extrabold text-slate-900 text-base">Handwritten &amp; Physical Prescription Slips</h3>
                                            <p className="text-xs text-slate-500">Pick any image to inspect it in full high-resolution size.</p>
                                        </div>
                                        <label className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer inline-flex items-center gap-2 transition-all">
                                            <span>📁</span> Choose File
                                            <input type="file" accept="image/*,.pdf" onChange={handlePrescriptionFileUpload} className="hidden" />
                                        </label>
                                    </div>

                                    {selectedSlip ? (
                                        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                                            {/* Action bar */}
                                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-extrabold text-sm text-[#0F172A]">{selectedSlip.name}</p>
                                                    <p className="text-[11px] text-slate-400">Size: {selectedSlip.size} • Uploaded {selectedSlip.date}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setZoomModal(true)}
                                                        className="bg-white border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs hover:border-[#0D9488]"
                                                    >
                                                        🔍 Fullscreen Zoom
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSlip(selectedSlip.id)}
                                                        className="bg-rose-50 border border-rose-200 text-[#F43F5E] px-3.5 py-1.5 rounded-xl text-xs font-bold"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Big Size Display */}
                                            <div className="bg-slate-900/5 border-2 border-dashed border-teal-300 rounded-3xl p-4 sm:p-6 text-center">
                                                <img
                                                    src={selectedSlip.url}
                                                    alt="Prescription Large Preview"
                                                    onClick={() => setZoomModal(true)}
                                                    className="w-full max-h-[700px] object-contain rounded-2xl shadow-xl border border-slate-200 bg-white cursor-zoom-in mx-auto"
                                                />
                                                <p className="text-xs text-slate-400 mt-3 font-medium">
                                                    💡 Click on image to view in fullscreen high-resolution mode
                                                </p>
                                            </div>

                                            {/* Gallery Strip */}
                                            {uploadedSlips.length > 1 && (
                                                <div className="pt-4 border-t border-slate-100">
                                                    <h4 className="font-bold text-xs text-slate-500 mb-3 uppercase">All Uploaded Slips</h4>
                                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                                        {uploadedSlips.map(slip => (
                                                            <div
                                                                key={slip.id}
                                                                onClick={() => setSelectedSlip(slip)}
                                                                className={`p-2 border-2 rounded-2xl cursor-pointer text-center bg-white ${selectedSlip.id === slip.id ? 'border-[#0D9488] ring-2 ring-teal-200' : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                                                            >
                                                                <div className="h-16 rounded-xl bg-slate-50 overflow-hidden mb-1">
                                                                    <img src={slip.url} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <p className="text-[10px] font-bold text-slate-800 truncate">{slip.name}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
                                            <div className="text-5xl mb-3">📸</div>
                                            <h3 className="font-bold text-base text-slate-800">No Physical Slips Uploaded</h3>
                                            <p className="text-xs text-slate-400 mt-1 mb-5">Click Choose File above to upload a scan or photo of your prescription.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 3. MY APPOINTMENTS TAB                                    */}
                    {/* ========================================================= */}
                    {activeTab === 'appointments' && (
                        <div className="space-y-6">
                            {/* Navigation Bar */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] flex items-center gap-2">
                                        <span>📅</span> My Appointments
                                    </h1>
                                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                                        Manage your upcoming healthcare bookings, home visits, and consultation history.
                                    </p>
                                </div>

                                {/* Status Tabs */}
                                <div className="flex bg-slate-100 p-1 rounded-2xl">
                                    {(['upcoming', 'completed', 'cancelled']).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setAppointmentTab(tab)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                                                appointmentTab === tab
                                                    ? 'bg-[#0D9488] text-white shadow-sm'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            {tab} ({appointments.filter(a => a.status === tab || (tab === 'upcoming' && a.status === 'confirmed') || (tab === 'upcoming' && a.status === 'pending')).length})
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filtered Appointments List */}
                            <div className="space-y-4">
                                {appointments
                                    .filter(a => {
                                        if (appointmentTab === 'upcoming') return a.status === 'confirmed' || a.status === 'pending'
                                        return a.status === appointmentTab
                                    })
                                    .map((apt) => (
                                        <div
                                            key={apt.id}
                                            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-3xl shrink-0">
                                                        {apt.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-extrabold text-base text-[#0F172A]">{apt.doctorName}</h3>
                                                            <span className="text-[10px] bg-teal-50 text-[#0D9488] border border-teal-200 px-2 py-0.5 rounded-md font-bold">
                                                                {apt.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{apt.specialty}</p>
                                                        <p className="text-xs text-slate-400 mt-1">📍 {apt.location}</p>
                                                    </div>
                                                </div>

                                                <div className="flex sm:flex-col sm:items-end justify-between text-xs">
                                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                                        apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                        apt.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                        apt.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                        'bg-rose-50 text-rose-700 border border-rose-200'
                                                    }`}>
                                                        ● {apt.status}
                                                    </span>
                                                    <span className="font-mono text-[11px] text-slate-400 mt-1">ID: {apt.id}</span>
                                                </div>
                                            </div>

                                            {/* Schedule & Countdown Bar */}
                                            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800">🗓️ {apt.date}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="font-semibold text-slate-600">⏰ {apt.timeSlot}</span>
                                                </div>
                                                {apt.countdown && (
                                                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D9488] bg-teal-50 px-3 py-1 rounded-full">
                                                        <span>⏳</span> {apt.countdown}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Fee Summary & Actions */}
                                            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Paid Total</span>
                                                        <span className="font-black text-base text-[#0D9488]">PKR {apt.feeBreakdown.total}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setFeeReceiptModal(apt)}
                                                        className="text-[11px] text-slate-500 hover:text-[#0D9488] underline font-semibold cursor-pointer"
                                                    >
                                                        View Receipt Breakdown
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {apt.status === 'confirmed' && (
                                                        <>
                                                            <button
                                                                onClick={() => showInfoAlert('Consultation Room', 'The encrypted video room opens automatically 10 minutes prior to the scheduled slot.')}
                                                                className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer"
                                                            >
                                                                {apt.isOnline ? '📹 Join Video Call' : '📍 Track Doctor ETA'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleReschedule(apt.id)}
                                                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl cursor-pointer"
                                                            >
                                                                Reschedule
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelAppointment(apt.id)}
                                                                className="bg-rose-50 hover:bg-rose-100 text-[#F43F5E] font-bold text-xs px-3 py-2 rounded-xl cursor-pointer"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}

                                                    {apt.status === 'completed' && (
                                                        <>
                                                            {apt.hasPrescription && (
                                                                <button
                                                                    onClick={() => { setActiveTab('prescriptions'); setPrescriptionSubTab('digital') }}
                                                                    className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                                                                >
                                                                    <span>💊</span> View Prescription
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => showSuccessAlert('Feedback Received', 'Thank you for rating your consultation!')}
                                                                className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs px-3 py-2 rounded-xl cursor-pointer"
                                                            >
                                                                ⭐ Rate Visit
                                                            </button>
                                                        </>
                                                    )}

                                                    {apt.status === 'cancelled' && (
                                                        <span className="text-xs text-rose-500 font-semibold">
                                                            Reason: {apt.cancelReason || 'Cancelled'} (100% Refunded to Wallet)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 4. PATIENT PROFILE TAB                                    */}
                    {/* ========================================================= */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-1">
                                    Patient Profile &amp; Demographics
                                </h1>
                                <p className="text-slate-500 text-xs sm:text-sm">
                                    Manage identity, verified contact numbers, emergency guardians, and location for home visits.
                                </p>
                            </div>

                            {profileSaveNotice && (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                                    <span>✅</span> {profileSaveNotice}
                                </div>
                            )}

                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                        <span>👤</span> 1. Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0D9488]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">CNIC / B-Form Number *</label>
                                            <input
                                                type="text"
                                                required
                                                maxLength={15}
                                                value={profileForm.cnic}
                                                onChange={(e) => setProfileForm({ ...profileForm, cnic: formatCNIC(e.target.value) })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#0D9488] outline-none focus:border-[#0D9488]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Age (Years) *</label>
                                            <input
                                                type="number"
                                                required
                                                value={profileForm.age}
                                                onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0D9488]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Gender *</label>
                                            <select
                                                value={profileForm.gender}
                                                onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0D9488]"
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Blood Group *</label>
                                            <select
                                                value={profileForm.bloodGroup}
                                                onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rose-600 outline-none focus:border-[#0D9488]"
                                            >
                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                    <option key={bg} value={bg}>{bg}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                disabled
                                                value={profileForm.email}
                                                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact & Emergency Details */}
                                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                        <span>📞</span> 2. Contact &amp; Emergency Guardian
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Phone Number (OTP Verified) *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={profileForm.phone}
                                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0D9488]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Emergency Contact Person *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Tariq Ahmed (Brother)"
                                                value={profileForm.emergencyContactName}
                                                onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0D9488]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Emergency Contact Phone *</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+92 300 0000000"
                                                value={profileForm.emergencyContactPhone}
                                                onChange={(e) => setProfileForm({ ...profileForm, emergencyContactPhone: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rose-600 outline-none focus:border-[#0D9488]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Address for Home Visits */}
                                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                        <span>📍</span> 3. Location &amp; Home Address Management
                                    </h3>
                                    <p className="text-xs text-slate-400">Essential for at-home doctors, emergency nurse dispatches, and pharmacy deliveries.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Primary Home Address *</label>
                                            <input
                                                type="text"
                                                required
                                                value={profileForm.address}
                                                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0D9488]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">City / Region *</label>
                                            <input
                                                type="text"
                                                required
                                                value={profileForm.city}
                                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0D9488]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Wallet & Payment Settings */}
                                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                            <span>💳</span> 4. Account Wallet &amp; Payment Methods
                                        </h3>
                                        <span className="text-xs font-bold text-[#0D9488]">Balance: PKR {profileForm.walletBalance}</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="p-3.5 border border-teal-200 rounded-2xl bg-teal-50/50 flex items-center gap-3">
                                            <div className="text-2xl">📱</div>
                                            <div>
                                                <p className="font-bold text-xs text-slate-900">JazzCash Wallet</p>
                                                <p className="text-[10px] text-teal-700">0300-1234567 • Primary</p>
                                            </div>
                                        </div>
                                        <div className="p-3.5 border border-slate-200 rounded-2xl bg-slate-50 flex items-center gap-3">
                                            <div className="text-2xl">💳</div>
                                            <div>
                                                <p className="font-bold text-xs text-slate-900">HBL Debit Card</p>
                                                <p className="text-[10px] text-slate-400">**** 4910</p>
                                            </div>
                                        </div>
                                        <div className="p-3.5 border border-slate-200 rounded-2xl bg-slate-50 flex items-center gap-3">
                                            <div className="text-2xl">⚡</div>
                                            <div>
                                                <p className="font-bold text-xs text-slate-900">EasyPaisa</p>
                                                <p className="text-[10px] text-slate-400">Linked</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                                    >
                                        Save Profile Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 5. ACCOUNT SETTINGS TAB                                   */}
                    {/* ========================================================= */}
                    {activeTab === 'settings' && (
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mb-1">
                                Account &amp; Privacy Settings
                            </h2>
                            <p className="text-slate-500 text-xs sm:text-sm">Manage security protocols, passwords, and data consent.</p>

                            <div className="divide-y divide-slate-100">
                                <div className="py-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">Two-Factor Authentication (2FA)</p>
                                        <p className="text-xs text-slate-400">Receive SMS verification code for all bookings.</p>
                                    </div>
                                    <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">Enabled</span>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">Medical Data Sharing Consent</p>
                                        <p className="text-xs text-slate-400">Share past medical history only with booked doctors.</p>
                                    </div>
                                    <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">Active</span>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">Password</p>
                                        <p className="text-xs text-slate-400">Last changed 2 months ago.</p>
                                    </div>
                                    <button onClick={() => showSuccessAlert('Reset Link Dispatched', 'Password update instructions have been securely sent to your email.')} className="bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer">
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* MODALS */}
            {/* Surgery Add Modal */}
            {showSurgeryModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="font-extrabold text-base text-slate-900 mb-3">+ Record Past Surgery / Procedure</h3>
                        <form onSubmit={handleAddSurgery} className="space-y-3">
                            <input
                                type="text"
                                required
                                placeholder="Surgery Name (e.g. Gallbladder Removal)"
                                value={surgeryForm.name}
                                onChange={(e) => setSurgeryForm({ ...surgeryForm, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D9488]"
                            />
                            <input
                                type="text"
                                required
                                placeholder="Year (e.g. 2022)"
                                value={surgeryForm.year}
                                onChange={(e) => setSurgeryForm({ ...surgeryForm, year: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D9488]"
                            />
                            <input
                                type="text"
                                required
                                placeholder="Hospital / Surgeon (e.g. PIMS Islamabad)"
                                value={surgeryForm.hospital}
                                onChange={(e) => setSurgeryForm({ ...surgeryForm, hospital: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D9488]"
                            />
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowSurgeryModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                                <button type="submit" className="bg-[#0D9488] text-white px-4 py-2 rounded-xl text-xs font-bold">Save Surgery</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Allergy Add Modal */}
            {showAllergyModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="font-extrabold text-base text-slate-900 mb-3">+ Record Drug / Food Allergy</h3>
                        <form onSubmit={handleAddAllergy} className="space-y-3">
                            <input
                                type="text"
                                required
                                placeholder="Allergen Name (e.g. Aspirin, Ceftriaxone, Peanuts)"
                                value={allergyForm.allergen}
                                onChange={(e) => setAllergyForm({ ...allergyForm, allergen: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D9488]"
                            />
                            <select
                                value={allergyForm.severity}
                                onChange={(e) => setAllergyForm({ ...allergyForm, severity: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D9488]"
                            >
                                <option value="Mild">Mild Severity</option>
                                <option value="Moderate">Moderate Severity</option>
                                <option value="High">High Severity</option>
                                <option value="Severe">Severe (Anaphylaxis Risk)</option>
                            </select>
                            <input
                                type="text"
                                required
                                placeholder="Reaction / Symptoms (e.g. Breathlessness, Hives)"
                                value={allergyForm.reaction}
                                onChange={(e) => setAllergyForm({ ...allergyForm, reaction: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D9488]"
                            />
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowAllergyModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                                <button type="submit" className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Save Allergy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Ongoing Medication Add Modal */}
            {showMedModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="font-extrabold text-base text-slate-900 mb-3">+ Add Ongoing Medication</h3>
                        <form onSubmit={handleAddMedication} className="space-y-3">
                            <input
                                type="text"
                                required
                                placeholder="Medicine Name & Strength (e.g. Panadol 500mg)"
                                value={medForm.name}
                                onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D9488]"
                            />
                            <input
                                type="text"
                                required
                                placeholder="Dosage & Frequency (e.g. 1 tab morning & night)"
                                value={medForm.dosage}
                                onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D9488]"
                            />
                            <input
                                type="text"
                                required
                                placeholder="Purpose (e.g. Pain relief, Heart health)"
                                value={medForm.purpose}
                                onChange={(e) => setMedForm({ ...medForm, purpose: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D9488]"
                            />
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowMedModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                                <button type="submit" className="bg-[#0D9488] text-white px-4 py-2 rounded-xl text-xs font-bold">Save Medication</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Fee Receipt Modal */}
            {feeReceiptModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setFeeReceiptModal(null)}>
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <h3 className="font-extrabold text-base text-slate-900">🧾 Consultation Fee Receipt</h3>
                            <button onClick={() => setFeeReceiptModal(null)} className="text-slate-400 font-bold hover:text-slate-700">✕</button>
                        </div>
                        <div className="space-y-2 text-xs text-slate-600">
                            <div className="flex justify-between"><span>Booking Ref:</span><span className="font-mono font-bold text-slate-800">{feeReceiptModal.id}</span></div>
                            <div className="flex justify-between"><span>Specialist:</span><span className="font-bold text-slate-800">{feeReceiptModal.doctorName}</span></div>
                            <div className="flex justify-between"><span>Service:</span><span className="font-bold text-slate-800">{feeReceiptModal.type}</span></div>
                            <div className="pt-2 border-t border-slate-100 flex justify-between"><span>Provider Base Consultation Fee:</span><span className="font-semibold">PKR {feeReceiptModal.feeBreakdown.baseFee}</span></div>
                            <div className="flex justify-between"><span>CarePoint Platform Commission (7%):</span><span className="font-semibold">+ PKR {feeReceiptModal.feeBreakdown.platformFee}</span></div>
                            <div className="flex justify-between"><span>Provincial Service Tax (5% PST):</span><span className="font-semibold">+ PKR {feeReceiptModal.feeBreakdown.tax}</span></div>
                            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-[#0D9488]">
                                <span>Total Paid:</span>
                                <span>PKR {feeReceiptModal.feeBreakdown.total}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setFeeReceiptModal(null)}
                            className="mt-6 w-full bg-[#0D9488] text-white py-2.5 rounded-xl font-bold text-xs"
                        >
                            Close Receipt
                        </button>
                    </div>
                </div>
            )}

            {/* Fullscreen Zoom Modal for Uploaded Slips */}
            {zoomModal && selectedSlip && (
                <div
                    className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setZoomModal(false)}
                >
                    <div className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => setZoomModal(false)}
                            className="absolute -top-12 right-0 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl cursor-pointer"
                        >
                            ✕
                        </button>
                        <img
                            src={selectedSlip.url}
                            alt="Prescription Fullscreen"
                            className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl bg-white"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="text-white text-xs mt-3 opacity-80" onClick={(e) => e.stopPropagation()}>
                            <span>📄 {selectedSlip.name} • Full Resolution View</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PatientDashboard
