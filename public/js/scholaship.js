let applyForScholarship = (id) => {
    $('#apply').prop("disabled", true);
    $('#apply').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Apply for Scholarship</span>")
    $.ajax({
        url: '/application-status/' + id,
        method: 'get',
        success: (applicationStatus) => {
            let isSubmitted = applicationStatus.statusId == 2 || applicationStatus.statusId == 3 || applicationStatus.statusId == 4;
            if (isSubmitted) {
                $('#apply').prop("disabled", false);
                $('#apply').html("Apply for Scholarship")
                swal.fire("Application Already Submitted", "", "success");
            } else if (applicationStatus.statusId == -3 || applicationStatus.statusId == -2) {
                $('#apply').prop("disabled", false);
                $('#apply').html("Apply for Scholarship")
                swal.fire(applicationStatus.message, "", "info");
            }
            else {
                $.ajax({
                    url: '/scholarship-status/' + applicationStatus.scholarshipListId,
                    method: 'get',
                    success: (scholarshipStatus) => {
                        if (applicationStatus.statusId == -1) {
                            window.location.replace('/scholarship-form/' + applicationStatus.scholarshipListId)
                        }
                        else if (scholarshipStatus.statusId == -3 || scholarshipStatus.statusId == -2) {
                            $('#apply').prop("disabled", false);
                            $('#apply').html("Apply for Scholarship")
                            swal.fire(scholarshipStatus.message, "", "info");
                        } else {
                            window.location.replace('/scholarship-form/' + applicationStatus.scholarshipListId)
                        }
                    }
                })
            }
        }
    })
}


let applicationStatus = (id) => {
    $('#status').prop("disabled", true);
    $('#status').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Application Status</span>")
    $.ajax({
        url: '/application-status/' + id,
        method: 'get',
        success: (response) => {
            switch (response.statusId) {
                case -4:
                    swal.fire(response.message, "", "error");
                    break;
                case -3:
                    swal.fire(response.message, "", "info");
                    break;
                case -2:
                    swal.fire(response.message, "", "info");
                    break;
                case -1:
                    swal.fire(response.message, "please resubmit", "warning");
                    break;
                case 0:
                    swal.fire(response.message, "", "info");
                    break;
                case 1:
                    swal.fire(response.message, "", "info");
                    break;
                case 2:
                    swal.fire(response.message, "", "success");
                    break;
                case 3:
                    swal.fire(response.message, "", "success");
                    break;
                case 4:
                    swal.fire(response.message, "", "success");
                    break;
            }
            $('#status').prop("disabled", false);
            $('#status').html("Application Status")
        }
    })
}
let printApplication = (id) => {
    $('#print').prop("disabled", true);
    $('#print').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Print Application</span>")
    $.ajax({
        url: '/application-status/' + id,
        method: 'get',
        success: (response) => {
            $('#print').prop("disabled", false);
            $('#print').html("Print Application")
            let isSubmitted = response.statusId == 2 || response.statusId == 3 || response.statusId == 4;
            if (isSubmitted) {
                window.location.replace('/print-application/?id=' + response.scholarshipListId)
            } else if (response.statusId == -3 || response.statusId == -2) {
                swal.fire(response.message, "", "info");
            } else if (response.statusId == -1) {
                swal.fire(response.message, "please resubmit", "error");
            }
            else {
                swal.fire("Application not Submitted", "", "info");
            }
        }
    })
}

let prospectus = (id) => {
    location.replace('/prospectus/?id=' + id)
}