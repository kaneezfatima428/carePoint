import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-[#0F172A] text-white mt-16 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full  flex items-center justify-center shadow-md">
                                <img src="/carePoint.png" alt="" />
                            </div>
                            <span className="text-white font-bold text-xl tracking-tight">
                                Care<span className="text-[#0D9488]">Point</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Your trusted healthcare companion — connecting you with the best doctors, labs, and specialists across Pakistan.
                        </p>
                        <div className="flex gap-3 mt-5">
                            <div className="bg-[#0D9488]/20 border border-[#0D9488]/40 text-[#14B8A6] px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center">
                                📞 Helpline: 051-111-222
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-base">Services</h3>
                        <ul className="space-y-2.5 text-slate-400 text-sm">
                            <li><Link to="/doctor" className="hover:text-[#0D9488] transition-colors">Doctors</Link></li>
                            <li><Link to="/" className="hover:text-[#0D9488] transition-colors">Lab Tests</Link></li>
                            <li><Link to="/" className="hover:text-[#0D9488] transition-colors">Ultrasound</Link></li>
                            <li><Link to="/" className="hover:text-[#0D9488] transition-colors">Online Pharmacy</Link></li>
                            <li><Link to="/" className="hover:text-[#0D9488] transition-colors">Hospital Appointments</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-base">Company</h3>
                        <ul className="space-y-2.5 text-slate-400 text-sm">
                            <li><Link to="/about" className="hover:text-[#0D9488] transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-[#0D9488] transition-colors">Contact Us</Link></li>
                            <li><a href="#" className="hover:text-[#0D9488] transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[#0D9488] transition-colors">Partners</a></li>
                            <li><a href="#" className="hover:text-[#0D9488] transition-colors">Helpline</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">© 2026 CarePoint. All rights reserved.</p>
                    <div className="flex gap-6 text-slate-500 text-sm">
                        <a href="#" className="hover:text-[#0D9488] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#0D9488] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#0D9488] transition-colors">Partners</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer