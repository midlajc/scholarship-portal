var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/admin_helper')
var passport = require('passport')
var auth = require('../configs/auth');
const user_helper = require('../helpers/user_helper');
const Helper = require('../helpers/Helper');
const { application, response } = require('express');
const { log } = require('debug');

//HOME

router.get('/', auth.ensureAdminAuthenticated,
    (req, res, next) => {
        res.redirect('/admin/applicant-list')
        // res.render('admin/home')
    });


router.get('/applicant-list', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getApplicantList().then(async data => {
        // console.log(data);
        // let batch=await Helper.getBatchById(data.user.batchId)
        res.render('admin/applicant-list', { data })
    }).catch((err) => {
        req.flash('error_msg', err)
        res.render('admin/applicant-list', { err })
    })
})

router.get('/primary-verification', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getSubmittedApplications().then(async data => {
        res.render('admin/primary-verification', { data })
    }).catch((err) => {
        req.flash('error_msg', err)
        res.render('admin/primary-verification', { err })
    })
})

router.get('/approval', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getVerifiedApplications().then(async data => {
        res.render('admin/approval', { data })
    }).catch((err) => {
        req.flash('error_msg', err)
        res.render('admin/approval', { err })
    })
})

router.get('/approved-list', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getApprovedApplications().then(async data => {
        res.render('admin/approved-list', { data })
    }).catch((err) => {
        req.flash('error_msg', err)
        res.render('admin/approved-list', { err })
    })
})

router.get('/rejected-list', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getRejectedApplications().then(async data => {
        res.render('admin/rejected-list', { data })
    }).catch((err) => {
        req.flash('error_msg', err)
        res.render('admin/rejected-list', { err })
    })
})

router.get('/fetch-application', auth.ensureAdminAuthenticated, (req, res) => {
    let applicationNo = req.query.id
    adminHelper.getApplicationByApplicationNo(applicationNo).then(response => {
        let data = {
            dob: response.user.dob.getDate() + '/' + (response.user.dob.getMonth() + 1) + '/' + response.user.dob.getFullYear(),
            name: response.user.name,
            applicationNo: response.applicationNo,
            applicationStatus: response.applicationStatus.message,
            email: response.user.email,
            mobile: response.user.mobile,
            gender: response.user.gender.genderName,
            batch: response.batch.BATCHNAME,
            course: response.course.COURSENAME,
            department: response.department.DEPARTMENTNAME,
            competitiveExam: response.academic.competitiveExam,
            competitiveExamName: response.academic.competitiveExamName,
            isHostler: response.academic.isHostler,
            plusTwo: response.academic.plusTwo,
            otherScholarship: response.academic.otherScholarship,
            otherScholarshipName: response.academic.scholarshipName,
            previousSem: response.academic.previousSem,
            annualIncome: response.personal.annualIncome,
            cAddress: response.personal.cAddress,
            pAddress: response.personal.pAddress,
            partTimeJob: response.personal.partTimeJob,
            partTimeJobName: response.personal.partTimeJobName,
            district: response.contact.district,
            panchayath: response.contact.panchayath,
            state: response.contact.state,
            taluk: response.contact.taluk,
            wardMemberMobile: response.contact.wardMemberMobile,
            wardMemberName: response.contact.wardMemberName,
            wardNo: response.contact.wardNo,
            family_members: response.family_members,
            accountHolderName: response.bank_details.accountHolderName,
            accountNo: response.bank_details.accountNo,
            bankName: response.bank_details.bankName,
            ifsc: response.bank_details.ifsc,
            branch: response.bank_details.branch,
            scholarshipName: response.scholarship.scholarshipName
        }
        res.json({ status: true, data: data })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.patch('/verify-application', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.verifyApplication(req.body.applicationNo).then(response => {
        res.json({ status: true })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.patch('/reject-application', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.rejectApplication(req.body.applicationNo).then(response => {
        res.json({ status: true })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.patch('/approve-application', auth.ensureAdminAuthenticated, (req, res) => {
    console.log(req.body.applicationNo);
    adminHelper.approveApplication(req.body.applicationNo).then(response => {
        res.json({ status: true })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.get('/settings', auth.ensureAdminAuthenticated, (req, res) => {
    res.render('admin/settings')
})

//Registration Routers

router.get("/registration", auth.ensureAdminAuthenticated, (req, res) => {
    res.render('admin/registration')
})

router.post("/registration", auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.userRegistration(req.body).then((response) => {
        res.redirect('/admin/registration')
    })

})

router.get('/view-applications', auth.ensureAdminAuthenticated, (req, res) => {
    if (req.params.user) {
    } else {
        adminHelper.getApplicationData().then(response => {
            res.render('admin/view-applications', { data: response })
        })
    }
})

router.get('/pending-applications', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getPendingData().then(response => {
        res.render('admin/view-pending-application', { data: response })
    })
})

// router.post('/approve-application', auth.ensureAdminAuthenticated, (req, res) => {
//     adminHelper.approveApplication(req.body.email).then(() => {
//         res.json({ status: true })
//     })
// })

router.get('/verified applications', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getVerifiedApplication().then(data => {
        res.render('admin/verifiedapplicatons', { data: data })
    })
})

router.get('/emailverificationpending', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getEmailVerificationPending().then(data => {
        res.render('admin/emailverificationpending', { data: data })
    })
})

router.post('/resendverificationemail', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.resendVerificationEmail(req.body.email, req.headers.host).then(response => {
        res.json({ status: true, message: response })
    })
})

//router for participant list 

router.get('/viewparticipants/:item', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getParticipantsData(req.params.item).then(data => {
        res.render('admin/viewparticipants', { data: data })
    })
})


//routers for it quiz

router.get('/startitquiz', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.startItQuiz().then(response => {
        res.json({ status: true, message: response })
    })
})

router.get('/additquizquestions', auth.ensureAdminAuthenticated, (req, res) => {
    res.render('admin/additquizquestions')
})

router.post('/additquizquestions', auth.ensureAdminAuthenticated, async (req, res) => {
    req.body._id = await adminHelper.getNewQuestionId()
    adminHelper.addItQuizQustion(req.body).then(() => {
        req.flash('success_msg', 'Qustion Added')
        res.redirect('/admin/additquizquestions')
    })
})

router.get('/viewquestions', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getAllQuestions().then(data => {
        res.render('admin/viewquestions', { data: data })
    })
})

//login and log out 

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'user')
            res.redirect('/')
        else if (req.user.type === 'admin')
            res.redirect('/admin')
        else if (req.user.type === 'superAdmin')
            res.redirect('/superadmin')
        else
            res.render('admin/login')
    } else
        res.render('admin/login')
})

router.post('/login',
    passport.authenticate('admin', { successRedirect: '/admin', failureRedirect: '/admin/login', failureFlash: true }),
    (req, res) => {
        res.redirect('/admin')
    })

router.get('/logout', auth.ensureAdminAuthenticated,
    (req, res) => {
        req.logout()
        res.redirect('/admin/login')
    })

module.exports = router;