const NURSE_CATEGORIES = new Set(['routine_nurse', 'emergency_nurse'])
const PHYSIOTHERAPIST_CATEGORIES = new Set(['general_physio', 'sports_physio'])
const DIETITIAN_CATEGORIES = new Set(['dietitian'])
const ULTRASOUND_CATEGORIES = new Set(['ultrasound_specialist'])
const LAB_TECHNICIAN_CATEGORIES = new Set(['lab_technician'])
const PHARMACY_MANAGER_CATEGORIES = new Set(['pharmacy_delivery'])

export const isNurseCategory = (category) => NURSE_CATEGORIES.has(category)
export const isPhysiotherapistCategory = (category) => PHYSIOTHERAPIST_CATEGORIES.has(category)
export const isDietitianCategory = (category) => DIETITIAN_CATEGORIES.has(category)
export const isUltrasoundCategory = (category) => ULTRASOUND_CATEGORIES.has(category)
export const isLabTechnicianCategory = (category) => LAB_TECHNICIAN_CATEGORIES.has(category)
export const isPharmacyManagerCategory = (category) => PHARMACY_MANAGER_CATEGORIES.has(category)

export const isNurseAccount = (user) => (
    user?.role === 'nurse' || isNurseCategory(user?.category)
)

export const isPhysiotherapistAccount = (user) => (
    user?.role === 'physiotherapist' || isPhysiotherapistCategory(user?.category)
)

export const isDietitianAccount = (user) => (
    user?.role === 'dietitian' || isDietitianCategory(user?.category)
)

export const isUltrasoundAccount = (user) => (
    user?.role === 'ultrasound_specialist' || isUltrasoundCategory(user?.category)
)

export const isLabTechnicianAccount = (user) => (
    user?.role === 'lab_technician' || isLabTechnicianCategory(user?.category)
)

export const isPharmacyManagerAccount = (user) => (
    user?.role === 'pharmacy_manager' || isPharmacyManagerCategory(user?.category)
)

export const getDashboardPath = (user) => {
    if (isNurseAccount(user)) return '/nurse-dashboard'
    if (isPhysiotherapistAccount(user)) return '/physiotherapist-dashboard'
    if (isDietitianAccount(user)) return '/dietitian-dashboard'
    if (isUltrasoundAccount(user)) return '/ultrasound-dashboard'
    if (isLabTechnicianAccount(user)) return '/lab-technician-dashboard'
    if (isPharmacyManagerAccount(user)) return '/pharmacy-manager-dashboard'
    return user?.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'
}
