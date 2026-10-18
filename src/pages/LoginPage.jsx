import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const navigate = useNavigate()
    const [role, setRole] = useState('patient') // 'patient' or 'doctor'
    const [isLogin, setIsLogin] = useState(true)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        // Patient specific fields
        age: '',
        condition: '',
        location: '',
        // Doctor specific fields
        specialty: '',
        gender: 'male',
        experience: '',
        fee: '',
        phone: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Save user session in localStorage (Mock authentication)
        localStorage.setItem('carepoint_user', JSON.stringify({ role, ...formData }))
        
        // Redirect based on role
        if (role === 'patient') {
            navigate('/dashboard')
        } else {
            navigate('/doctor-dashboard')
        }
    }

    return (
        <div className="max-w-md mx-auto px-4 py-12 w-full">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-[#0F172A] mb-2">
                        {isLogin ? 'Welcome Back to CarePoint' : 'Join CarePoint'}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {isLogin ? 'Login to access bookings and services' : 'Register your account below'}
                    </p>
                </div>

                {/* Role Toggle Button (Patient / Doctor) */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            role === 'patient' 
                                ? 'bg-white text-[#0D9488] shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        👤 Patient
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            role === 'doctor' 
                                ? 'bg-white text-[#0D9488] shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        👨‍⚕️ Doctor / Provider
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder={role === 'patient' ? 'e.g. Ali Ahmed' : 'e.g. Dr. Sarah Khan'}
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488] transition-all"
                        />
                    </div>

                    {/* DYNAMIC FIELDS FOR PATIENT */}
                    {role === 'patient' && !isLogin && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="e.g. 25"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488]"
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
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Health Issue / Condition</label>
                                <input
                                    type="text"
                                    name="condition"
                                    placeholder="e.g. Fever, Checkup, Joint pain"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488]"
                                />
                            </div>
                        </>
                    )}

                    {/* DYNAMIC FIELDS FOR DOCTOR */}
                    {role === 'doctor' && !isLogin && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Specialty</label>
                                    <input
                                        type="text"
                                        name="specialty"
                                        placeholder="e.g. Cardiologist"
                                        value={formData.specialty}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488]"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Experience</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        placeholder="e.g. 5 Years"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Fee (PKR)</label>
                                    <input
                                        type="number"
                                        name="fee"
                                        placeholder="e.g. 1000"
                                        value={formData.fee}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488]"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md mt-4"
                    >
                        {isLogin ? 'Login to CarePoint' : `Register as ${role === 'patient' ? 'Patient' : 'Doctor'}`}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs font-semibold text-slate-500 hover:text-[#0D9488] transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage