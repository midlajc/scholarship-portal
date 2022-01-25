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

let uploadEmails = async () => {
    let formData = new FormData();
    const { value: csv } = await Swal.fire({
        title: 'Select CSV',
        input: 'file',
        inputAttributes: {
            'accept': '.csv',
            'aria-label': 'Upload your csv file'
        }
    })

    if (csv) {
        formData.append("csv", csv);
        $.ajax({
            url: 'send-email/upload-email-csv',
            method: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: (res) => {
                if (res.status) {
                    $('#email').val(res.emails)
                } else {
                    Swal.fire('Error', res.message, 'error')
                }
            }
        })
    }
}

$('#form').submit((e) => {
    e.preventDefault();
    $('#submit').prop("disabled", true);
    $('#submit').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Sending...</span>")
    console.log("hello")
    $.ajax({
        url: 'send-email',
        method: 'post',
        data: $('#form').serialize(),
        success: (res) => {
            if (res.status) {
                Toast.fire({
                    icon: 'success',
                    title: 'Email has been Sended'
                })
                setTimeout(() => { location.reload() }, 2000)
            }
            else {
                Toast.fire({
                    icon: 'error',
                    title: 'Error Occured,Please try again'
                })
                $('#submit').prop("disabled", false);
                $('#submit').html("Send Email")
                console.log(res.err)
            }
        }
    })
})