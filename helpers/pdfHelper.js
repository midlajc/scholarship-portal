const PDFDocument = require('pdfkit');

function buildPDF(data, dataCallback, endCallback) {
    const doc = new PDFDocument({
        bufferPages: true,
        font: 'Courier',
        margins: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        size: 'A4'
    });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);
    // doc.text(' ')
    doc.font('Courier-Bold');

    doc.fontSize(18).text(`${data.scholarship.scholarshipName}`, 60, 85);
    doc.rect(450, 30, 100, 120).stroke()
    doc.font('Courier');

    doc.fontSize(10).text('Photo', 480, 85)

    doc.text('', 30)
    doc.text(' ')
    doc.text(' ')
    doc.text(' ')
    doc.text(`Application No: ${data.applicationNo}`)
    doc.text(' ')
    

    // doc.font('Helvetica');


    //main box
    doc.rect(25, 164, 540, 390).stroke()
    //row 1
    doc.rect(25, 164, 180, 30).stroke()
    doc.moveDown();
    // doc.font('Courier-Bold');
    doc.text(`Name of Applicant`, 25, 175, {
        width: 180,
        align: 'center'
    }
    );
    doc.rect(180 + 25, 164, 180, 30).stroke()
    doc.text(`DOB`, 25 + 180, 175, {
        width: 180,
        align: 'center'
    }
    );
    doc.rect(25 + 180 + 180, 164, 180, 30).stroke()
    doc.text(`Gender`, 25 + 180 + 180, 175, {
        width: 180,
        align: 'center'
    }
    );

    //row 2
    // doc.font('Courier');

    doc.moveTo(25, 164 + 30 + 40).lineTo(540 + 25, 164 + 30 + 40).stroke()
    doc.text(`${data.user.name}`, 25, 175 + 35, {
        width: 180,
        align: 'center'
    }
    );
    doc.moveTo(25 + 180, 164 + 30 + 40).lineTo(164 + 30 + 11, 180 + 15).stroke()
    doc.text(`${data.user.dob}`, 25 + 180, 175 + 35, {
        width: 180,
        align: 'center'
    }
    );
    doc.moveTo(25 + 180 + 180, 164 + 30 + 40).lineTo(164 + 30 + 11 + 180, 180 + 15).stroke()
    doc.text(`${data.user.gender}`, 25 + 180 + 180, 175 + 35, {
        width: 180,
        align: 'center'
    }
    );

    //row 3

    // doc.font('Courier-Bold');

    doc.moveTo(25, 164 + 30 + 40 + 25).lineTo(540 + 25, 164 + 30 + 40 + 25).stroke()
    doc.text(`Permenent Address`, 25, 175 + 35 + 32, {
        width: 180,
        align: 'center'
    }
    );
    doc.moveTo(25 + 180, 164 + 30 + 40 + 25).lineTo(164 + 30 + 11, 180 + 15).stroke()
    doc.text(`Communication Address`, 25 + 180, 175 + 35 + 32, {
        width: 180,
        align: 'center'
    }
    );
    doc.moveTo(25 + 180 + 180, 164 + 30 + 40 + 25).lineTo(164 + 30 + 11 + 180, 180 + 15).stroke()
    doc.text(`Annual income`, 25 + 180 + 180, 175 + 35 + 32, {
        width: 180,
        align: 'center'
    }
    );

    //row 4
    doc.fontSize(10)

    // doc.font('Courier');
    doc.moveTo(25, 164 + 30 + 40 + 25 + 55).lineTo(540 + 25, 164 + 30 + 40 + 25 + 55).stroke()
    data.personal.pAddress = data.personal.pAddress.replace(/(\r\n|\n|\r)/gm, ",").replace(/.$/, "");
    doc.text(`${data.personal.pAddress}`, 25, 175 + 35 + 32 + 24, {
        width: 180,
        align: 'center'
    }
    );
    doc.moveTo(25 + 180, 164 + 30 + 40 + 25 + 55).lineTo(164 + 30 + 11, 180 + 15).stroke()
    data.personal.cAddress = data.personal.cAddress.replace(/(\r\n|\n|\r)/gm, ",").replace(/.$/, "");
    doc.text(`${data.personal.cAddress}`, 25 + 180, 175 + 35 + 32 + 24, {
        width: 180,
        align: 'center'
    }
    );
    doc.fontSize(10)

    doc.moveTo(25 + 180 + 180, 164 + 30 + 40 + 25 + 55).lineTo(164 + 30 + 11 + 180, 180 + 15).stroke()
    doc.text(`${data.personal.annualIncome}`, 25 + 180 + 180, 175 + 35 + 32 + 38, {
        width: 180,
        align: 'center'
    }
    );

    //row 5
    // doc.font('Courier-Bold');

    doc.moveTo(25, 164 + 30 + 40 + 25 + 55 + 25).lineTo(540 + 25, 164 + 30 + 40 + 25 + 55 + 25).stroke()
    doc.text(`Department`, 25, 175 + 35 + 32 + 23 + 57, {
        width: 180,
        align: 'center'
    }
    );
    doc.moveTo(25 + 180, 164 + 30 + 40 + 25 + 55 + 25).lineTo(164 + 30 + 11, 180 + 15).stroke()
    doc.text(`Course`, 25 + 180, 175 + 35 + 32 + 23 + 57, {
        width: 180,
        align: 'center'
    }
    );
    doc.moveTo(25 + 180 + 180, 164 + 30 + 40 + 25 + 55 + 25).lineTo(164 + 30 + 11 + 180, 180 + 15).stroke()
    doc.text(`Batch`, 25 + 180 + 180, 175 + 35 + 32 + 38 + 42, {
        width: 180,
        align: 'center'
    }
    );

    //row 6
    // doc.font('Courier');
    doc.fontSize(10)

    doc.moveTo(25, 164 + 30 + 40 + 25 + 55 + 25 + 30).lineTo(540 + 25, 164 + 30 + 40 + 25 + 55 + 25 + 30).stroke()
    doc.text(`${data.user.department}`, 25, 175 + 35 + 32 + 23 + 57 + 28, {
        width: 180,
        align: 'center'
    }
    );
    doc.moveTo(25 + 180, 164 + 30 + 40 + 25 + 55 + 25 + 30).lineTo(164 + 30 + 11, 180 + 15).stroke()
    doc.text(`${data.user.course}`, 25 + 180, 175 + 35 + 32 + 23 + 57 + 24, {
        width: 180,
        height: 30,
        align: 'center'
    }
    );

    doc.moveTo(25 + 180 + 180, 164 + 30 + 40 + 25 + 55 + 25 + 30).lineTo(164 + 30 + 11 + 180, 180 + 15).stroke()
    doc.text(`${data.user.batch}`, 25 + 180 + 180, 175 + 35 + 32 + 38 + 42 + 28, {
        width: 180,
        align: 'center'
    }
    );

    // row 7
    // doc.font('Courier-Bold');

    doc.moveTo(25, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85).lineTo(540 + 25, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85).stroke()
    doc.fontSize(10)
    doc.moveTo(25 + 270 - 120, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85).lineTo(164 + 30 + 40 + 60 - 120, 164 + 30 + 40 + 25 + 55 + 25 + 30).stroke()
    doc.text(`Are you preparing for competitive exams`, 25, 175 + 35 + 32 + 38 + 42 + 28 + 28, {
        width: 150,
        align: 'center'
    }
    );
    // doc.font('Courier');

    data.academic.competitiveExam = (data.academic.competitiveExam) ? 'Yes' : 'No';
    doc.fontSize(10)
    doc.text(`${data.academic.competitiveExam}`, 25 + 150, 175 + 35 + 32 + 38 + 42 + 28 + 33, {
        width: 120,
        align: 'center'
    }
    );


    doc.moveTo(25, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 35).lineTo(270 + 25, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 35).stroke()

    // doc.font('Courier-Bold');

    doc.fontSize(10)
    doc.moveTo(25 + 270 - 120, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85).lineTo(164 + 30 + 40 + 60 - 120, 164 + 30 + 40 + 25 + 55 + 25 + 30).stroke()
    doc.text(`If so, which Competitive Exam and coaching Institute?`, 25, 175 + 35 + 32 + 38 + 42 + 28 + 63, {
        width: 150,
        align: 'center'
    }
    );
    // doc.font('Courier');

    doc.fontSize(10)
    doc.text(`${data.academic.competitiveExamName}`, 25 + 150 + 10, 175 + 35 + 32 + 38 + 42 + 28 + 70, {
        width: 105,
        align: 'center'
    }
    );

    doc.moveTo(25 + 270, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85).lineTo(164 + 30 + 40 + 60, 164 + 30 + 40 + 25 + 55 + 25 + 30).stroke()

    // doc.font('Courier-Bold');
    doc.fontSize(10)
    doc.moveTo(25 + 270 - 120, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85).lineTo(164 + 30 + 40 + 60 - 120, 164 + 30 + 40 + 25 + 55 + 25 + 30).stroke()

    doc.text(`is Hosteler`, 25 + 270, 175 + 35 + 32 + 38 + 42 + 28 + 30, {
        width: 150,
        align: 'center'
    }
    );

    // doc.font('Courier');

    doc.fontSize(10)
    data.academic.isHostler = (data.academic.isHostler) ? 'Yes' : 'No';
    doc.text(`${data.academic.isHostler}`, 25 + 150 + 270, 175 + 35 + 32 + 38 + 42 + 28 + 30, {
        width: 105,
        align: 'center'
    }
    );
    doc.moveTo(25 + 270, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 26).lineTo(164 + 30 + 40 + 25 + 55 + 25 + 30 + 35 + 161, 25 + 270 + 100).stroke()

    // doc.font('Courier-Bold');


    doc.fontSize(10)
    doc.moveTo(25 + 270 - 120, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85).lineTo(164 + 30 + 40 + 60 - 120, 164 + 30 + 40 + 25 + 55 + 25 + 30).stroke()
    doc.text(`Do you work part time`, 22 + 270, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 25, {
        width: 150,
        align: 'center'
    }
    );

    // doc.font('Courier');
    data.personal.partTimeJob = (data.personal.partTimeJob) ? 'Yes' : 'No';

    doc.fontSize(10)
    doc.text(`${data.personal.partTimeJob}`, 25 + 150 + 270, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 25, {
        width: 105,
        align: 'center'
    }
    );

    doc.moveTo(25 + 270, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 22 + 30).lineTo(164 + 30 + 40 + 25 + 55 + 25 + 30 + 35 + 161, 25 + 270 + 96 + 30).stroke()

    // doc.font('Courier-Bold');

    doc.fontSize(10)
    doc.moveTo(25 + 270 - 120, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85).lineTo(164 + 30 + 40 + 60 - 120, 164 + 30 + 40 + 25 + 55 + 25 + 30).stroke()
    doc.text(`If so, what's the job`, 22 + 270, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55, {
        width: 150,
        align: 'center'
    }
    );

    // doc.font('Courier');

    doc.fontSize(10)
    doc.text(`${data.personal.partTimeJobName}`, 25 + 150 + 270, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55, {
        width: 105,
        align: 'center'
    }
    );

    doc.moveTo(25 + 270 + 145, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85).lineTo(164 + 30 + 40 + 60 + 145, 164 + 30 + 40 + 25 + 55 + 25 + 30).stroke()


    //row 8
    doc.moveTo(24 + 270, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85 + 50).lineTo(164 + 30 + 40 + 60, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85).stroke()

    doc.moveTo(25, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85 + 25).lineTo(540 + 25, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85 + 25).stroke()

    doc.fontSize(10)

    // doc.font('Courier-Bold');

    doc.text(`Email of Applicant`, 25, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28, {
        width: 270,
        align: 'center'
    }
    );

    // doc.font('Courier');

    doc.fontSize(10)
    doc.text(`${data.user.email}`, 25 + 270, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28, {
        width: 270,
        align: 'center'
    }
    );

    doc.moveTo(25, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85 + 50).lineTo(540 + 25, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85 + 50).stroke()

    // doc.font('Courier-Bold');

    doc.text(`Mobile No of Applicant`, 25, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 26, {
        width: 270,
        align: 'center'
    }
    );

    // doc.font('Courier');

    doc.fontSize(10)
    doc.text(`${data.user.mobile}`, 25 + 270, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 26, {
        width: 270,
        align: 'center'
    }
    );

    //row 9
    doc.moveTo(24 + 270, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85 + 50 + 50).lineTo(164 + 30 + 40 + 60, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85 + 50).stroke()

    doc.moveTo(25, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85 + 25 + 50).lineTo(540 + 25, 164 + 30 + 40 + 25 + 55 + 25 + 30 + 85 + 25 + 50).stroke()

    doc.fontSize(10)

    // doc.font('Courier-Bold');

    doc.text(`Plus two Mark Percentage`, 25, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 50, {
        width: 270,
        align: 'center'
    }
    );
    doc.fontSize(10)
    doc.text(`Previous Sem Mark Percentage`, 25 + 270, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 50, {
        width: 270,
        align: 'center'
    }
    );

    // doc.font('Courier');

    doc.fontSize(10)
    doc.text(`${data.academic.plusTwo}%`, 25, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 26 + 50, {
        width: 270,
        align: 'center'
    }
    );
    doc.text(`${data.academic.previousSem}%`, 25 + 270, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 26 + 50, {
        width: 270,
        align: 'center'
    }
    );

    doc.text(`place:`, 40, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 26 + 50 + 50)
    doc.text(`date:`, 40, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 26 + 50 + 50 + 20)

    doc.text(`Applicant Name`, 40+270, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 26 + 50 + 50)
    doc.text(`Sign`, 40+270, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 26 + 50 + 50 + 20)

    doc.rect(25, 175 + 35 + 32 + 38 + 42 + 28 + 30 + 55 + 28 + 26 + 50 + 50 + 20+40, 540, 170).stroke()
    
    doc.end();
}

module.exports = { buildPDF };