const db = require('../configs/connection')
const collection = require('../configs/collection')
const { ObjectId } = require('mongodb')

module.exports = {
    checkEligibility: (criteria, user) => {
        //need to write code
        return new Promise((resolve, reject) => {
            if (user.genderId == 1)
                resolve({ status: true })
            else
                resolve({ status: false, statusId: -4 })
        })
    },
    findCurrentAcademicYear: () => {
        //need to write code
        //resolve({statusId:1,,id:academicId,acdemicName:"2021-2022"})
        //reject({statusId:-2,message:"Submission not yet Started"})
        return new Promise((resolve, reject) => {
            resolve({ id: 1, acdemicName: "2021-2022" })
            // db.get().collection(collection.ACADEMIC_YEAR_COLLECTION).find().toArray()
            // .then(response=>{
            // })
        })
    },
    getScholarshipStatus: (scholarshipId, academicId) => {
        //need to write code
        //reject({statusId:-2,message:"Submission not yet Started"})
        //reject({statusId:-3,message:"Submission Ended"})
        //resolve({statusId:0,scholarshipListId:1,message:"Live"})
        return new Promise((resolve, reject) => {
            resolve({ id: 2, message: "Live" })
            // db.get().collection(collection.SCHOLARSHIP_LIST_COLLECTION).find().toArray()
            //     .then(response => {
            //     })
        })
    },
    getApplicationStatus: (scholarshipListId, userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .findOne({ scholarshipListId: scholarshipListId, userId: ObjectId(userId) })
                .then(response => {
                    if (response == null)
                        resolve({ statusId: 0 })
                    else
                        resolve({ statusId: response.applicationStatus })
                })
        })
    },
    getApplication: (scholarshipListId, userEmail) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICATION_COLLECTION)
                .findOne({ scholarshipListId: scholarshipListId, email: userEmail })
                .then(response => {
                    resolve(response)
                })
        })
    },
    getDistrictList: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.DISTRICT_COLLECTION).find().toArray()
                .then(response => {
                    resolve(response)
                })
        })
    },
    getStateList: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STATE_COLLECTION).find().toArray()
                .then(response => {
                    resolve(response);
                })
        })
    },
    getPanchayaths: (districtId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.LOCALBODY_COLLECTION).find({ districtId: parseInt(districtId) }).toArray()
                .then(response => {
                    resolve(response)
                })
        })
    },
    getTaluks: (districtId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.TALUK_COLLECTION).find({ districtId: parseInt(districtId) }).toArray()
                .then(response => {
                    resolve(response)
                })
        })
    },
    getDistrictById: (districtId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.DISTRICT_COLLECTION)
                .findOne({ id: parseInt(districtId) }).then(response => {
                    resolve(response.name)
                })
        })
    },
    getApplicationStatusMessage: (statusId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPLICAION_STATUS)
                .findOne({ id: statusId }).then(response => {
                    resolve(response.message)
                })
        })
    }
}