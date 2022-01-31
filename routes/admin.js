var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/admin_helper')
var passport = require('passport')
var auth = require('../configs/auth');
const user_helper = require('../helpers/user_helper');
const Helper = require('../helpers/Helper');
const fs = require('fs');
const { response } = require('express');

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
        adminHelper.getPendingApplication(scholarshipListId).then(async response => {
            let data = []
            for (x in response) {
                let isEligible = await Helper.checkEligibility(criteria, response[x])
                if (isEligible.status) {
                    data.push(response[x])
                }
            }
            res.render('admin/scholarship/pending-list', { data })
        }).catch((err) => {
            req.flash('error_msg', err)
            res.render('admin/scholarship/pending-list', { err })
        })
    })

router.get('/scholarship/fetch-application', auth.ensureAdminAuthenticated, (req, res) => {
    let applicationNo = req.query.id
    adminHelper.getApplicationByApplicationNo(applicationNo).then(applicationData => {
        res.json({ status: true, data: applicationData })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.patch('/scholarship/verify-application', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.verifyApplication(req.body).then(response => {
        res.json({ status: true })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.patch('/scholarship/reject-application', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.rejectApplication(req.body.applicationNo, req.body.reason).then(response => {
        res.json({ status: true })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.patch('/scholarship/approve-application', auth.ensureAdminAuthenticated, (req, res) => {
    adminHelper.approveApplication(req.body.applicationNo).then(response => {
        res.json({ status: true })
    }).catch(err => {
        res.json({ status: false, err: err })
    })
})

router.delete('/scholarship/delete-application', auth.ensureAdminAuthenticated,
    ((req, res) => {
        adminHelper.deleteApplication(req.body.applicationNo).then(response => {
            res.json({ status: true })
        }).catch(err => {
            res.json({ status: false, err: err })
        })
    }))


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

router.get('/settings/scholarships', auth.ensureAdminAuthenticated,
    (req, res) => {
        adminHelper.getScholarships().then(scholarships => {
            res.render('admin/settings/scholarships', { scholarships })
        }).catch(err => {
            console.log(err);
            req.flash('error_msg', "Error Occured Try Again")
            res.render('admin/settings/scholarships')
        })
    })

router.get('/settings/scholarship-list', auth.ensureAdminAuthenticated,
    async (req, res) => {
        let scholarshipId = req.query.id
        let scholarship = await Helper.getScholarship(scholarshipId)
        adminHelper.getScholarshipList(scholarshipId)
            .then(scholarshipList => {
                res.render('admin/settings/scholarship-list', { scholarshipList, scholarship })
            }).catch(err => {
                console.log(err);
                req.flash('error_msg', "Error Occured Try Again")
                res.render('admin/settings/scholarship-list')
            })
    })

router.get('/settings/academic-year', auth.ensureAdminAuthenticated,
    (req, res) => {
        adminHelper.getAcademicYear().then(academicYear => {
            res.render('admin/settings/academic-year', { academicYear })
        }).catch(err => {
            console.log(err);
            req.flash('error_msg', "Error Occured Try Again")
            res.render('admin/settings/academic-year')
        })
    })

router.get('/settings/departments', auth.ensureAdminAuthenticated,
    (req, res) => {
        adminHelper.getDepartments().then(departments => {
            res.render('admin/settings/departments', { departments })
        }).catch(err => {
            console.log(err);
            req.flash('error_msg', "Error Occured Try Again")
        })
    })

router.get('/settings/send-email', auth.ensureAdminAuthenticated,
    (req, res) => {
        res.render('admin/settings/send-email')
    })

router.post('/settings/send-email', auth.ensureAdminAuthenticated,
    (req, res) => {
        adminHelper.sendEmail(req.body).then(() => {
            res.json({ status: true })
        }).catch(err => {
            res.json({ status: false, err: err })
        })
    })

router.post('/settings/send-email/upload-email-csv', auth.ensureAdminAuthenticated,
    (req, res) => {
        if (req.files.csv.mimetype === 'text/csv') {
            let emails = req.files.csv.data.toString()
            emails = emails.replace('email\n', '').replace(/\n/g, ',')
            res.json({ status: true, emails: emails })
        } else {
            res.json({ status: false, message: 'Given file is not csv' })
        }
    })

router.get('/files/download-email-template', auth.ensureAdminAuthenticated,
    (req, res) => {
        var file = fs.createReadStream('./public/csv/email_template.csv');
        var stat = fs.statSync('./public/csv/email_template.csv');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=template.csv');
        file.pipe(res);
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