var nodemailer = require('nodemailer');

var email = process.env.email;
var emailPassword = process.env.emailPassword;

module.exports = sendMail = (data) => {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email,
                pass: emailPassword
            }
        });

        let mailOptions = {
            from: 'MSF WMOC<' + email + '>',
            to: data.recipient,
            subject: data.subject,
            text: data.message
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        resolve()
    })
}