import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../assets/carePoint.png'
const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    // Check user session on route change or load
    useEffect(() => {
        const storedUser = localStorage.getItem('carepoint_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        } else {
            setUser(null)
        }
    }, [location])

    const handleLogout = () => {
        localStorage.removeItem('carepoint_user')
        setUser(null)
        setDropdownOpen(false)
        navigate('/')
    }

    const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Logo */}
               <Link to="/" className="flex items-center gap-2.5">
    <img 
        src={logoImg} 
        alt="CarePoint Logo" 
        className="w-10 h-10 rounded-full object-cover border border-teal-100 shadow-sm" 
    />
    <span className="text-xl font-extrabold text-[#0F172A]">
        Care<span className="text-[#0D9488]">Point</span>
    </span>
</Link>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <Link to="/" className="hover:text-[#0D9488] transition-colors">Home</Link>
                    <Link to="/about" className="hover:text-[#0D9488] transition-colors">About Us</Link>
                    <Link to="/contact" className="hover:text-[#0D9488] transition-colors">Contact Us</Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/book/general"
                        className="bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5"
                    >
                        🚨 EMERGENCY SOS
                    </Link>

                    {/* Conditional Auth Button / Avatar Dropdown */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full bg-[#0D9488] text-white font-bold flex items-center justify-center shadow-md hover:bg-[#0F766E] transition-all"
                            >
                                {firstLetter}
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50">
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="text-xs font-bold text-[#0F172A] truncate">{user.name}</p>
                                        <p className="text-[10px] text-slate-400 capitalize">Role: {user.role}</p>
                                    </div>
                                    <button
                                       onClick={() => {
    setDropdownOpen(false)
    if (user.role === 'doctor') {
        navigate('/doctor-dashboard')
    } else {
        navigate('/dashboard')
    }
}}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
                                    >
                                        📊 Dashboard ({user.role})
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-2 border-t border-slate-100"
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
                        >
                            Log In / Register
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar