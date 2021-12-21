const express = require('express');
const router = express.Router();
const userHelper = require('../helpers/user_helper')
const passport = require('passport')
const auth = require('../configs/auth');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const Helper = require('../helpers/Helper');
const pdfHelper = require('../helpers/pdfHelper');
const fs=require('fs')

/* GET home page. */

router.get('/', (req, res) => {
    res.render('user/index')
})

router.get('/home', auth.ensureUserAuthenticated, function (req, res, next) {
    userHelper.getDeptAndCourseAndBatchByBatchId(req.user.batchId)
        .then(async response => {
            req.user.department = response.department.DEPARTMENTNAME;
            req.user.batch = response.BATCHNAME;
            req.user.course = response.course.COURSENAME;
            req.user.gender = await userHelper.getGenderNameByGenderId(req.user.genderId)
            req.user.dob = req.user.dob.getDate() + '/' + (req.user.dob.getMonth() + 1) + '/' + req.user.dob.getFullYear();
            res.render('user/home');
        })
});

router.get("/registration", (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'user')
            res.redirect('/home')
        else if (req.user.type === 'admin')
            res.redirect('/admin')
        else
            res.render('user/login')
    } else {
        userHelper.getDepartments().then(departments => {
            userHelper.getGenders().then(gender => {
                res.render('user/registration', { departments, gender, captchaSitekey: process.env.captchaSitekey })
            })
        })
    }
})

router.get('/getcoursebydeptid/:id', (req, res) => {
    department_id = parseInt(req.params.id);
    userHelper.getCoursesByDeptId(department_id).then(courses => {
        res.json({ courses })
    })
})

router.get('/getbatchbycourseid/:id', (req, res) => {
    course_id = parseInt(req.params.id);
    userHelper.getBatchByCoursesId(course_id).then(batches => {
        res.json({ batches })
    })
})

