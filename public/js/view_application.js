let viewApplication = (applicationNo) => {
    $.ajax({
        url: '/admin/fetch-application/?id=' + applicationNo,
        method: 'get',
        success: (data) => {
            data = data.data
            console.log(data)
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
    $('#table').DataTable();
});

