import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    SERVICE_CATEGORIES,
    formatCNIC,
    validateCNIC,
    calculateFeeBreakdown
} from '../utils/feeRules'
import { showSuccessAlert, showErrorAlert } from '../utils/alert'

const LoginPage = () => {
    const navigate = useNavigate()
    const [role, setRole] = useState('patient') // 'patient' or 'doctor'
    const [isLogin, setIsLogin] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        // Patient specific fields
        age: '',
        condition: '',
        location: '',
        // Doctor / Provider specific fields
        cnic: '',
        category: 'general_physician',
        specialty: 'General Medicine',
        gender: 'male',
        experience: 0,
        fee: 200,
        phone: ''
    })

    // Compute dynamic bounds for currently selected category and experience
    const bounds = useMemo(() => {
        const catConfig = SERVICE_CATEGORIES[formData.category] || SERVICE_CATEGORIES.general_physician
        return catConfig.getBounds(formData.experience)
    }, [formData.category, formData.experience])

    // Compute transparent fee breakdown
    const breakdown = useMemo(() => {
        return calculateFeeBreakdown(formData.fee, 7.0, 5.0)
    }, [formData.fee])

    const handleChange = (e) => {
        const { name, value } = e.target
        setErrorMsg('')

        if (name === 'cnic') {
            setFormData(prev => ({ ...prev, cnic: formatCNIC(value) }))
            return
        }

        if (name === 'category') {
            const nextCat = SERVICE_CATEGORIES[value] || SERVICE_CATEGORIES.general_physician
            const nextBounds = nextCat.getBounds(formData.experience)
            setFormData(prev => ({
                ...prev,
                category: value,
                fee: nextBounds.locked ? nextBounds.min : Math.max(nextBounds.min, Math.min(prev.fee, nextBounds.max))
            }))
            return
        }

        if (name === 'experience') {
            const expYears = Math.max(0, parseInt(value, 10) || 0)
            const catConfig = SERVICE_CATEGORIES[formData.category] || SERVICE_CATEGORIES.general_physician
            const nextBounds = catConfig.getBounds(expYears)
            setFormData(prev => ({
                ...prev,
                experience: expYears,
                fee: nextBounds.locked ? nextBounds.min : Math.max(nextBounds.min, Math.min(prev.fee, nextBounds.max))
            }))
            return
        }

        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrorMsg('')

        // Patient signup validation
        if (role === 'patient' && !isLogin) {
            if (!validateCNIC(formData.cnic)) {
                const msg = 'Invalid CNIC format. Please enter a valid 13-digit Pakistani CNIC or B-Form number (e.g. 35201-1234567-1).'
                setErrorMsg(msg)
                showErrorAlert('CNIC Validation Error', msg)
                return
            }
        }

        // Doctor signup validation
        if (role === 'doctor' && !isLogin) {
            // 1. CNIC Validation
            if (!validateCNIC(formData.cnic)) {
                const msg = 'Invalid CNIC format. Please enter a valid 13-digit Pakistani CNIC (e.g. 35201-1234567-1).'
                setErrorMsg(msg)
                showErrorAlert('CNIC Validation Error', msg)
                return
            }

            // 2. Fee Range & Experience Validation
            const numFee = Number(formData.fee)
            if (numFee < bounds.min || numFee > bounds.max) {
                const msg = `Fee out of allowed range! For ${SERVICE_CATEGORIES[formData.category].label} with ${formData.experience} years experience, fee must be between PKR ${bounds.min} and PKR ${bounds.max}.`
                setErrorMsg(msg)
                showErrorAlert('Fee Range Exceeded', msg)
                return
            }
        }

        // Save user session in localStorage (Mock authentication)
        localStorage.setItem(
            'carepoint_user',
            JSON.stringify({
                role,
                ...formData,
                feeBreakdown: role === 'doctor' ? breakdown : null
            })
        )

        showSuccessAlert(
            isLogin ? 'Welcome Back!' : 'Account Created!',
            `Successfully signed in as ${role === 'patient' ? 'Patient' : 'Doctor/Provider'}.`
        )

        // Redirect based on role
        if (role === 'patient') {
            navigate('/dashboard')
        } else {
            navigate('/doctor-dashboard')
        }
    }

    return (
        <div className="max-w-lg mx-auto px-4 py-12 w-full">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-[#0F172A] mb-2">
                        {isLogin ? 'Welcome Back to CarePoint' : 'Join CarePoint'}
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm">
                        {isLogin ? 'Login to access bookings and services' : 'Register your account below'}
                    </p>
                </div>

                {/* Role Toggle Button (Patient / Doctor) */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
                    <button
                        type="button"
                        onClick={() => { setRole('patient'); setErrorMsg('') }}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                            role === 'patient' 
                                ? 'bg-white text-[#0D9488] shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        👤 Patient
                    </button>
                    <button
                        type="button"
                        onClick={() => { setRole('doctor'); setErrorMsg('') }}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                            role === 'doctor' 
                                ? 'bg-white text-[#0D9488] shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        👨‍⚕️ Doctor / Provider
                    </button>
                </div>

                {errorMsg && (
                    <div className="bg-rose-50 border border-rose-200 text-[#F43F5E] px-4 py-2.5 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder={role === 'patient' ? 'e.g. Ali Ahmed' : 'e.g. Dr. Sarah Khan'}
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D9488] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D9488] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Password *</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D9488] transition-all"
                        />
                    </div>

                    {/* DYNAMIC FIELDS FOR PATIENT */}
                    {role === 'patient' && !isLogin && (
                        <>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Patient CNIC / B-Form Number *
                                    </label>
                                    <span className="text-[10px] text-slate-400">NADRA standard (13 digits)</span>
                                </div>
                                <input
                                    type="text"
                                    name="cnic"
                                    required
                                    maxLength={15}
                                    placeholder="35201-1234567-1"
                                    value={formData.cnic}
                                    onChange={handleChange}
                                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider outline-none transition-all ${
                                        formData.cnic && !validateCNIC(formData.cnic)
                                            ? 'border-amber-400 focus:border-amber-500'
                                            : 'border-slate-200 focus:border-[#0D9488]'
                                    }`}
                                />
                                {formData.cnic && !validateCNIC(formData.cnic) && (
                                    <p className="text-[11px] text-amber-600 mt-1 font-medium">
                                        Format must be 5 digits - 7 digits - 1 digit (e.g. 35201-1234567-1)
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="e.g. 25"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D9488]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">City / Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Lahore"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D9488]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Health Issue / Condition</label>
                                <input
                                    type="text"
                                    name="condition"
                                    placeholder="e.g. Fever, Routine Checkup, Joint pain"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D9488]"
                                />
                            </div>
                        </>
                    )}

                    {/* DYNAMIC FIELDS FOR DOCTOR / HEALTHCARE PROVIDER */}
                    {role === 'doctor' && !isLogin && (
                        <div className="space-y-4 pt-2 border-t border-slate-100">
                            {/* CNIC Number Field with Real-time Formatting */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Doctor CNIC Number *
                                    </label>
                                    <span className="text-[10px] text-slate-400">NADRA standard (13 digits)</span>
                                </div>
                                <input
                                    type="text"
                                    name="cnic"
                                    required
                                    maxLength={15}
                                    placeholder="35201-1234567-1"
                                    value={formData.cnic}
                                    onChange={handleChange}
                                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider outline-none transition-all ${
                                        formData.cnic && !validateCNIC(formData.cnic)
                                            ? 'border-amber-400 focus:border-amber-500'
                                            : 'border-slate-200 focus:border-[#0D9488]'
                                    }`}
                                />
                                {formData.cnic && !validateCNIC(formData.cnic) && (
                                    <p className="text-[11px] text-amber-600 mt-1 font-medium">
                                        Format must be 5 digits - 7 digits - 1 digit (e.g. 35201-1234567-1)
                                    </p>
                                )}
                            </div>

                            {/* Service Category & Experience */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Provider Service Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#0D9488]"
                                    >
                                        {Object.values(SERVICE_CATEGORIES).map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Experience (Years) *</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        min="0"
                                        max="50"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D9488]"
                                    />
                                </div>
                            </div>

                            {/* Specialty & Gender */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Specialty / Title</label>
                                    <input
                                        type="text"
                                        name="specialty"
                                        placeholder="e.g. MBBS, FCPS / GP"
                                        value={formData.specialty}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D9488]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0D9488]"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            {/* Affordable Dynamic Fee Selection Card */}
                            <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700">
                                        Base Consultation Fee (PKR) *
                                    </label>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100/70 text-[#0D9488]">
                                        Platform Regulated Cap
                                    </span>
                                </div>

                                <div className="relative">
                                    <input
                                        type="number"
                                        name="fee"
                                        required
                                        disabled={bounds.locked}
                                        min={bounds.min}
                                        max={bounds.max}
                                        value={formData.fee}
                                        onChange={handleChange}
                                        className={`w-full bg-white border rounded-xl px-4 py-2.5 text-base font-bold text-[#0D9488] outline-none ${
                                            bounds.locked ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : 'border-teal-200 focus:border-[#0D9488]'
                                        }`}
                                    />
                                    {bounds.locked && (
                                        <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                                            🔒 Locked
                                        </span>
                                    )}
                                </div>

                                <p className="text-[11px] text-slate-500 leading-tight">
                                    ℹ️ <strong>Rule:</strong> {bounds.note}
                                </p>

                                {/* Transparent Patient Checkout Breakdown Preview */}
                                <div className="border-t border-teal-100/60 pt-3 space-y-1.5 text-xs">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                        Patient Checkout Breakdown (Micro-Commission Model)
                                    </p>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Provider Base Fee:</span>
                                        <span className="font-semibold">PKR {breakdown.baseFee}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>CarePoint Platform Fee ({breakdown.platformFeePercent}%):</span>
                                        <span className="font-semibold">+ PKR {breakdown.platformFee}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Local Tax ({breakdown.taxPercent}% PST):</span>
                                        <span className="font-semibold">+ PKR {breakdown.tax}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-[#0D9488] border-t border-teal-100/60 pt-1.5 text-sm">
                                        <span>Total Patient Payable:</span>
                                        <span>PKR {breakdown.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md mt-4 cursor-pointer"
                    >
                        {isLogin ? 'Login to CarePoint' : `Register as ${role === 'patient' ? 'Patient' : 'Doctor / Provider'}`}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setErrorMsg('') }}
                        className="text-xs font-semibold text-slate-500 hover:text-[#0D9488] transition-colors cursor-pointer"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
