import { useNavigate } from 'react-router-dom'

const AboutPage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            {/* Hero */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-sm">
                    🏥 About CarePoint
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] mb-4 leading-tight">
                    Redefining Healthcare<br /><span className="text-[#0D9488]">in Pakistan</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                    CarePoint connects patients across Pakistan with verified, compassionate doctors — right at their doorstep or in a clinic near them.
                </p>
            </div>

            {/* Mission Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                    { icon: '🎯', title: 'Our Mission', desc: 'To make quality healthcare accessible to every Pakistani, regardless of location or circumstance.' },
                    { icon: '👁️', title: 'Our Vision', desc: 'A Pakistan where every citizen gets the medical attention they need, when they need it.' },
                    { icon: '❤️', title: 'Our Values', desc: 'Compassion, trust, and transparency in every healthcare interaction we facilitate.' },
                ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center">
                        <div className="text-5xl mb-4 bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner">{item.icon}</div>
                        <h3 className="text-xl font-bold text-[#0F172A] mb-3">{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-10 sm:p-12 text-center text-white mb-16 shadow-xl">
                <h2 className="text-3xl font-bold mb-8">CarePoint by the Numbers</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { num: '500+', label: 'Verified Doctors' },
                        { num: '50,000+', label: 'Patients Served' },
                        { num: '15+', label: 'Cities Active' },
                        { num: '4.8★', label: 'Average Rating' },
                    ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0D9488] break-words">
                                {stat.num}
                            </p>
                            <p className="text-slate-300 text-sm mt-2 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={() => navigate('/doctor')}
                    className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-lg hover:shadow-[0_10px_20px_rgba(13,148,136,0.3)] transition-all"
                >
                    Find a Doctor Now →
                </button>
            </div>
        </div>
    )
}

export default AboutPage