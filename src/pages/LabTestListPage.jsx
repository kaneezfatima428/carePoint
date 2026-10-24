import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const availableTests = [
    { id: 'cbc', name: 'Complete Blood Count (CBC)', category: 'Blood Test', price: 850, fasting: 'Not Required', desc: 'Checks hemoglobin, white blood cells, and platelets.' },
    { id: 'sugar_f', name: 'Blood Sugar (Fasting)', category: 'Sugar Test', price: 400, fasting: '8-10 Hours Fasting', desc: 'Morning fasting glucose measurement.' },
    { id: 'sugar_r', name: 'Blood Sugar (Random)', category: 'Sugar Test', price: 350, fasting: 'Not Required', desc: 'Instant random blood glucose check.' },
    { id: 'hba1c', name: 'HbA1c (3-Month Sugar Average)', category: 'Sugar Test', price: 1200, fasting: 'Not Required', desc: 'Long-term diabetes control tracking.' },
    { id: 'lft', name: 'Liver Function Test (LFT)', category: 'Organ Test', price: 1600, fasting: 'Not Required', desc: 'Bilirubin, ALT, AST & liver enzyme levels.' },
    { id: 'kft', name: 'Kidney Function Test (KFT)', category: 'Organ Test', price: 1500, fasting: 'Not Required', desc: 'Creatinine, Urea & kidney health.' },
    { id: 'lipid', name: 'Lipid Profile (Cholesterol)', category: 'Organ Test', price: 1800, fasting: '10-12 Hours Fasting', desc: 'Cholesterol, HDL, LDL, & Triglycerides.' },
    { id: 'thyroid', name: 'Thyroid Profile (T3, T4, TSH)', category: 'Hormone Test', price: 2200, fasting: 'Not Required', desc: 'Complete thyroid hormone evaluation.' },
    { id: 'uric', name: 'Uric Acid Test', category: 'General Test', price: 600, fasting: 'Not Required', desc: 'Joint pain & gout screening.' },
]

const LabTestListPage = () => {
    const { gender } = useParams() // 'male' ya 'female'
    const navigate = useNavigate()
    const [selectedTestIds, setSelectedTestIds] = useState([])

    const toggleTest = (id) => {
        if (selectedTestIds.includes(id)) {
            setSelectedTestIds(selectedTestIds.filter(item => item !== id))
        } else {
            setSelectedTestIds([...selectedTestIds, id])
        }
    }

    const selectedTests = availableTests.filter(t => selectedTestIds.includes(t.id))
    const totalPrice = selectedTests.reduce((sum, t) => sum + t.price, 0)

    const handleProceed = () => {
        const user = localStorage.getItem('carepoint_user')
        if (!user) {
            navigate('/login')
        } else {
            navigate('/book/lab-test', { state: { selectedTests, totalPrice, gender } })
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full pb-32">
            <button
                onClick={() => navigate('/lab-tests')}
                className="text-slate-500 text-xs font-semibold hover:text-[#0D9488] mb-6 flex items-center gap-1 cursor-pointer"
            >
                ← Back to Technician Choice
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="bg-[#C8EADF] text-[#0D9488] font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                        Assigned: {gender === 'female' ? 'Female Technician 👩‍🔬' : 'Male Technician 👨‍🔬'}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                        Select Required Lab Tests
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Tick multiple tests to book them together in a single home visit[cite: 3]
                    </p>
                </div>
            </div>

            {/* Test Cards with Multi-select Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTests.map((test) => {
                    const isChecked = selectedTestIds.includes(test.id)
                    return (
                        <div
                            key={test.id}
                            onClick={() => toggleTest(test.id)}
                            className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex items-start gap-4 ${
                                isChecked
                                    ? 'border-[#0D9488] bg-teal-50/50 shadow-sm'
                                    : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                        >
                            {/* Checkbox */}
                            <div className="pt-1">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}} // handled by parent div onClick
                                    className="w-5 h-5 accent-[#0D9488] rounded cursor-pointer"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="font-bold text-[#0F172A] text-base">{test.name}</h3>
                                    <span className="text-[#0D9488] font-black text-sm shrink-0">PKR {test.price}</span>
                                </div>
                                <p className="text-slate-500 text-xs mb-2">{test.desc}</p>
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                    ⚠️ {test.fasting}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Sticky Bottom Bar when 1 or more tests are checked */}
            {selectedTestIds.length > 0 && (
                <div className="fixed bottom-6 left-4 right-4 max-w-2xl mx-auto bg-[#0F172A] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700 z-50">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">
                            {selectedTestIds.length} Test(s) Selected[cite: 3]
                        </p>
                        <p className="text-lg font-black text-[#14B8A6]">PKR {totalPrice}</p>
                    </div>
                    <button
                        onClick={handleProceed}
                        className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer transition-all"
                    >
                        Proceed to Booking →
                    </button>
                </div>
            )}
        </div>
    )
}

export default LabTestListPage