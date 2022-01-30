let viewApplication = (applicationNo) => {
    $.ajax({
        url: '/admin/scholarship/fetch-application/?id=' + applicationNo,
        method: 'get',
        success: (data) => {
            data = data.data
            $('#scholarshipName').val(data.scholarshipName)
            $('#applicationNo').val(data.applicationNo)
            $('#applicationStatus').val(data.applicationStatus)
            $('#name').val(data.name)
            $('#email').val(data.email)
            $('#mobile').val(data.mobile)
            $('#gender').val(data.gender)
            $('#dob').val(data.dob)
            $('#partTimeJob').val((data.partTimeJob) ? "Yes" : "No")
            $('#batch').val(data.batch)
            $('#course').val(data.course)
            $('#department').val(data.department)
            $('#competitiveExam').val((data.competitiveExam) ? "Yes" : "No")
            $('#competitiveExamName').val(data.competitiveExamName)
            $('#otherScholarship').val((data.otherScholarship) ? "Yes" : "No")
            $('#otherScholarshipName').val(data.otherScholarshipName)
            $('#isHosteler').val((data.isHosteler) ? "Yes" : "No")
            $('#plusTwo').val(data.plusTwo)
            $('#previousSem').val(data.previousSem)
            $('#annualIncome').val(data.annualIncome)
            $('#cAddress').val(data.cAddress)
            $('#pAddress').val(data.pAddress)
            $('#partTimeJobName').val(data.partTimeJobName)
            $('#state').val(data.state)
            $('#district').val(data.district)
            $('#wardNo').val(data.wardNo)
            $('#panchayath').val(data.panchayath)
            $('#taluk').val(data.taluk)
            $('#wardMemberMobile').val(data.wardMemberMobile)
            $('#wardMemberName').val(data.wardMemberName)
            $('#accountHolderName').val(data.accountHolderName)
            $('#accountNo').val(data.accountNo)
            $('#bankName').val(data.bankName)
            $('#ifsc').val(data.ifsc)
            $('#branch').val(data.branch)
            let html = ''
            for (x of data.family_members) {
                html += `
            <tr>
              <td>${x.name}</td>
              <td>${x.age}</td>
              <td>${x.relation}</td>
              <td>${x.occupation}</td>
              <td>${x.organization}</td>
              <td>${x.mobile}</td>
            </tr>
          `
            }
            $('#family_members').html(html)
            $('#model').modal()
        }
    })
}

$(document).ready(function () {
    let table = $('#table').DataTable({
        dom: 'Bfrtip',
        lengthMenu: [
            [5, 10, 25, 50, -1],
            ['5 rows', '10 rows', '25 rows', '50 rows', 'Show all']
        ],
        buttons: [
            {
                extend: 'pageLength',
                className: 'btn btn-dark',
            },
            {
                extend: 'excel',
                text: '<i class="fa fa-file-excel-o"></i> Excel',
                className: 'btn btn-dark',
                exportOptions: {
                    columns: 'th:not(:last-child)'
                }
            },
            {
                extend: 'pdf',
                text: '<i class="fa fa-file-pdf-o"></i> PDF',
                className: 'btn btn-dark',
                exportOptions: {
                    columns: 'th:not(:last-child)'
                }
            },
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i> Print',
                className: 'btn btn-dark',
                exportOptions: {
                    columns: 'th:not(:last-child)'
                }
            }
        ]
    });
});