router.post("/registration",
    body('mobile', 'mobile number must be 10 digits').isLength({ max: 10, min: 10 }),
    body('password', 'password require minimum 8 charecters').isLength({ min: 8 }),
    async (req, res) => {
        const captcha_response_key = req.body["g-recaptcha-response"];
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.captchaSecretKey}&response=${captcha_response_key}`;
        let captcha_response = await axios.post(url, {
            secret: process.env.captchaSecretKey,
            response: captcha_response_key
        })
        let error = []
        const errors = validationResult(req);
        isErrors = (Array.isArray(errors.errors) && errors.errors.length)
        if (captcha_response.data.success == false) {
            error.push('Captcha not Verified properly')
            res.json({ status: false, errors: error })
        } else if (isErrors) {
            for (x in errors.errors) {
                error.push(errors.errors[x].msg)
            }
            res.json({ status: false, errors: error })
        } else if (req.body.password != req.body.c_password) {
            error.push('password do not match')
            res.json({ status: false, errors: error })
        } else {
            userHelper.useRegistration(req.body, req.headers.host).then(response => {
                res.json({ status: true, message: response })
            }).catch(response => {
                error.push(response)
                res.json({ status: false, errors: error })
            })
        }
    })

router.get('/verifyemail/:token', (req, res) => {
    userHelper.verifyEmail(req.params.token).then(response => {
        req.flash('success_msg', response)
        res.redirect('/login')
    }).catch(response => {
        req.flash('error_msg', response)
        res.redirect('/login')
    })
})

router.get('/scholarships', auth.ensureUserAuthenticated, (req, res) => {
    userHelper.filterScholarship(req.user).then(response => {
        res.render('user/scholarships', { scholarships: response })
    })
})

router.get('/applicationstatus/:id', auth.ensureUserAuthenticated, (req, res) => {
    let scholarshipId = req.params.id;
    userHelper.applicationStatus(scholarshipId, req.user).then(applicationStatus => {
        Helper.getApplicationStatusMessage(applicationStatus.statusId).then(message => {
            applicationStatus.message = message
            res.json(applicationStatus)
        })
    })
})

router.get('/scholarshipform/:id', auth.ensureUserAuthenticated,
    (req, res) => {
        let scholarshipListId = req.params.id
        userHelper.getscholarshipListByscholarshipListId(scholarshipListId)
            .then((scholarship) => {
                userHelper.applicationStatus(scholarship.scholarshipId, req.user)
                    .then(async (response) => {
                        isTrue = response.statusId == 0 || response.statusId == -1 || response.statusId == 1
                        if (isTrue) {
                            districts = await Helper.getDistrictList()
                            states = await Helper.getStateList()
                            userHelper.getApplicationDetails(scholarshipListId, req.user._id)
                                .then(async response => {
                                    let taluks, panchayaths;
                                    let [personal_details, academic_details, contact_details, application_details] = [null, null, null, null];
                                    if (response) {
                                        [personal_details, academic_details, contact_details, application_details] = response
                                        taluks = await Helper.getTaluks(contact_details.districtId)
                                        panchayaths = await Helper.getPanchayaths(contact_details.districtId)
                                    }
                                    res.render('user/scholarshipform',
                                        {
                                            personal_details,
                                            academic_details,
                                            contact_details,
                                            application_details,
                                            states,
                                            districts,
                                            scholarship,
                                            panchayaths,
                                            taluks,
                                            user: req.user
                                        })
                                })
                        }
                        else {
                            req.flash('error_msg', response.message)
                            res.redirect('/scholarships')
                        }
                    })
            }).catch((err) => {
                req.flash('error_msg', err)
                res.redirect('/scholarships')
            })
    })

router.post('/scholarshipform', auth.ensureUserAuthenticated,
    body('plusTwo', '+2 Mark Percentage must be Numeric').isDecimal(),
    body('previousSem', 'Previous Sem Mark Percentage must be Numeric').isDecimal(),
    body('wardMemberMobile', 'Mobile number must be 10 digits').isLength({ min: 10, max: 10 }),
    (req, res) => {
        const errors = validationResult(req);
        let error = []
        isErrors = (Array.isArray(errors.errors) && errors.errors.length)
        if (isErrors) {
            for (x in errors.errors) {
                error.push(errors.errors[x].msg)
            }
            res.json({ status: false, errors: error })
        }
        else if (req.body.plusTwo > 100 || req.body.previousSem > 100) {
            error.push("Mark Percentage is greater than 100")
            res.json({ status: false, errors: error })
        }
        else {
            let scholarshipListId = req.body.scholarshipListId;
            userHelper.getscholarshipListByscholarshipListId(scholarshipListId)
                .then((scholarship) => {
                    userHelper.applicationStatus(scholarship.scholarshipId, req.user)
                        .then(async (response) => {
                            isTrue = response.statusId == 0 || response.statusId == -1 || response.statusId == 1
                            if (isTrue) {
                                userHelper.storeScholarshipFrom(req.body, scholarship, req.user).then(() => {
                                    res.json({ status: true, message: "Application Submitted Successfully" })
                                })
                            }
                            else {
                                res.json({ status: false })
                            }
                        })
                }).catch((err) => {
                    res.json({ status: false })
                })
        }
    })

router.get('/getVillageMunicipality/:districtId', async (req, res) => {
    let districtId = req.params.districtId
    let panchayaths = await Helper.getPanchayaths(districtId)
    res.json(panchayaths)
})

router.get('/getTaluk/:districtId', async (req, res) => {
    let districtId = req.params.districtId
    let taluks = await Helper.getTaluks(districtId)
    res.json(taluks)
})

router.get('/familymembers', auth.ensureUserAuthenticated, (req, res) => {
    userHelper.getFalimyMembers(req.user._id).then(response => {
        res.render('user/familymembers', { falimyMembers: response })
    })
})

router.post('/addfamilymember', auth.ensureUserAuthenticated, (req, res) => {
    userHelper.addFalimyMembers(req.body, req.user._id).then(response => {
        res.json({ status: true })
    })
})

router.post('/deletemember', auth.ensureUserAuthenticated, (req, res) => {
    userHelper.deleteFamilyMember(req.body.id).then(response => {
        res.json({ status: true })
    })
})

router.get('/bankdetails', auth.ensureUserAuthenticated, (req, res) => {
    userHelper.getBankDetails(req.user._id).then(response => {
        if (response) {
            res.render('user/bankdetails', { data: response })
        } else {
            res.render('user/bankform')
        }
    })
})

router.post("/bankdetails", auth.ensureUserAuthenticated, async (req, res) => {
    if (req.body.accountNo1 != req.body.accountNo2) {
        res.json({ status: false, message: "Account No Mismatch" })
    } else if (await userHelper.getBankDetails(req.user._id)) {
        res.json({ status: false, message: "Form Already Submitted" })
    }
    else {
        userHelper.saveBankDetails(req.body, req.user._id).then(response => {
            res.json({ status: true, message: "Account Details Saved" })
        })
    }
})




router.get('/forgotpassword', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'user')
            res.redirect('/home')
        else if (req.user.type === 'admin')
            res.redirect('/admin')
        else
            res.render('user/login')
    } else {
        res.render('user/forgotpassword')
    }
})

router.post('/forgotpassword', (req, res) => {
    userHelper.forgotPassword(req.body.email, req.headers.host).then(response => {
        res.json({ status: true, message: 'An e-mail has been sent to ' + req.body.email + ' with further instructions.' })
    }).catch(response => {
        res.json({ status: false, message: response })
    })
})
router.get('/resetpassword/:token', (req, res) => {
    userHelper.resetPasswordTokenValidate(req.params.token).then(() => {
        res.render('user/resetpassword')
    }).catch(() => {
        req.flash('error_msg', 'Password reset token is invalid or has expired.')
        res.redirect('/forgotpassword')
    })
})

router.post('/resetpassword/:token',
    body('password', 'Password require minimum 8 charecters').isLength({ min: 8 }),
    (req, res) => {
        const errors = validationResult(req);
        let isErrors = (Array.isArray(errors.errors) && errors.errors.length)
        if (isErrors) {
            req.flash('error_msg', errors.errors[0].msg)
            res.redirect(req.url)
        } else if (req.body.password != req.body.cPassword) {
            req.flash('error_msg', "Password do not match")
            res.redirect(req.url)
        } else {
            userHelper.resetPassword(req.params.token, req.body.password).then(() => {
                req.flash('success_msg', 'Password Reset Successful')
                res.redirect('/login')
            }).catch(() => {
                req.flash('error_msg', 'Password reset token is invalid or has expired.')
                res.redirect('/forgotpassword')
            })
        }
    })

router.get('/printapplication/:id', auth.ensureUserAuthenticated, (req, res) => {
    let scholarshipListId = req.params.id
    userHelper.getscholarshipListByscholarshipListId(scholarshipListId)
        .then((scholarship) => {
            userHelper.applicationStatus(scholarship.scholarshipId, req.user)
                .then(async (response) => {
                    isTrue = response.statusId == 2 || response.statusId == 3 || response.statusId == 4
                    if (isTrue) {
                        Helper.getApplicationDetailes(req.user._id, scholarshipListId).then(async data => {
                            const stream = res.writeHead(200, {
                                'Content-Type': 'application/pdf',
                                'Content-Disposition': `inline;filename=scholarship.pdf`,
                                // 'Content-Disposition': `attachment;filename=scholarship.pdf`,
                            });

                            let batchDetails = await userHelper.getDeptAndCourseAndBatchByBatchId(data.user.batchId)

                            data.user.department = batchDetails.department.DEPARTMENTNAME;
                            data.user.batch = batchDetails.BATCHNAME;
                            data.user.course = batchDetails.course.COURSENAME;
                            data.user.gender = await userHelper.getGenderNameByGenderId(data.user.genderId)
                            data.user.dob = data.user.dob.getDate() + '/' + (data.user.dob.getMonth() + 1) + '/' + data.user.dob.getFullYear();
                            pdfHelper.buildPDF(data,
                                (chunk) => stream.write(chunk),
                                () => stream.end()
                            );
                        })
                    }
                    else {
                        req.flash('error_msg', response.message)
                        res.redirect('/home')
                    }
                })
        }).catch((err) => {
            req.flash('error_msg', err)
            res.redirect('/home')
        })
})

router.get('/prospectus/:id', (req, res) => {
    let scholarshipId=req.params.id
    var file = fs.createReadStream('./public/pdf/scolarship/'+scholarshipId+'.pdf');
    var stat = fs.statSync('./public/pdf/scolarship/'+scholarshipId+'.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=prospectus.pdf');
    file.pipe(res);
})

router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'user')
            res.redirect('/home')
        else if (req.user.type === 'admin')
            res.redirect('/admin')
        else
            res.render('user/login')
    } else
        res.render('user/login')
})

router.post('/login',
    passport.authenticate('user', { successRedirect: '/home', failureRedirect: '/login', failureFlash: true }), (req, res) => {
        res.redirect('/home')
    });

router.get('/logout', auth.ensureUserAuthenticated,
    (req, res) => {
        req.logout();
        res.redirect('/login')
    })
//need
router.get('/settings', auth.ensureUserAuthenticated, (req, res) => {
    res.render('user/settings')
})

router.post('/changepassword', auth.ensureUserAuthenticated, (req, res) => {
    userHelper.updatePassword(req.user, req.body).then(response => {
        req.user.password = response;
        res.redirect('/settings')
    })
})


module.exports = router;