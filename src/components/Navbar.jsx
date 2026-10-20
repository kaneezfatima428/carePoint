import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Check user session
    useEffect(() => {
        const storedUser = localStorage.getItem('carepoint_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        } else {
            setUser(null)
        }
        setMobileMenuOpen(false) // Close mobile menu on page change
    }, [location])

    const handleLogout = () => {
        localStorage.removeItem('carepoint_user')
        setUser(null)
        setDropdownOpen(false)
        setMobileMenuOpen(false)
        navigate('/')
    }

    const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2.5 shrink-0">
                    <img 
                        src="./public/carePoint.png" 
                        alt="CarePoint Logo" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'src/assets/carePoint.png' }}
                        className="w-10 h-10 rounded-full object-cover border border-teal-100 shadow-sm"
                    />
                    <span className="text-xl font-extrabold text-[#0F172A]">
                        Care<span className="text-[#0D9488]">Point</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <Link to="/" className="hover:text-[#0D9488] transition-colors">Home</Link>
                    <Link to="/about" className="hover:text-[#0D9488] transition-colors">About Us</Link>
                    <Link to="/contact" className="hover:text-[#0D9488] transition-colors">Contact Us</Link>
                </nav>

                {/* Right Actions & Auth */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        to="/book/general"
                        className="bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5"
                    >
                        🚨 EMERGENCY SOS
                    </Link>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full bg-[#0D9488] text-white font-bold flex items-center justify-center shadow-md hover:bg-[#0F766E] transition-all cursor-pointer"
                            >
                                {firstLetter}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50">
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
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                                    >
                                        📊 Dashboard
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-2 border-t border-slate-100 cursor-pointer"
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

                {/* Mobile Hamburger Button */}
                <div className="flex md:hidden items-center gap-2">
                    {user && (
                        <button
                            onClick={() => {
                                if (user.role === 'doctor') {
                                    navigate('/doctor-dashboard')
                                } else {
                                    navigate('/dashboard')
                                }
                            }}
                            className="w-9 h-9 rounded-full bg-[#0D9488] text-white font-bold flex items-center justify-center text-sm shadow-sm"
                        >
                            {firstLetter}
                        </button>
                    )}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-slate-600 hover:text-[#0D9488] focus:outline-none"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3 shadow-lg">
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#0D9488]"
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#0D9488]"
                    >
                        About Us
                    </Link>
                    <Link
                        to="/contact"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#0D9488]"
                    >
                        Contact Us
                    </Link>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                        <Link
                            to="/book/general"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                        >
                            🚨 EMERGENCY SOS
                        </Link>

                        {user ? (
                            <>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        if (user.role === 'doctor') {
                                            navigate('/doctor-dashboard')
                                        } else {
                                            navigate('/dashboard')
                                        }
                                    }}
                                    className="w-full text-left bg-teal-50 text-[#0D9488] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2"
                                >
                                    📊 Dashboard ({user.name})
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left bg-rose-50 text-rose-500 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2"
                                >
                                    🚪 Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all"
                            >
                                Log In / Register
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar