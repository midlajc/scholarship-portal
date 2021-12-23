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

router.get('/settings',auth.ensureAdminAuthenticated,(req,res)=>{
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

router.post('/approve-application', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.approveApplication(req.body.email).then(() => {
        res.json({ status: true })
    })
})

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