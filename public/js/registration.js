$("#form").submit((e) => {
    e.preventDefault()
    var response = grecaptcha.getResponse();
    if (response.length == 0) {
        swal.fire("Please Verify Captcha!", "", "info");
        evt.preventDefault();
        return false;
    } else {
        $('#submit').prop("disabled", true);
        $('#submit').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Loading...</span>")
        $.ajax({
            url: '/registration',
            method: 'post',
            data: $('#form').serialize(),
            success: (response) => {
                if (response.status) {
                    $('#submit').html("Submit")
                    grecaptcha.reset();
                    $('#submit').prop("disabled", false);
                    Swal.fire({
                        title: 'Registration Successful',
                        text: response.message,
                        icon: "success",
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        location.reload()
                    })
                } else {
                    console.log(response);
                    swal.fire({
                        title: 'Error',
                        text: response.errors,
                        icon: "error",
                        confirmButtonText: 'OK',
                    }).then(() => {
                        $('#submit').html("Submit")
                        grecaptcha.reset();
                        $('#submit').prop("disabled", false);
                    });
                }
            },
        })
    }
})

let getCourse = () => {
    let departmentId = $('#department').val()
    $.ajax({
        url: '/getcoursebydeptid/' + departmentId,
        method: 'get',
        success: (response) => {
            let html = `<option disabled="true" selected value="">Select Course</option>`
            for (x in response.courses) {
                html += '<option value=' + response.courses[x].ID + '>' + response.courses[x].COURSENAME + '</option>'
            }
            $('#course').html(html)
        }
    })
}

let getBatch = () => {
    let courseId = $('#course').val()
    $.ajax({
        url: '/getbatchbycourseid/' + courseId,
        method: 'get',
        success: (response) => {
            let html = `<option disabled="true" selected value="">Select Batch</option>`
            for (x in response.batches) {
                html += '<option value=' + response.batches[x].ID + '>' + response.batches[x].BATCHNAME + '</option>'
            }
            $('#batch').html(html)
        }
    })
}