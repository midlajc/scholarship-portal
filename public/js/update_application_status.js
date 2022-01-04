let Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

let verifyApplication = () => {
    $.ajax({
        url: '/admin/verify-application',
        method: 'patch',
        data: {
            applicationNo: $('#applicationNo').val()
        },
        success: (res) => {
            $('#model').modal('hide')
            if (res.status) {
                Toast.fire({
                    icon: 'success',
                    title: 'Verified successfully'
                })
                document.getElementById($('#applicationNo').val()).classList.add("d-none");
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Error Occured,Please try again'
                })
                log(res.err)
            }
        }
    })
}