import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-md mx-auto px-4 py-24 text-center w-full">
            <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-10">
                <div className="text-6xl mb-4">🔍</div>
                <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">404 Not Found</h1>
                <p className="text-slate-500 text-sm mb-6">
                    Aapki search ke mutabiq koi doctor ya service nahi mili. Barah-e-karam "Doctor" ya "Dr" search karein.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-8 py-3 rounded-xl transition-all w-full shadow-md text-sm"
                >
                    Back to Home
                </button>
            </div>
        </div>
    )
}

export default NotFoundPage