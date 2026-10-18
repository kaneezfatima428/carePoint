import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorDashboard = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState('profile')

    useEffect(() => {
        const storedUser = localStorage.getItem('carepoint_user')
        if (storedUser) {
            const parsed = JSON.parse(storedUser)
            if (parsed.role !== 'doctor') {
                navigate('/dashboard') // Agar patient hai toh patient dashboard par bhej do
            }
            setUser(parsed)
        } else {
            navigate('/login')
        }
    }, [navigate])

    if (!user) return null

    const handleLogout = () => {
        localStorage.removeItem('carepoint_user')
        navigate('/login')
    }

    const sidebarItems = [
        { id: 'profile', label: 'Doctor Profile', icon: '👨‍⚕️' },
        { id: 'patients', label: 'Patient Appointments', icon: '📅' },
        { id: 'services', label: 'My Clinic / Services', icon: '🏥' },
        { id: 'earnings', label: 'Earnings & Fee', icon: '💰' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white mb-6 shadow-md">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 rounded-full bg-[#0D9488] flex items-center justify-center text-xl font-bold border-2 border-[#0D9488]/40 shrink-0">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'D'}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-lg truncate">{user.name}</h3>
                                <p className="text-slate-400 text-xs">Reg: CP-DOC-101</p>
                                <span className="text-teal-300 text-xs font-medium">Doctor Portal</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all text-left border-b border-slate-50 last:border-b-0 ${
                                    activeTab === item.id
                                        ? 'bg-[#0D9488]/10 text-[#0D9488] border-l-4 border-l-[#0D9488]'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-[#F43F5E] hover:bg-rose-50 transition-all text-left border-t border-slate-100"
                        >
                            <span>🚪</span> Logout
                        </button>
                    </div>
                </aside>

                {/* Dynamic Content based on Sidebar Tab */}
                <main className="flex-1 min-w-0 w-full">
                    {activeTab === 'profile' && (
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Doctor Professional Profile</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-400">Specialty</p>
                                    <p className="font-bold text-[#0F172A]">{user.specialty || 'General Practitioner'}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-400">Experience</p>
                                    <p className="font-bold text-[#0F172A]">{user.experience || '3 Years'}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-400">Consultation Fee</p>
                                    <p className="font-bold text-[#0D9488]">PKR {user.fee || '1000'}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-400">Gender</p>
                                    <p className="font-bold text-[#0F172A] capitalize">{user.gender || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'patients' && (
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 text-center py-12">
                            <div className="text-4xl mb-2">📅</div>
                            <h3 className="font-bold text-lg text-[#0F172A]">Patient Appointments</h3>
                            <p className="text-slate-400 text-sm mt-1">No patient bookings received yet.</p>
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-[#0F172A] mb-4">My Clinic / Services</h2>
                            <p className="text-sm text-slate-600 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                                Your service is active and listed under CarePoint general practitioner network.
                            </p>
                        </div>
                    )}

                    {activeTab === 'earnings' && (
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Earnings &amp; Fee Structure</h2>
                            <p className="text-2xl font-extrabold text-[#0D9488]">PKR 0.00</p>
                            <p className="text-xs text-slate-400 mt-1">Total revenue generated from online and home visits.</p>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Doctor Settings</h2>
                            <p className="text-sm text-slate-500">Update availability hours and consultation timings.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default DoctorDashboard