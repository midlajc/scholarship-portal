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
    getApplicantList: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION).aggregate([
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
    getSubmittedApplications: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .aggregate([
                    {
                        "$match": {
                            "applicationStatus": parseInt(2)
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
    getVerifiedApplications: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .aggregate([
                    {
                        "$match": {
                            "applicationStatus": parseInt(3)
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
    getApprovedApplications: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .aggregate([
                    {
                        "$match": {
                            "applicationStatus": parseInt(4)
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
    getRejectedApplications: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .aggregate([
                    {
                        "$match": {
                            "applicationStatus": parseInt(-1)
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
            ]).toArray().then(data => {
                resolve(data[0])
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
    //need
    getApplicationData: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .find().toArray().then(response => {
                    resolve(response)
                })
        })
    },
    getSingleApplication: (email) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION).findOne({ email: email }).then(response => {
                let data = {
                    name: response.name,
                    email: response.email,
                    phoneno: response.phoneno,
                    gender: response.gender,
                    college: response.college,
                    items: response.items,
                    emailVerificationStatus: response.emailVerificationStatus,
                    submissionTime: response.submissionTime
                }
                resolve(data)
            })
        })
    },
    getPendingData: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPICATION_COLLECTION).find({ applicationStatus: false, emailVerificationStatus: true }).toArray().then(response => {
                resolve(response)
            })
        })
    },
    // getVerifiedApplication: () => {
    //     return new Promise((resolve, reject) => {
    //         db.get().collection(collection.APPICATION_COLLECTION).find({ applicationStatus: true }).toArray().then(response => {
    //             resolve(response)
    //         })
    //     })
    // },
    getEmailVerificationPending: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPICATION_COLLECTION).find({ emailVerificationStatus: false }).toArray().then(response => {
                resolve(response)
            })
        })
    },
    resendVerificationEmail: (email, url) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPICATION_COLLECTION).findOne({ email: email }).then(data => {
                nodeMailer({
                    recipient: data.email,
                    subject: "TEZLA Registration",
                    message: "Application Submitted Successfully\n\nclick this link for email verification " +
                        'https://' + url + '/verifyemail/' + data.emailVerificationToken + '\n\n'
                })
                resolve('Email has been Sended')
            })
        })
    },
    getParticipantsData: (item) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.ITQUIZ_COLLECTION).aggregate([{
                '$lookup': {
                    'from': 'user',
                    'localField': 'username',
                    'foreignField': 'username',
                    'as': 'data'
                }
            }, {
                '$unwind': {
                    'path': '$data'
                }
            }, {
                '$project': {
                    'name': '$data.name',
                    'username': '$username',
                    'email': '$data.email',
                    'phoneno': '$data.phoneno'
                }
            }]).toArray()
            resolve(data)
        })
    },
    getItemStatus: (item) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ITEM_CONTROLLER).findOne({ item: item }).then(response => {
                if (response) {
                    if (response.status) {
                        if (response.endTime > Date.now())
                            resolve({ status: true, message: 'ongoing' })
                        else
                            resolve({ status: true, message: 'ended' })
                    } else {
                        resolve({ status: false, message: "not started" })
                    }
                } else {
                    db.get().collection(collection.ITEM_CONTROLLER).insertOne({
                        item: item,
                        status: false
                    }).then(() => {
                        resolve({ status: false, message: "not started" })
                    })
                }
            })
        })
    },
    startItQuiz: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ITEM_CONTROLLER).updateOne({ item: 'itquiz' }, {
                '$set': {
                    status: true,
                    endTime: Date.now() + 3600000
                }
            }).then(() => {
                resolve("started")
            })
        })
    },
    addItQuizQustion: (qData) => {
        return new Promise((resolve, reject) => {
            qData.answer = qData.options[qData.answer]
            db.get().collection(collection.QUIZ_BANK).insertOne(qData).then(() => {
                resolve()
            })
        })
    },
    getAllQuestions: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.QUIZ_BANK).find().toArray().then(response => {
                resolve(response)
            })
        })
    }
}

//to generate unique qustion id
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