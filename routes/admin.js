var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/admin_helper')
var passport = require('passport')
var auth = require('../configs/auth');
const user_helper = require('../helpers/user_helper');
const Helper = require('../helpers/Helper');

//HOME

router.get('/', auth.ensureAdminAuthenticated,
    (req, res, next) => {
        res.redirect('/admin/scholarship')
        // res.render('admin/home')
    });


router.get('/scholarship', auth.ensureAdminAuthenticated, (req, res) => {
    res.render('admin/scholarship')
})

router.get('/scholarship/applicant-list', auth.ensureAdminAuthenticated,
    async (req, res) => {
        let scholarshipId = 1
        let academicId = 1
        let scholarshipListId = await Helper.getScholarshipListId(scholarshipId, academicId)
        adminHelper.getApplicantList(scholarshipListId).then(async data => {
            res.render('admin/scholarship/applicant-list', { data })
        }).catch((err) => {
            req.flash('error_msg', err)
            res.render('admin/scholarship/applicant-list', { err })
        })
    })

router.get('/scholarship/primary-verification', auth.ensureAdminAuthenticated,
    async (req, res) => {
        let scholarshipId = 1
        let academicId = 1
        let scholarshipListId = await Helper.getScholarshipListId(scholarshipId, academicId)
        adminHelper.getSubmittedApplications(scholarshipListId).then(async data => {
            res.render('admin/scholarship/primary-verification', { data })
        }).catch((err) => {
            req.flash('error_msg', err)
            res.render('admin/scholarship/primary-verification', { err })
        })
    })

router.get('/scholarship/approval', auth.ensureAdminAuthenticated,
    async (req, res) => {
        let scholarshipId = 1
        let academicId = 1
        let scholarshipListId = await Helper.getScholarshipListId(scholarshipId, academicId)
        adminHelper.getVerifiedApplications(scholarshipListId).then(async data => {
            res.render('admin/scholarship/approval', { data })
        }).catch((err) => {
            req.flash('error_msg', err)
            res.render('admin/scholarship/approval', { err })
        })
    })

router.get('/scholarship/approved-list', auth.ensureAdminAuthenticated,
    async (req, res) => {
        let scholarshipId = 1
        let academicId = 1
        let scholarshipListId = await Helper.getScholarshipListId(scholarshipId, academicId)
        adminHelper.getApprovedApplications(scholarshipListId).then(async data => {
            res.render('admin/scholarship/approved-list', { data })
        }).catch((err) => {
            req.flash('error_msg', err)
            res.render('admin/scholarship/approved-list', { err })
        })
    })

router.get('/scholarship/rejected-list', auth.ensureAdminAuthenticated,
    async (req, res) => {
        let scholarshipId = 1
        let academicId = 1
        let scholarshipListId = await Helper.getScholarshipListId(scholarshipId, academicId)
        adminHelper.getRejectedApplications(scholarshipListId).then(async data => {
            res.render('admin/scholarship/rejected-list', { data })
        }).catch((err) => {
            req.flash('error_msg', err)
            res.render('admin/scholarship/rejected-list', { err })
        })
    })

router.get('/scholarship/pending-list', auth.ensureAdminAuthenticated,
    async (req, res) => {
        let scholarshipId = 1
        let academicId = 1
        let scholarshipListId = await Helper.getScholarshipListId(scholarshipId, academicId)
        let criteria = await Helper.getScholarshipCriteria(scholarshipId)
        console.log(criteria);
        adminHelper.getPendingApplication(scholarshipListId).then(async response => {
            let data = []
            for (x in response) {
                let isEligible = await Helper.checkEligibility(criteria, response[x])
                .then(isEligible=>{
                    if (isEligible.status) {
                        data.push(response[x])
                    }
                })
            }
            console.log(data);
            res.render('admin/scholarship/pending-list', { data })
        }).catch((err) => {
            req.flash('error_msg', err)
            res.render('admin/scholarship/pending-list', { err })
        })
    })

router.get('/scholarship/fetch-application', auth.ensureAdminAuthenticated, (req, res) => {
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

router.patch('/scholarship/verify-application', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.verifyApplication(req.body.applicationNo).then(response => {
        res.json({ status: true })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.patch('/scholarship/reject-application', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.rejectApplication(req.body.applicationNo).then(response => {
        res.json({ status: true })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.patch('/scholarship/approve-application', auth.ensureAdminAuthenticated, (req, res) => {
    console.log(req.body.applicationNo);
    adminHelper.approveApplication(req.body.applicationNo).then(response => {
        res.json({ status: true })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})


router.get('/users/registration-list', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.fetchRegistrationList().then(data => {
        res.render('admin/users/registration-list', { data })
    }).catch(err => {
        req.flash('error_msg', "Error Occured Try Again")
        res.render('admin/users/registration-list')
    })
})

router.patch('/users/delete-registration', auth.ensureAdminAuthenticated,
    (req, res) => {
        adminHelper.deleteRegistration(req.body.id).then(response => {
            res.json({ status: true })
        }).catch(err => {
            console.log(err);
            res.json({ status: false })
        })
    })

router.patch('/users/resend-verification-email', auth.ensureAdminAuthenticated,
    (req, res) => {
        adminHelper.resendVerificationEmail(req.body.id).then(() => {
            res.json({ status: true })
        }).catch(err => {
            console.log(err);
            res.json({ status: false })
        })
    })

router.get('/users/user-list', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.fetchUsersList().then(data => {
        res.render('admin/users/user-list', { data })
    }).catch(err => {
        console.log(err);
        req.flash('error_msg', "Error Occured Try Again")
        res.render('admin/users/user-list')
    })
})

router.patch('/users/delete-bank', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.deleteBank(req.body.id).then(() => {
        res.json({ status: true, message: "Deletion Successful" })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.get('/users/user-bank-list', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.fetchUsersBanks().then(data => {
        res.render('admin/users/user-bank-list', { data })
    }).catch(err => {
        console.log(err);
        req.flash('error_msg', "Error Occured Try Again")
        res.render('admin/users/user-bank-list')
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