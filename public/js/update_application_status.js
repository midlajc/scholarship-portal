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
                $("#" + $('#applicationNo').val()).addClass("d-none");
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


let rejectApplication = () => {
    $.ajax({
        url: '/admin/reject-application',
        method: 'patch',
        data: {
            applicationNo: $('#applicationNo').val()
        },
        success: (res) => {
            $('#model').modal('hide')
            if (res.status) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Application Rejected'
                })
                $("#" + $('#applicationNo').val()).addClass("d-none");
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

let approveApplication = () => {
    $.ajax({
        url: '/admin/approve-application',
        method: 'patch',
        data: {
            applicationNo: $('#applicationNo').val()
        },
        success: (res) => {
            $('#model').modal('hide')
            if (res.status) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Application Rejected'
                })
                $("#" + $('#applicationNo').val()).addClass("d-none");
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