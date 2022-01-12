let getPanchayathTaluk = () => {
    let districtId = $('#district').val()
    $.get('/getVillageMunicipality/' + districtId, (data, status, jqXHR) => {
        let html = `<option disabled="'true'" selected="" value="">Select Any Option</option>`
        for (x in data) {
            html += "<option>" + data[x].name + "</option>"
        }
        $('#panchayath').html(html)
    })
    $.get('/getTaluk/' + districtId, (data, status, jqXHR) => {
        let html = `<option disabled="'true'" selected="" value="">Select Any Option</option>`
        for (x in data) {
            html += "<option>" + data[x].name + "</option>"
        }
        $('#taluk').html(html)
    })
}

let submitData = (submitStatus) => {
    if (document.getElementById('form').reportValidity()) {
        let data = $('#form').serialize()
        data += '&applicationStatus=' + submitStatus
        if (submitStatus == 1) {
            $('#save').prop("disabled", true);
            $('#submit').prop("disabled", true);
            $('#save').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Saving...</span>")
        } else {
            $('#save').prop("disabled", true);
            $('#submit').prop("disabled", true);
            $('#submit').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Submitting...</span>")
        }
        $.ajax({
            url: '/scholarship-form',
            method: 'post',
            data: data,
            success: (response) => {
                $('#save').prop("disabled", false);
                $('#submit').prop("disabled", false);
                $('#save').html("Save")
                $('#submit').html("Submit")
                if (response.status) {
                    if (submitStatus == 1) {
                        Swal.fire({
                            title: "Application Saved",
                            text: '',
                            icon: "success",
                            confirmButtonText: 'OK',
                        }).then((result) => {
                            $('#save').prop("disabled", false);
                            $('#submit').prop("disabled", false);
                            $('#save').html("Save")
                        })
                    } else {
                        Swal.fire({
                            title: response.message,
                            text: '',
                            icon: "success",
                            confirmButtonText: 'OK',
                        }).then((result) => {
                            location.reload()
                        })
                    }
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.errors,
                        icon: "error",
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        $('#save').prop("disabled", false);
                        $('#submit').prop("disabled", false);
                        $('#save').html("Save")
                        $('#submit').html("Submit")
                    })
                }
            },
        })
    }
}