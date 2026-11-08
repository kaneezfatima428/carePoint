/**
 * CarePoint Healthcare Platform - Dynamic Fee & Revenue Rules
 * Enforces affordable healthcare price caps, micro-commissions, and regulatory compliance.
 */

export const SERVICE_CATEGORIES = {
    general_physician: {
        id: 'general_physician',
        label: 'General Physician',
        minFee: 200,
        maxFee: 1000,
        hasExperienceRule: true,
        // Strict Rule: 0 years exp is locked at PKR 200. Fee scales linearly with experience up to PKR 1,000 max.
        // Assuming ~10 years to reach max PKR 1,000: (1000 - 200) / 10 = +PKR 80 per year.
        getBounds: (expYears = 0) => {
            const exp = Math.max(0, parseInt(expYears, 10) || 0)
            if (exp === 0) {
                return { min: 200, max: 200, locked: true, note: '0 years experience is strictly locked at PKR 200' }
            }
            const calculatedMax = Math.min(1000, 200 + exp * 80)
            return {
                min: 200,
                max: Math.round(calculatedMax),
                locked: false,
                note: `Allowed range: PKR 200 – PKR ${Math.round(calculatedMax)} for ${exp} yr(s) exp (Capped at PKR 1,000)`
            }
        }
    },
    home_doctor: {
        id: 'home_doctor',
        label: 'Home Doctor',
        minFee: 800,
        maxFee: 2000,
        getBounds: () => ({ min: 800, max: 2000, locked: false, note: 'Allowed range: PKR 800 – PKR 2,000' })
    },
    emergency_doctor: {
        id: 'emergency_doctor',
        label: 'Emergency Doctor',
        minFee: 1000,
        maxFee: 2500,
        getBounds: () => ({ min: 1000, max: 2500, locked: false, note: 'Allowed range: PKR 1,000 – PKR 2,500' })
    },
    general_physio: {
        id: 'general_physio',
        label: 'General Physiotherapist',
        minFee: 600,
        maxFee: 1500,
        getBounds: () => ({ min: 600, max: 1500, locked: false, note: 'Allowed range: PKR 600 – PKR 1,500' })
    },
    sports_physio: {
        id: 'sports_physio',
        label: 'Sports Physiotherapist',
        minFee: 1200,
        maxFee: 2500,
        getBounds: () => ({ min: 1200, max: 2500, locked: false, note: 'Allowed range: PKR 1,200 – PKR 2,500' })
    },
    routine_nurse: {
        id: 'routine_nurse',
        label: 'Routine Home Care Nurse',
        minFee: 500,
        maxFee: 1500,
        getBounds: () => ({ min: 500, max: 1500, locked: false, note: 'Allowed range: PKR 500 – PKR 1,500' })
    },
    emergency_nurse: {
        id: 'emergency_nurse',
        label: 'Emergency / ICU Nurse',
        minFee: 1000,
        maxFee: 2500,
        getBounds: () => ({ min: 1000, max: 2500, locked: false, note: 'Allowed range: PKR 1,000 – PKR 2,500' })
    },
    dietitian: {
        id: 'dietitian',
        label: 'Dietitian / Nutritionist',
        minFee: 400,
        maxFee: 1200,
        getBounds: () => ({ min: 400, max: 1200, locked: false, note: 'Allowed range: PKR 400 – PKR 1,200' })
    },
    ultrasound_specialist: {
        id: 'ultrasound_specialist',
        label: 'Ultrasound Diagnostic Specialist',
        minFee: 800,
        maxFee: 2000,
        getBounds: () => ({ min: 800, max: 2000, locked: false, note: 'Allowed range: PKR 800 – PKR 2,000' })
    },
    lab_technician: {
        id: 'lab_technician',
        label: 'Lab Technician (Home Sample Collection)',
        minFee: 150,
        maxFee: 500,
        getBounds: () => ({ min: 150, max: 500, locked: false, note: 'Allowed range: PKR 150 – PKR 500' })
    },
    pharmacy_delivery: {
        id: 'pharmacy_delivery',
        label: 'Online Pharmacy (Delivery Charge)',
        minFee: 50,
        maxFee: 200,
        getBounds: () => ({ min: 50, max: 200, locked: false, note: 'Allowed range: PKR 50 – PKR 200' })
    }
}

/**
 * Formats a Pakistani CNIC number into standard format: 12345-1234567-1
 */
export const formatCNIC = (value) => {
    if (!value) return ''
    const digits = value.replace(/\D/g, '').slice(0, 13)
    if (digits.length <= 5) return digits
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`
}

/**
 * Validates a Pakistani CNIC number format
 */
export const validateCNIC = (cnic) => {
    return /^\d{5}-\d{7}-\d{1}$/.test(cnic)
}

/**
 * Calculates transparent patient checkout fee breakdown:
 * Base Fee + Platform Micro-Commission (5-10%, default 7%) + Provincial Service Tax (e.g. 5% on commission)
 */
export const calculateFeeBreakdown = (baseFee, platformFeePercent = 7.0, taxPercent = 5.0) => {
    const fee = Math.max(0, Number(baseFee) || 0)
    const platformFee = Math.round((fee * platformFeePercent) / 100)
    const tax = Math.round((platformFee * taxPercent) / 100)
    const total = fee + platformFee + tax

    return {
        baseFee: fee,
        platformFeePercent,
        platformFee,
        taxPercent,
        tax,
        total
    }
}
