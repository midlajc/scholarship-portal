var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/admin_helper')
var passport = require('passport')
var auth = require('../configs/auth');
const user_helper = require('../helpers/user_helper');

//HOME

router.get('/', auth.ensureAdminAuthenticated,
    (req, res, next) => {
        if (req.user.registration) {
            res.render('admin/home')
        } else {
            adminHelper.getItemStatus(getAdminCategory(req.user)).then(response => {
                if (response.status) {
                    res.render('admin/home', { itemData: response })
                } else {
                    res.render('admin/home', {
                        itemData: {
                            status: false
                        }
                    })
                }
            })
        }
    });

//router to get single user data    

router.get('/viewapplication/:user', auth.ensureAdminAuthenticated, (req, res) => {
    // req.url = req.url.slice(0, 16)
    // auth.ensureAdminAllowed(req, res, () => {
    // adminHelper.getSingleApplication(req.params.user).then(data => {
    // res.json({ status: true, data: data })
    // })
    // })
    adminHelper.getSingleApplication(req.params.user).then(data => {
        res.json({ status: true, data: data })
    })
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

router.get('/viewapplications', auth.ensureAdminAuthenticated, (req, res) => {
    if (req.params.user) {

    } else {
        adminHelper.getApplicationData().then(response => {
            res.render('admin/viewapplications', { data: response })
        })
    }
})

router.get('/pendingapplications', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.getPendingData().then(response => {
        res.render('admin/viewpendingapplication', { data: response })
    })
})

router.post('/approveapplication', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.approveApplication(req.body.email).then(() => {
        res.json({ status: true })
    })
})

router.get('/verifiedapplicatons', auth.ensureAdminAuthenticated, (req, res) => {
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

router.post('/additquizquestions', auth.ensureAdminAuthenticated, async(req, res) => {
    req.body._id=await adminHelper.getNewQuestionId()
    adminHelper.addItQuizQustion(req.body).then(() => {
        req.flash('success_msg', 'Qustion Added')
        res.redirect('/admin/additquizquestions')
    })
})

router.get('/viewquestions',auth.ensureAdminAuthenticated,(req,res)=>{
    adminHelper.getAllQuestions().then(data=>{
        res.render('admin/viewquestions',{data:data})
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