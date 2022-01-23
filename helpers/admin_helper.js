var db = require('../configs/connection')
var bcrypt = require('bcrypt')
var collection = require('../configs/collection')
var userHelper = require('./user_helper')
var nodeMailer = require('./nodeMailer')
const { ObjectID } = require('mongodb')
const Helper = require('./Helper')
const { resolve, reject } = require('promise')

module.exports = {
    userRegistration: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            data.paymentStatus = "PAID"
            db.get().collection(collection.USER_COLLECTION).insertOne(data)
            resolve()
        })
    },
    getAdminByUserName: (username, callback) => {
        db.get().collection(collection.ADMIN_COLLECTION).findOne({ username: username }).then((response) => {
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
        db.get().collection(collection.ADMIN_COLLECTION).findOne({ _id: ObjectID(id) }).then((response) => {
            callback(null, response)
        }).catch((response) => {
            callback(response, null)
        })
    },
    getApplicantList: (scholarshipListId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION).aggregate([
                {
                    "$match": {
                        'scholarshipListId': parseInt(scholarshipListId)
                    }
                },
                {
                    '$lookup': {
                        'from': 'user',
                        'localField': 'userId',
                        'foreignField': '_id',
                        'as': 'user'
                    }
                }, {
                    '$unwind': {
                        'path': '$user'
                    }
                }, {
                    '$lookup': {
                        'from': 'batches',
                        'localField': 'user.batchId',
                        'foreignField': 'ID',
                        'as': 'batch'
                    }
                }, {
                    '$lookup': {
                        'from': 'courses',
                        'localField': 'batch.COURSEID',
                        'foreignField': 'ID',
                        'as': 'course'
                    }
                }, {
                    '$unwind': {
                        'path': '$batch'
                    }
                }, {
                    '$unwind': {
                        'path': '$course'
                    }
                }
            ]).toArray().then(response => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getSubmittedApplications: (scholarshipListId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .aggregate([
                    {
                        "$match": {
                            "applicationStatus": parseInt(2),
                            'scholarshipListId': parseInt(scholarshipListId)
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'user',
                            'localField': 'userId',
                            'foreignField': '_id',
                            'as': 'user'
                        }
                    }, {
                        '$unwind': {
                            'path': '$user'
                        }
                    }, {
                        '$lookup': {
                            'from': 'batches',
                            'localField': 'user.batchId',
                            'foreignField': 'ID',
                            'as': 'batch'
                        }
                    }, {
                        '$lookup': {
                            'from': 'courses',
                            'localField': 'batch.COURSEID',
                            'foreignField': 'ID',
                            'as': 'course'
                        }
                    }, {
                        '$unwind': {
                            'path': '$batch'
                        }
                    }, {
                        '$unwind': {
                            'path': '$course'
                        }
                    }
                ]).toArray().then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
        })
    },
    getVerifiedApplications: (scholarshipListId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .aggregate([
                    {
                        "$match": {
                            "applicationStatus": parseInt(3),
                            'scholarshipListId': parseInt(scholarshipListId)
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'user',
                            'localField': 'userId',
                            'foreignField': '_id',
                            'as': 'user'
                        }
                    }, {
                        '$unwind': {
                            'path': '$user'
                        }
                    }, {
                        '$lookup': {
                            'from': 'batches',
                            'localField': 'user.batchId',
                            'foreignField': 'ID',
                            'as': 'batch'
                        }
                    }, {
                        '$lookup': {
                            'from': 'courses',
                            'localField': 'batch.COURSEID',
                            'foreignField': 'ID',
                            'as': 'course'
                        }
                    }, {
                        '$unwind': {
                            'path': '$batch'
                        }
                    }, {
                        '$unwind': {
                            'path': '$course'
                        }
                    }
                ]).toArray().then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
        })
    },
    getApprovedApplications: (scholarshipListId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .aggregate([
                    {
                        "$match": {
                            "applicationStatus": parseInt(4),
                            'scholarshipListId': parseInt(scholarshipListId)
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'user',
                            'localField': 'userId',
                            'foreignField': '_id',
                            'as': 'user'
                        }
                    }, {
                        '$unwind': {
                            'path': '$user'
                        }
                    }, {
                        '$lookup': {
                            'from': 'batches',
                            'localField': 'user.batchId',
                            'foreignField': 'ID',
                            'as': 'batch'
                        }
                    }, {
                        '$lookup': {
                            'from': 'courses',
                            'localField': 'batch.COURSEID',
                            'foreignField': 'ID',
                            'as': 'course'
                        }
                    }, {
                        '$unwind': {
                            'path': '$batch'
                        }
                    }, {
                        '$unwind': {
                            'path': '$course'
                        }
                    }
                ]).toArray().then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
        })
    },
    getRejectedApplications: (scholarshipListId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .aggregate([
                    {
                        "$match": {
                            "applicationStatus": parseInt(-1),
                            'scholarshipListId': parseInt(scholarshipListId)
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'user',
                            'localField': 'userId',
                            'foreignField': '_id',
                            'as': 'user'
                        }
                    }, {
                        '$unwind': {
                            'path': '$user'
                        }
                    }, {
                        '$lookup': {
                            'from': 'batches',
                            'localField': 'user.batchId',
                            'foreignField': 'ID',
                            'as': 'batch'
                        }
                    }, {
                        '$lookup': {
                            'from': 'courses',
                            'localField': 'batch.COURSEID',
                            'foreignField': 'ID',
                            'as': 'course'
                        }
                    }, {
                        '$unwind': {
                            'path': '$batch'
                        }
                    }, {
                        '$unwind': {
                            'path': '$course'
                        }
                    }
                ]).toArray().then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
        })
    },
    getApplicationByApplicationNo: (applicationNo) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION).aggregate([
                {
                    "$match": {
                        "applicationNo": applicationNo
                    }
                },
                {
                    '$lookup': {
                        'from': 'user',
                        'localField': 'userId',
                        'foreignField': '_id',
                        'as': 'user'
                    }
                }, {
                    '$unwind': {
                        'path': '$user'
                    }
                }, {
                    '$lookup': {
                        'from': 'batches',
                        'localField': 'user.batchId',
                        'foreignField': 'ID',
                        'as': 'batch'
                    }
                },
                {
                    '$lookup': {
                        'from': 'courses',
                        'localField': 'batch.COURSEID',
                        'foreignField': 'ID',
                        'as': 'course'
                    }
                },
                {
                    '$lookup': {
                        'from': 'application_academic_details',
                        'localField': '_id',
                        'foreignField': 'applicationId',
                        'as': 'academic'
                    }
                },
                {
                    '$lookup': {
                        'from': 'application_personal_details',
                        'localField': '_id',
                        'foreignField': 'applicationId',
                        'as': 'personal'
                    }
                },
                {
                    '$lookup': {
                        'from': 'application_contact_details',
                        'localField': '_id',
                        'foreignField': 'applicationId',
                        'as': 'contact'
                    }
                },
                {
                    '$unwind': {
                        'path': '$batch'
                    }
                }, {
                    '$unwind': {
                        'path': '$course'
                    }
                },
                {
                    '$lookup': {
                        'from': 'departments',
                        'localField': 'course.DEPARTMENTID',
                        'foreignField': 'ID',
                        'as': 'department'
                    }
                },
                {
                    '$unwind': {
                        'path': '$academic'
                    }
                }, {
                    '$unwind': {
                        'path': '$personal'
                    }
                },
                {
                    '$unwind': {
                        'path': '$contact'
                    }
                },
                {
                    '$unwind': {
                        'path': '$department'
                    }
                },
                {
                    '$lookup': {
                        'from': 'family_members',
                        'localField': 'user._id',
                        'foreignField': 'userId',
                        'as': 'family_members'
                    }
                },
                {
                    '$lookup': {
                        'from': 'bank_details',
                        'localField': 'user._id',
                        'foreignField': '_id',
                        'as': 'bank_details'
                    }
                },
                {
                    '$unwind': {
                        'path': '$bank_details'
                    }
                },
                {
                    '$lookup': {
                        'from': 'scholarship_list',
                        'localField': 'scholarshipListId',
                        'foreignField': 'ID',
                        'as': 'scholarship'
                    }
                },
                {
                    '$unwind': {
                        'path': '$scholarship'
                    }
                },
                {
                    '$lookup': {
                        'from': 'application_status',
                        'localField': 'applicationStatus',
                        'foreignField': 'id',
                        'as': 'applicationStatus'
                    }
                },
                {
                    '$unwind': {
                        'path': '$applicationStatus'
                    }
                },
                {
                    '$lookup': {
                        'from': 'gender',
                        'localField': 'user.genderId',
                        'foreignField': 'ID',
                        'as': 'user.gender'
                    }
                },
                {
                    '$unwind': {
                        'path': '$user.gender'
                    }
                },
            ]).toArray().then(applicationData => {
                let data = {
                    dob:new Date(applicationData[0].user.dob).toLocaleDateString('en-GB'),
                    name: applicationData[0].user.name,
                    applicationNo: applicationData[0].applicationNo,
                    applicationStatus: applicationData[0].applicationStatus.message,
                    email: applicationData[0].user.email,
                    mobile: applicationData[0].user.mobile,
                    gender: applicationData[0].user.gender.genderName,
                    batch: applicationData[0].batch.BATCHNAME,
                    course: applicationData[0].course.COURSENAME,
                    department: applicationData[0].department.DEPARTMENTNAME,
                    competitiveExam: applicationData[0].academic.competitiveExam,
                    competitiveExamName: applicationData[0].academic.competitiveExamName,
                    isHostler: applicationData[0].academic.isHostler,
                    plusTwo: applicationData[0].academic.plusTwo,
                    otherScholarship: applicationData[0].academic.otherScholarship,
                    otherScholarshipName: applicationData[0].academic.scholarshipName,
                    previousSem: applicationData[0].academic.previousSem,
                    annualIncome: applicationData[0].personal.annualIncome,
                    cAddress: applicationData[0].personal.cAddress,
                    pAddress: applicationData[0].personal.pAddress,
                    partTimeJob: applicationData[0].personal.partTimeJob,
                    partTimeJobName: applicationData[0].personal.partTimeJobName,
                    district: applicationData[0].contact.district,
                    panchayath: applicationData[0].contact.panchayath,
                    state: applicationData[0].contact.state,
                    taluk: applicationData[0].contact.taluk,
                    wardMemberMobile: applicationData[0].contact.wardMemberMobile,
                    wardMemberName: applicationData[0].contact.wardMemberName,
                    wardNo: applicationData[0].contact.wardNo,
                    family_members: applicationData[0].family_members,
                    accountHolderName: applicationData[0].bank_details.accountHolderName,
                    accountNo: applicationData[0].bank_details.accountNo,
                    bankName: applicationData[0].bank_details.bankName,
                    ifsc: applicationData[0].bank_details.ifsc,
                    branch: applicationData[0].bank_details.branch,
                    scholarshipName: applicationData[0].scholarship.scholarshipName
                }
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    verifyApplication: (applicationNo) => {
        return new Promise(async (resolve, reject) => {
            Promise.all([Helper.updateApplicationStatus(applicationNo, 3)]).then(() => {
                resolve()
            }).catch(err => {
                reject(err)
            })
            // function sendVerificationEmail() {
            //     return new Promise((resolve, reject) => {
            //         nodeMailer({
            //             recipient: email,
            //             subject: 'Application Approved',
            //             message: "Application Approved\nUser Name:" + username + "\n Thank You For Registration"
            //         }).then(() => {
            //             resolve()
            //         })
            //     })
            // }
        })
    },
    rejectApplication: (applicationNo) => {
        return new Promise((resolve, reject) => {
            Promise.all([Helper.updateApplicationStatus(applicationNo, -1)]).then(() => {
                resolve()
            }).catch(err => {
                reject(err)
            })
            // function sendRejectEmail() {
            //     return new Promise((resolve, reject) => {
            //         nodeMailer({
            //             recipient: email,
            //             subject: 'Application Approved',
            //             message: "Application Approved\nUser Name:" + username + "\n Thank You For Registration"
            //         }).then(() => {
            //             resolve()
            //         })
            //     })
            // }
        })
    },
    approveApplication: (applicationNo) => {
        return new Promise((resolve, reject) => {
            Promise.all([Helper.updateApplicationStatus(applicationNo, 4)]).then(() => {
                resolve()
            }).catch(err => {
                reject(err)
            })
            // function sendApprovalEmail() {
            //     return new Promise((resolve, reject) => {
            //         nodeMailer({
            //             recipient: email,
            //             subject: 'Application Approved',
            //             message: "Application Approved\nUser Name:" + username + "\n Thank You For Registration"
            //         }).then(() => {
            //             resolve()
            //         })
            //     })
            // }
        })
    },
    fetchRegistrationList: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.REGISTRATION_COLLECTION).aggregate(
                [
                    {
                        '$match': {
                            'emailVerificationStatus': false
                        }
                    }, {
                        '$lookup': {
                            'from': 'batches',
                            'localField': 'batchId',
                            'foreignField': 'ID',
                            'as': 'batch'
                        }
                    }, {
                        '$unwind': {
                            'path': '$batch'
                        }
                    }, {
                        '$lookup': {
                            'from': 'courses',
                            'localField': 'batch.COURSEID',
                            'foreignField': 'ID',
                            'as': 'course'
                        }
                    }, {
                        '$unwind': {
                            'path': '$course'
                        }
                    }, {
                        '$project': {
                            'batch': '$batch.BATCHNAME',
                            'course': '$course.COURSENAME',
                            'email': 1,
                            'name': 1,
                            'mobile': 1
                        }
                    }
                ]).toArray().then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
        })
    },
    deleteRegistration: (_id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.REGISTRATION_COLLECTION)
                .deleteOne({ _id: ObjectID(_id) }).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
        })
    },
    resendVerificationEmail: (_id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.REGISTRATION_COLLECTION)
                .findOne({ _id: ObjectID(_id) }).then(data => {
                    nodeMailer({
                        recipient: data.email,
                        subject: "Scholarship Registration",
                        message: "Registration Successful\n\nclick this link to verify email" +
                            ' https://' + process.env.domaine + '/verify-email/' + data.emailVerificationToken + '\n\n'
                    }).then(() => {
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                }).catch(err => {
                    reject(err)
                })
        })
    },
    fetchUsersList: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).aggregate(
                [
                    {
                        '$lookup': {
                            'from': 'batches',
                            'localField': 'batchId',
                            'foreignField': 'ID',
                            'as': 'batch'
                        }
                    }, {
                        '$unwind': {
                            'path': '$batch'
                        }
                    }, {
                        '$lookup': {
                            'from': 'courses',
                            'localField': 'batch.COURSEID',
                            'foreignField': 'ID',
                            'as': 'course'
                        }
                    }, {
                        '$unwind': {
                            'path': '$course'
                        }
                    }, {
                        '$project': {
                            'batch': '$batch.BATCHNAME',
                            'course': '$course.COURSENAME',
                            'email': 1,
                            'name': 1,
                            'mobile': 1
                        }
                    }
                ]).toArray().then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
        })
    },
    fetchUsersBanks: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANK_DETAILS_COLLECTION)
                .aggregate([
                    {
                        '$lookup': {
                            'from': 'user',
                            'localField': 'userId',
                            'foreignField': '_id',
                            'as': 'user'
                        }
                    }, {
                        '$unwind': {
                            'path': '$user'
                        }
                    }, {
                        '$lookup': {
                            'from': 'batches',
                            'localField': 'user.batchId',
                            'foreignField': 'ID',
                            'as': 'batch'
                        }
                    }, {
                        '$unwind': {
                            'path': '$batch'
                        }
                    }, {
                        '$lookup': {
                            'from': 'courses',
                            'localField': 'batch.COURSEID',
                            'foreignField': 'ID',
                            'as': 'course'
                        }
                    }, {
                        '$unwind': {
                            'path': '$course'
                        }
                    }, {
                        '$project': {
                            'name': "$user.name",
                            'batch': '$batch.BATCHNAME',
                            'course': '$course.COURSENAME',
                            'mobile': '$user.mobile',
                            'accountHolderName': 1,
                            'accountNo': 1,
                            'branch': 1
                        }
                    }
                ]).toArray().then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
        })
    },
    getScholarships: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.SCHOLARSHIP_COLLECTION)
                .find().toArray().then(scholarships => {
                    resolve(scholarships)
                }).catch(err => {
                    reject(err)
                })
        })
    },
    deleteBank: (_id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANK_DETAILS_COLLECTION)
                .deleteOne({ _id: ObjectID(_id) }).then(() => {
                    resolve()
                }).catch(err => {
                    reject()
                })
        })
    },
    getPendingApplication: (scholarshipListId) => {
        let aggregate = [
            {
                '$lookup': {
                    'from': 'applications',
                    'localField': '_id',
                    'foreignField': 'userId',
                    'as': 'application'
                }
            }, {
                '$set': {
                    'application': {
                        '$filter': {
                            'input': '$application',
                            'as': 'application',
                            'cond': {
                                '$eq': [
                                    '$$application.scholarshipListId', parseInt(scholarshipListId)
                                ]
                            }
                        }
                    }
                }
            }, {
                '$set': {
                    'application': {
                        '$cond': {
                            'if': {
                                '$gt': [
                                    {
                                        '$size': '$application'
                                    }, 0
                                ]
                            },
                            'then': '$application',
                            'else': 0
                        }
                    }
                }
            }, {
                '$unwind': {
                    'path': '$application'
                }
            }, {
                '$match': {
                    '$or': [
                        {
                            'application.applicationStatus': 1
                        }, {
                            'application': 0
                        }
                    ]
                }
            }, {
                '$lookup': {
                    'from': 'batches',
                    'localField': 'batchId',
                    'foreignField': 'ID',
                    'as': 'batch'
                }
            }, {
                '$unwind': {
                    'path': '$batch'
                }
            }, {
                '$lookup': {
                    'from': 'courses',
                    'localField': 'batch.COURSEID',
                    'foreignField': 'ID',
                    'as': 'course'
                }
            }, {
                '$unwind': {
                    'path': '$course'
                }
            }, {
                '$lookup': {
                    'from': 'gender',
                    'localField': 'genderId',
                    'foreignField': 'ID',
                    'as': 'gender'
                }
            }, {
                '$unwind': {
                    'path': '$gender'
                }
            }, {
                '$set': {
                    'applicationStatus': {
                        '$cond': {
                            'if': {
                                '$eq': [
                                    '$application', 0
                                ]
                            },
                            'then': false,
                            'else': true
                        }
                    },
                    'applicationStatusMessage': {
                        '$cond': {
                            'if': {
                                '$eq': [
                                    '$application', 0
                                ]
                            },
                            'then': 'not fonud',
                            'else': 'not submitted'
                        }
                    }
                }
            }, {
                '$project': {
                    'applicationNo': '$application.applicationNo',
                    'name': 1,
                    'mobile': 1,
                    'email': 1,
                    'batch': 1,
                    'genderId': 1,
                    'course': 1,
                    'applicationStatus': 1,
                    'applicationStatusMessage': 1,
                    'gender': 1
                }
            }
        ]
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
                .aggregate(aggregate).toArray().then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
        })
    },
    getScholarshipList: (scholarshipId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.SCHOLARSHIP_LIST_COLLECTION)
                .aggregate([
                    {
                        '$match': {
                            'scholarshipId': parseInt(scholarshipId)
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'academic_year',
                            'localField': 'academicId',
                            'foreignField': 'ID',
                            'as': 'academic_year'
                        }
                    }, {
                        '$unwind': {
                            'path': '$academic_year'
                        }
                    }
                ]).toArray()
                .then(scholarshipList => {
                    for (x in scholarshipList) {
                        let date = new Date(scholarshipList[x].startDate)
                        date = date.toLocaleDateString('en-GB')
                        scholarshipList[x].startDate = date
                        date = new Date(scholarshipList[x].endDate)
                        date = date.toLocaleDateString('en-GB')
                        scholarshipList[x].endDate = date
                    }
                    resolve(scholarshipList)
                }).catch(err => {
                    reject(err)
                })
        })
    }
}

//to generate unique id
module.exports.generateQuestionId = () => {
    db.get().collection(collection.ID_GENERATOR).findOne({ _id: "quiz" }).then((response) => {
        if (response == null) {
            db.get().collection(collection.ID_GENERATOR).insertOne({ _id: "quiz", seq: 1 })
        }
    })
}
module.exports.getNewQuestionId = () => {
    return new Promise(async (resolve, reject) => {
        let doc = await db.get().collection(collection.ID_GENERATOR).findOneAndUpdate({ _id: "quiz" }, { "$inc": { seq: 1 } })
        resolve(doc.value.seq)
    })
}