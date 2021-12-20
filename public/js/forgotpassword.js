$("#form").submit((e) => {
    e.preventDefault()
    $('#submit').prop("disabled", true);
    $('#submit').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Submiting...</span>")
    $.ajax({
        url: '/forgotpassword',
        method: 'post',
        data: $('#form').serialize(),
        success: (response) => {
            if (response.status) {
                Swal.fire({
                    title: "Success",
                    text: response.message,
                    icon: "success",
                    confirmButtonText: 'OK',
                }).then(() => {
                    location.reload()
                })
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.message,
                    icon: "error",
                    confirmButtonText: 'OK',
                }).then(() => {
                    $('#submit').prop("disabled", false);
                    $('#submit').html("Submit")
                })
            }
        },
    })
})

addEventListener('change', () => {
    document.getElementById('alert').innerHTML = null
    document.getElementById('alert').className = ""
})