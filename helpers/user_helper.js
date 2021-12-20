const db = require('../configs/connection')
const bcrypt = require('bcrypt')
const collection = require('../configs/collection')
const nodeMailer = require('./nodeMailer')
const crypto = require('crypto')
const Helper = require('./Helper')
const { ObjectId } = require('mongodb')
const { response } = require('../app')
const { resolve } = require('path')
const { reject } = require('promise')

module.exports = {
    getUserByEmailForLogin: (email, callback) => {
        db.get().collection(collection.USER_COLLECTION).findOne({ email: email }).then((response) => {
            callback(null, response)
        }).catch((response) => {
            callback(response, null)
        })
    },
    comparePassword: (candidatePassword, hashPassword, callback) => {
        bcrypt.compare(candidatePassword, hashPassword, (err, isMatch) => {
            callback(err, isMatch)
        })
    },
    getUserById: (id, callback) => {
        db.get().collection(collection.USER_COLLECTION).findOne({ _id: id }).then((response) => {
            callback(null, response)
        }).catch((response) => {
            callback(response, null)
        })
    },
    useRegistration: (data, domine) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.REGISTRATION_COLLECTION).findOne({ email: data.email })
                .then(async (response) => {
                    if (response == null) {
                        let token = crypto.randomBytes(20)
                        token = token.toString('hex')
                        data.password = await bcrypt.hash(data.password, 10)
                        db.get().collection(collection.REGISTRATION_COLLECTION)
                            .insertOne({
                                name: data.name,
                                email: data.email,
                                mobile: data.mobile,
                                batchId: data.batch,
                                genderId: data.gender,
                                dateOfBirth: data.dateOfBirth,
                                password: data.password,
                                emailVerificationToken: token,
                                emailVerificationStatus: false,
                                submissionTime: Date.now()
                            }).then(() => {
                                nodeMailer({
                                    recipient: data.email,
                                    subject: "Registration",
                                    message: "Registration Successful\n\nclick this link to verify email" +
                                        ' https://' + domine + '/verifyemail/' + token + '\n\n'
                                })
                                resolve('check email to verify email')
                            })
                    } else {
                        reject('Already Registered')
                    }
                })
        })
    },
    verifyEmail: (token) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.REGISTRATION_COLLECTION).findOne({ emailVerificationToken: token }).then(response => {
                if (response) {
                    function addNewUser(data) {
                        return new Promise((resolve, reject) => {
                            db.get().collection(collection.USER_COLLECTION).updateOne(
                                { 'email': data.email },
                                {
                                    "$set": {
                                        _id: ObjectId(data._id),
                                        name: data.name,
                                        genderId: data.genderId,
                                        email: data.email,
                                        mobile: data.mobile,
                                        dob: new Date(data.dateOfBirth),
                                        password: data.password,
                                        batchId: parseInt(data.batchId),
                                        type: 'user'
                                    }
                                },
                                { upsert: true }).then(() => {
                                    resolve()
                                }).catch
                        })
                    }
                    function updateRegistrationStatus(email) {
                        return new Promise((resolve, reject) => {
                            db.get().collection(collection.REGISTRATION_COLLECTION).updateOne({ email: email }, { "$set": { "emailVerificationStatus": true } }).then((response) => {
                                resolve()
                            })
                        })
                    }
                    Promise.all([addNewUser(response), updateRegistrationStatus(response.email)]).then(() => {
                        resolve('Email Verified')
                    })
                } else {
                    reject('User not Found or Token is invalid')
                }
            })
        })
    },
    getGenders: () => {
        return new Promise((reslove, reject) => {
            db.get().collection(collection.GENDER_COLLECTION).find().toArray()
                .then(response => {
                    reslove(response);
                })
        })
    },
    getUserByEmail: (email) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: email })
            if (user)
                resolve(user)
            else
                reject('User not Found')
        })
    },
    getDepartments: () => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.DEPARTMENTS_COLLECTION).find().toArray()
                .then(response => {
                    resolve(response)
                })
        })
    },
    getCoursesByDeptId: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COURSES_COLLECTION).find({ DEPARTMENTID: id }).toArray()
                .then(response => {
                    resolve(response);
                })
        })
    },
    getBatchByCoursesId: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BATCHES_COLLECTION).find({ COURSEID: id }).toArray()
                .then(response => {
                    resolve(response);
                })
        })
    },
    getDeptAndCourseAndBatchByBatchId: (batchId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BATCHES_COLLECTION)
                .aggregate([
                    {
                        '$match': {
                            'ID': parseInt(batchId)
                        }
                    }, {
                        '$lookup': {
                            'from': 'courses',
                            'localField': 'COURSEID',
                            'foreignField': 'ID',
                            'as': 'course'
                        }
                    }, {
                        '$unwind': {
                            'path': '$course'
                        }
                    }, {
                        '$lookup': {
                            'from': 'departments',
                            'localField': 'course.DEPARTMENTID',
                            'foreignField': 'ID',
                            'as': 'department'
                        }
                    }, {
                        '$unwind': {
                            'path': '$department'
                        }
                    }
                ]).toArray().then(response => {
                    resolve(response)
                })
        })
    },
    getGenderNameByGenderId: (genderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GENDER_COLLECTION)
                .findOne({ ID: parseInt(genderId) }).then(response => {
                    resolve(response.genderName)
                })
        })
    },
    filterScholarship: (user) => {
        let eligibleList = []

        return new Promise((resolve, reject) => {
            db.get().collection(collection.SCHOLARSHIP_COLLECTION).find()
                .toArray().then(async response => {
                    for (x in response) {
                        let isEligible = await Helper.checkEligibility(response[x], user)
                        if (isEligible.status)
                            eligibleList.push(response[x])
                    }
                    resolve(eligibleList)
                })
        })
    },
    applicationStatus: (scholarshipId, user) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.SCHOLARSHIP_COLLECTION).findOne({ ID: scholarshipId })
                .then(scholarship => {
                    Helper.checkEligibility(scholarship, user).then(isEligible => {
                        if (isEligible.status) {
                            Helper.findCurrentAcademicYear().then(academicYear => {
                                Helper.getScholarshipStatus(scholarshipId, academicYear.id)
                                    .then((scholarshipList) => {
                                        Helper.getApplicationStatus(scholarshipList.id, user._id)
                                            .then(applicationStatus => {
                                                resolve(
                                                    {
                                                        statusId: applicationStatus.statusId,
                                                        scholarshipListId: scholarshipList.id,
                                                    })
                                            })
                                    }).catch((response) => {
                                        //need to write code
                                        //reject({statusId:-2,message:"Submission not yet Started"})
                                        //reject({statusId:-3,message:"Submission Ended"})
                                        resolve({ statusId: -2 })
                                    })
                            }).catch((response) => {
                                resolve({ statusId: -2 })
                            })
                        } else {
                            resolve({ statusId: -4 })
                        }
                    })
                })
        })
    },
    getscholarshipListByscholarshipListId: (scholarshipListId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.SCHOLARSHIP_LIST_COLLECTION)
                .findOne({ ID: parseInt(scholarshipListId) }).then(response => {
                    if (response == null) {
                        reject("Unauthorized Operaton")
                    } else {
                        resolve(response)
                    }
                })
        })
    },
    getFalimyMembers: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FAMILY_MEMBERS_COLLECTION)
                .find({ userId: ObjectId(userId) }).toArray().then(response => {
                    resolve(response)
                })
        })
    },
    addFalimyMembers: (data, userId) => {
        return new Promise((resolve, reject) => {
            data.userId = ObjectId(userId)
            db.get().collection(collection.FAMILY_MEMBERS_COLLECTION)
                .insertOne(data).then(() => {
                    resolve()
                })
        })
    },
    deleteFamilyMember: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FAMILY_MEMBERS_COLLECTION)
                .deleteOne({ _id: ObjectId(id) }).then(() => {
                    resolve()
                })
        })
    },
    storeScholarshipFrom: (data, scholarship, user) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION).findOneAndUpdate(
                {
                    userId: ObjectId(user._id),
                    applicationNo: scholarship.scholarshipCode + user.mobile
                },
                {
                    "$set": {
                        applicationNo: scholarship.scholarshipCode + user.mobile,
                        userId: ObjectId(user._id),
                        applicationStatus: parseInt(data.applicationStatus),
                        scholarshipListId: parseInt(data.scholarshipListId)
                    }
                },
                {
                    upsert: true
                }).then(response => {
                    let _id = ObjectId((response.value === null) ? response.lastErrorObject.upserted : response.value._id)
                    let storePersonalDetails = new Promise((resolve, reject) => {
                        db.get().collection(collection.APPLICATION_PERSONAL_DETAILS_COLLECTION)
                            .updateOne(
                                {
                                    _id: _id
                                },
                                {
                                    "$set": {
                                        _id: _id,
                                        annualIncome: parseInt(data.annualIncome),
                                        partTimeJob: (data.partTimeJob == 1),
                                        partTimeJobName: data.partTimeJobName,
                                        pAddress: data.pAddress,
                                        cAddress: data.cAddress,
                                    }
                                },
                                {
                                    upsert: true
                                }).then(
                                    resolve()
                                )
                    })
                    let storeContactDetails = new Promise(async (resolve, reject) => {
                        db.get().collection(collection.APPLICATION_CONTACT_DETAILS_COLLECTION)
                            .updateOne(
                                {
                                    _id: _id
                                },
                                {
                                    "$set": {
                                        _id: _id,
                                        state: data.state,
                                        district: await Helper.getDistrictById(data.district),
                                        districtId: parseInt(data.district),
                                        panchayath: data.panchayath,
                                        taluk: data.taluk,
                                        wardNo: parseInt(data.wardNo),
                                        wardMemberName: data.wardMemberName,
                                        wardMemberMobile: parseInt(data.wardMemberMobile),
                                    }
                                },
                                {
                                    upsert: true
                                }).then(
                                    resolve()
                                )
                    })
                    let storeAcademicDetails = new Promise((resolve, reject) => {
                        db.get().collection(collection.APPLICATION_ACADEMIC_DETAILS_COLLECTION)
                            .updateOne(
                                {
                                    _id: _id
                                },
                                {
                                    "$set": {
                                        _id: _id,
                                        plusTwo: data.plusTwo,
                                        previousSem: data.previousSem,
                                        isHosteler: (data.isHosteler == 1),
                                        competitiveExam: (data.competitiveExam == 1),
                                        competitiveExamName: data.competitiveExamName,
                                    }
                                },
                                {
                                    upsert: true
                                }).then(
                                    resolve()
                                )
                    })
                    Promise.all([storePersonalDetails, storeContactDetails, storeAcademicDetails])
                        .then((response) => {
                            resolve()
                        })
                })
        })
    },
    getApplicationDetails: (scholarshipListId, userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION).findOne({
                userId: ObjectId(userId),
                scholarshipListId: parseInt(scholarshipListId)
            }).then(application_details => {
                if (application_details) {
                    let personal_details = new Promise((resolve, reject) => {
                        db.get().collection(collection.APPLICATION_PERSONAL_DETAILS_COLLECTION)
                            .findOne({ _id: ObjectId(application_details._id) }).then(response => {
                                resolve(response)
                            })
                    });
                    let academic_details = new Promise((resolve, reject) => {
                        db.get().collection(collection.APPLICATION_ACADEMIC_DETAILS_COLLECTION)
                            .findOne({ _id: ObjectId(application_details._id) }).then(response => {
                                resolve(response)
                            })
                    });
                    let contact_details = new Promise((resolve, reject) => {
                        db.get().collection(collection.APPLICATION_CONTACT_DETAILS_COLLECTION)
                            .findOne({ _id: ObjectId(application_details._id) }).then(response => {
                                resolve(response)
                            })
                    });
                    Promise.all([personal_details, academic_details, contact_details])
                        .then(allDetails => {
                            allDetails.push(application_details)
                            resolve(allDetails)
                        })
                } else {
                    resolve()
                }
            })
        })
    },
    getBankDetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANK_DETAILS_COLLECTION)
                .findOne({ _id: ObjectId(userId) }).then(response => {
                    resolve(response)
                })
        })
    },
    saveBankDetails: (data, userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANK_DETAILS_COLLECTION)
                .insertOne({
                    _id: ObjectId(userId),
                    accountHolderName: data.accountHolderName,
                    accountNo: data.accountNo1,
                    bankName: data.bankName,
                    ifsc: data.ifsc,
                    branch: data.branch
                }).then(response => {
                    resolve()
                })
        })
    },
    //need
    updatePassword: (user, passData) => {
        return new Promise(async (resolve, reject) => {
            if (bcrypt.compare(passData.currentPassword, user.password)) {
                if (passData.newPassword === passData.confirmNewPassword) {
                    passData.currentPassword = await bcrypt.hash(passData.newPassword, 10)
                    db.get().collection(collection.USER_COLLECTION).updateOne({ username: user.username }, { "$set": { password: passData.currentPassword } }).then(() => {
                        resolve(passData.currentPassword)
                    })
                }
            }
        })
    },
    forgotPassword: (email, url) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ email: email }).then(user => {
                if (user) {
                    let token = crypto.randomBytes(20)
                    token = token.toString('hex')
                    db.get().collection(collection.PASSWORD_FORGOT_COLEECTION)
                        .insertOne({
                            userId: ObjectId(user._id),
                            resetPasswordToken: token,
                            resetPasswordExpires: Date.now() + 900000,
                        })
                        .then(() => {
                            nodeMailer({
                                recipient: user.email,
                                subject: 'Link for Password Reset',
                                message: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                    'https://' + url + '/resetpassword/' + token + '\n\n' +
                                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                            })
                            resolve()
                        }).catch(() => {
                            reject("Error Occuerd Try Again")
                        })
                    resolve()
                } else {
                    reject('User not Found')
                }
            })
        })
    },
    resetPasswordTokenValidate: (token) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PASSWORD_FORGOT_COLEECTION)
                .findOne({ resetPasswordToken: token, resetPasswordExpires: { "$gt": Date.now() } })
                .then(response => {
                    if (response) {
                        resolve()
                    } else {
                        reject()
                    }
                })
        })
    },
    resetPassword: (token, password) => {
        return new Promise(async (resolve, reject) => {
            password = await bcrypt.hash(password, 10)
            db.get().collection(collection.PASSWORD_FORGOT_COLEECTION)
                .findOne({ resetPasswordToken: token, resetPasswordExpires: { "$gt": Date.now() } })
                .then(response => {
                    if (response) {
                        db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(response.userId) }, { "$set": { password: password } })
                            .then(() => {
                                db.get().collection(collection.PASSWORD_FORGOT_COLEECTION).updateOne(
                                    {
                                        _id:ObjectId(response._id)
                                    },
                                    {
                                        "$set": {
                                            resetPasswordExpires: Date.now()
                                        }
                                    }).then(() => {
                                        resolve()
                                    })
                            })
                    } else {
                        reject()
                    }
                }).catch(() => {
                })
        })
    },
}

module.exports.getNewId = () => {
    return new Promise(async (resolve, reject) => {
        let doc = await db.get().collection(collection.ID_GENERATOR).findOneAndUpdate({ _id: "id" }, { "$inc": { seq: 1 } })
        resolve(doc.value.seq)
    })
}
