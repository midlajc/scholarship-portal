let submitFrom = () => {
    if (document.getElementById('form').reportValidity()) {
        swal.fire({
            title: 'Are you sure?',
            text: "Do you want to save!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
            preConfirm: () => {
                $('#submit').prop("disabled", true);
                $('#submit').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Loading...</span>")
                $.ajax({
                    url: '/bank-details',
                    method: 'post',
                    data: $('#form').serialize(),
                    success: (response) => {
                        if (response.status) {
                            $('#submit').html("Submit")
                            $('#submit').prop("disabled", false);
                            Swal.fire({
                                title: 'Saved',
                                text: response.message,
                                icon: "success",
                                confirmButtonText: 'OK',
                            }).then((result) => {
                                location.reload()
                            })
                        } else {
                            $('#submit').html("Submit")
                            $('#submit').prop("disabled", false);
                            swal.fire("Error", response.message, "error");
                        }
                    }
                })
            }
        })
    }
}