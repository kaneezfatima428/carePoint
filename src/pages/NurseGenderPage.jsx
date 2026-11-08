import { useNavigate, useParams } from 'react-router-dom'

const NurseGenderPage = () => {
    const { category } = useParams() // 'home' or 'emergency'
    const navigate = useNavigate()

    const isEmergency = category === 'emergency'
    const categoryTitle = isEmergency ? 'Emergency Nurses' : 'Home Nurses'
    const categoryBadge = isEmergency ? '🚨 Emergency Response' : '🏠 At-Home Care'

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span>›</span>
                <span className="hover:text-[#0D9488] cursor-pointer" onClick={() => navigate('/nurse')}>Nurse Care</span>
                <span>›</span>
                <span className="text-[#0D9488] font-medium">{categoryTitle}</span>
            </nav>

            {/* Back Button */}
            <button
                onClick={() => navigate('/nurse')}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer transition-colors"
            >
                ← Back to Nursing Categories
            </button>

            {/* Header */}
            <div className="text-center mb-12">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 shadow-sm border ${
                    isEmergency 
                        ? 'bg-[#F43F5E]/10 border-[#F43F5E]/30 text-[#F43F5E]' 
                        : 'bg-[#0D9488]/10 border-[#0D9488]/30 text-[#0D9488]'
                }`}>
                    {categoryBadge}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-3">
                    Choose Nurse by Gender
                </h1>
                <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                    We understand personal comfort and family preferences. Select whether you prefer a male or female nurse for your {isEmergency ? 'emergency bedside care' : 'home visit'}.
                </p>
            </div>

            {/* 2 Gender Cards: Male & Female */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-14">
                {/* 1. Male Nurse Card */}
                <div
                    onClick={() => navigate(`/nurse/${category}/male`)}
                    className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/30 rounded-3xl p-8 sm:p-10 flex flex-col justify-between items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group bg-white shadow-sm"
                >
                    <div className="flex flex-col items-center">
                        <div className="text-6xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform">
                            👨‍⚕️
                        </div>
                        <span className="text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-400/20 px-3.5 py-1 rounded-full mb-4">
                            Male Nurse
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                            Male Nurse
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
                            Experienced and PNC registered male nurses specializing in catheter care, patient mobility, wound dressing, post-op care, and bedside support.
                        </p>
                    </div>

                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-3.5 rounded-xl transition-all shadow-md text-xs sm:text-sm mt-auto cursor-pointer">
                        View Male Nurses →
                    </button>
                </div>

                {/* 2. Female Nurse Card */}
                <div
                    onClick={() => navigate(`/nurse/${category}/female`)}
                    className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-400/30 rounded-3xl p-8 sm:p-10 flex flex-col justify-between items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group bg-white shadow-sm"
                >
                    <div className="flex flex-col items-center">
                        <div className="text-6xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform">
                            👩‍⚕️
                        </div>
                        <span className="text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-400/20 px-3.5 py-1 rounded-full mb-4">
                            Female Nurse
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                            Female Nurse
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
                            Gentle, compassionate, and PNC certified female nurses specializing in maternal recovery, elderly female care, IV cannula, injections, and bedside nursing.
                        </p>
                    </div>

                    <button className="bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold w-full py-3.5 rounded-xl transition-all shadow-md text-xs sm:text-sm mt-auto cursor-pointer">
                        View Female Nurses →
                    </button>
                </div>
            </div>

            {/* Trust Footer Note */}
            <div className="bg-[#0D9488]/5 border border-[#0D9488]/20 rounded-2xl p-6 max-w-4xl mx-auto text-center shadow-sm">
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-[#0D9488]">✅ CarePoint Guarantee:</span> All male &amp; female nurses undergo strict clinical verification, background screening, and carry sterile clinical kits for maximum safety.
                </p>
            </div>
        </div>
    )
}

export default NurseGenderPage
