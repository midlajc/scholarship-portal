let applyForScholarship = (id) => {
    $('#apply').prop("disabled", true);
    $('#apply').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Apply for Scholarship</span>")
    $.ajax({
        url: '/applicationstatus/' + id,
        method: 'get',
        success: (response) => {
            let isSubmitted = response.statusId == 2 || response.statusId == 3 || response.statusId == 4;
            if (isSubmitted) {
                $('#apply').prop("disabled", false);
                $('#apply').html("Apply for Scholarship")
                swal.fire("Application Already Submitted", "", "success");
            } else if (response.statusId == -3 || response.statusId == -2) {
                $('#apply').prop("disabled", false);
                $('#apply').html("Apply for Scholarship")
                swal.fire(response.message, "", "info");
            }
            else {
                $('#apply').prop("disabled", false);
                $('#apply').html("Apply for Scholarship")
                window.location.replace('/scholarshipform/' + response.scholarshipListId)
            }
        }
    })
}
let applicationStatus = (id) => {
    $('#status').prop("disabled", true);
    $('#status').html("<span class=" + "'spinner-border spinner-border-sm'" + "></span><span class=" + "" + ">Application Status</span>")
    $.ajax({
        url: '/applicationstatus/' + id,
        method: 'get',
        success: (response) => {
            console.log(response);
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
                    swal.fire(response.message, "", "warning");
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
    swal.fire("hello world")

}