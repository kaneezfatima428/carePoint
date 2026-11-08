import Swal from 'sweetalert2'

// Custom CarePoint Styled SweetAlert2 instance
export const CarePointSwal = Swal.mixin({
    confirmButtonColor: '#0D9488', // CarePoint Teal
    cancelButtonColor: '#94A3B8',  // Slate 400
    color: '#0F172A',              // Slate 900
    customClass: {
        popup: 'rounded-3xl shadow-2xl border border-slate-100 p-6',
        title: 'text-xl font-extrabold text-[#0F172A]',
        htmlContainer: 'text-sm text-slate-600 leading-relaxed',
        confirmButton: 'bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer',
        cancelButton: 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer'
    },
    buttonsStyling: true
})

export const showSuccessAlert = (title, text = '') => {
    return CarePointSwal.fire({
        icon: 'success',
        title,
        text,
        timer: 3500,
        showConfirmButton: true,
        confirmButtonText: 'Got it'
    })
}

export const showErrorAlert = (title, text = '') => {
    return CarePointSwal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: '#F43F5E',
        confirmButtonText: 'Try Again'
    })
}

export const showWarningAlert = (title, text = '') => {
    return CarePointSwal.fire({
        icon: 'warning',
        title,
        text,
        confirmButtonColor: '#0D9488',
        confirmButtonText: 'Understood'
    })
}

export const showInfoAlert = (title, text = '') => {
    return CarePointSwal.fire({
        icon: 'info',
        title,
        text,
        confirmButtonColor: '#0D9488',
        confirmButtonText: 'OK'
    })
}

export const showConfirmAlert = async (title, text = '', confirmButtonText = 'Yes, Confirm', cancelButtonText = 'Cancel') => {
    const result = await CarePointSwal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true
    })
    return result.isConfirmed
}

export default CarePointSwal
