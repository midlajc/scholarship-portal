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
let deleteUser = (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'delete-registration',
                method: 'patch',
                data: {
                    id
                },
                success: (response) => {
                    if (response.status) {
                        Toast.fire({
                            icon: 'warning',
                            title: 'Entry Deleted'
                        })
                        $("#" + id).addClass("d-none");
                    } else {
                        Toast.fire({
                            icon: 'error',
                            title: 'Error Occured Try Again'
                        })
                    }
                }
            })
        }
    })
}

let resendVerificationEmail = (id) => {
    $('#resendEmail_' + id).prop("disabled", true);
    $('#resendEmail_' + id).html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Sending...</span>")
    $.ajax({
        url: 'resend-verification-email',
        method: 'patch',
        data: {
            id
        },
        success: (response) => {
            $('#resendEmail_' + id).prop("disabled", false);
            $('#resendEmail_' + id).html(`Resend <i class="fas fa-envelope-open-text"></i>`)
            if (response.status) {
                Toast.fire({
                    icon: 'success',
                    title: 'Verification Email has been Sended'
                })
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Error Occured Try Again'
                })

            }
        }
    })
}
$(document).ready(function () {
    $('#table').DataTable({
        "columns": [
            null,
            null,
            null,
            null,
            null,
            { "width": "130px" },
        ],
    });
});
