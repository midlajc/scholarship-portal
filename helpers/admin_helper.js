var db = require('../configs/connection')
var bcrypt = require('bcrypt')
var collection = require('../configs/collection')
var userHelper = require('./user_helper')
var nodeMailer = require('./nodeMailer')
const { ObjectID } = require('mongodb')

module.exports = {
    userRegistration: (data) => {
        return new Promise(async(resolve, reject) => {
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
    getApplicationData: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPICATION_COLLECTION).find().toArray().then(response => {
                resolve(response)
            })
        })
    },
    getSingleApplication: (email) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPICATION_COLLECTION).findOne({ email: email }).then(response => {
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
    verifyApplication: (email) => {
        return new Promise(async(resolve, reject) => {
            let id = await userHelper.getNewId()
            let username = "TEZLA" + id;

            function addNewUser(data) {
                return new Promise((resolve, reject) => {
                    db.get().collection(collection.USER_COLLECTION).insertOne({
                        _id: id,
                        username: username,
                        name: data.name,
                        email: data.email,
                        phoneno: data.phoneno,
                        password: data.password,
                        items: data.items,
                        type: 'user'
                    }).then(() => {
                        resolve()
                    })
                })
            }

            function updateApplicationStatus() {
                return new Promise((resolve, reject) => {
                    db.get().collection(collection.APPICATION_COLLECTION).updateOne({ email: email }, { "$set": { "applicationStatus": true } }).then(() => {
                        resolve()
                    })
                })
            }

            function sendApprovalEmail() {
                return new Promise((resolve, reject) => {
                    nodeMailer({
                        recipient: email,
                        subject: 'Application Approved',
                        message: "Application Approved\nUser Name:" + username + "\n Thank You For Registration"
                    }).then(() => {
                        resolve()
                    })
                })
            }
            db.get().collection(collection.APPICATION_COLLECTION).findOne({ email: email }).then(response => {
                Promise.all([addNewUser(response), updateApplicationStatus(), sendApprovalEmail()]).then(() => {
                    resolve()
                })
            })
        })
    },
    getVerifiedApplication: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPICATION_COLLECTION).find({ applicationStatus: true }).toArray().then(response => {
                resolve(response)
            })
        })
    },
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
        return new Promise(async(resolve, reject) => {
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
    addItQuizQustion:(qData)=>{
        return new Promise((resolve,reject)=>{
            qData.answer=qData.options[qData.answer]
            db.get().collection(collection.QUIZ_BANK).insertOne(qData).then(()=>{
                resolve()
            })
        })
    },
    getAllQuestions:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.QUIZ_BANK).find().toArray().then(response=>{
                resolve(response)
            })
        })
    }
}

//to generate unique qustion id
module.exports.generateQuestionId = () => {
    db.get().collection(collection.ID_GENERATOR).findOne({_id:"quiz"}).then((response) => {
        if (response == null) {
            db.get().collection(collection.ID_GENERATOR).insertOne({ _id: "quiz", seq: 1 })
        }
    })
}
module.exports.getNewQuestionId = () => {
    return new Promise(async(resolve, reject) => {
        let doc = await db.get().collection(collection.ID_GENERATOR).findOneAndUpdate({ _id: "quiz" }, { "$inc": { seq: 1 } })
        resolve(doc.value.seq)
    })
}