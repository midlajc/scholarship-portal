// let Toast = Swal.mixin({
//     toast: true,
//     position: 'top-end',
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//         toast.addEventListener('mouseenter', Swal.stopTimer)
//         toast.addEventListener('mouseleave', Swal.resumeTimer)
//     }
// })

let verifyApplication = () => {
    $.ajax({
        url: '/admin/scholarship/verify-application',
        method: 'patch',
        data: {
            applicationNo: $('#applicationNo').val(),
            email: $('#email').val(),
            scholarshipName: $('#scholarshipName').val()
        },
        success: (res) => {
            $('#model').modal('hide')
            if (res.status) {
                Toast.fire({
                    icon: 'success',
                    title: 'Application Verified'
                })
                $("#" + $('#applicationNo').val()).addClass("d-none");
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Error Occured,Please try again'
                })
                console.log(res.err)
            }
        }
    })
}


let rejectApplication = async () => {
    $('#model').modal('hide')
    const { value: reason } = await Swal.fire({
        title: 'Enter reason of Rejection',
        input: 'text',
        inputLabel: 'Enter reason',
        inputValue: '',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    })

    if (reason) {
        $.ajax({
            url: '/admin/scholarship/reject-application',
            method: 'patch',
            data: {
                applicationNo: $('#applicationNo').val(),
                email: $('#email').val(),
                scholarshipName: $('#scholarshipName').val(),
                reason: reason
            },
            success: (res) => {
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
                    console.log(res.err)
                }
            }
        })
    }
}

let approveApplication = () => {
    $.ajax({
        url: '/admin/scholarship/approve-application',
        method: 'patch',
        data: {
            applicationNo: $('#applicationNo').val(),
            email: $('#email').val(),
            scholarshipName: $('#scholarshipName').val()
        },
        success: (res) => {
            $('#model').modal('hide')
            if (res.status) {
                Toast.fire({
                    icon: 'success',
                    title: 'Application Approved'
                })
                $("#" + $('#applicationNo').val()).addClass("d-none");
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Error Occured,Please try again'
                })
                console.log(res.err)
            }
        }
    })
}