const db = require('../configs/connection')
const collection = require('../configs/collection')
const { ObjectId } = require('mongodb')

module.exports = {
  checkEligibility: (criteria, user) => {
    //need to write code
    return new Promise((resolve, reject) => {
      if (user.genderId == 2)
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
        }).catch(err => {
          reject(err)
        })
    })
  },
  getApplication: (scholarshipListId, userEmail) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.APPLICATION_COLLECTION)
        .findOne({ scholarshipListId: scholarshipListId, email: userEmail })
        .then(response => {
          resolve(response)
        }).catch(err => {
          reject(err)
        })
    })
  },
  getDistrictList: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.DISTRICT_COLLECTION).find().toArray()
        .then(response => {
          resolve(response)
        }).catch(err => {
          reject(err)
        })
    })
  },
  getStateList: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.STATE_COLLECTION).find().toArray()
        .then(response => {
          resolve(response);
        }).catch(err => {
          reject(err)
        })
    })
  },
  getPanchayaths: (districtId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.LOCALBODY_COLLECTION).find({ districtId: parseInt(districtId) }).toArray()
        .then(response => {
          resolve(response)
        }).catch(err => {
          reject(err)
        })
    })
  },
  getTaluks: (districtId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.TALUK_COLLECTION).find({ districtId: parseInt(districtId) }).toArray()
        .then(response => {
          resolve(response)
        }).catch(err => {
          reject(err)
        })
    })
  },
  getDistrictById: (districtId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.DISTRICT_COLLECTION)
        .findOne({ id: parseInt(districtId) }).then(response => {
          resolve(response.name)
        }).catch(err => {
          reject(err)
        })
    })
  },
  getApplicationStatusMessage: (statusId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.APPLICATION_STATUS)
        .findOne({ id: statusId }).then(response => {
          resolve(response.message)
        }).catch(err => {
          reject(err)
        })
    })
  },
  getApplicationDetails: (userId, scholarshipListId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.APPLICATION_COLLECTION).aggregate([
        {
          '$match': {
            'userId': ObjectId(userId),
            'scholarshipListId': parseInt(scholarshipListId)
          }
        }, {
          '$lookup': {
            'from': 'user',
            'localField': 'userId',
            'foreignField': '_id',
            'as': 'user'
          }
        }, {
          '$lookup': {
            'from': 'application_personal_details',
            'localField': '_id',
            'foreignField': 'applicationId',
            'as': 'personal'
          }
        }, {
          '$lookup': {
            'from': 'application_academic_details',
            'localField': '_id',
            'foreignField': 'applicationId',
            'as': 'academic'
          }
        }, {
          '$lookup': {
            'from': 'application_contact_details',
            'localField': '_id',
            'foreignField': 'applicationId',
            'as': 'contact'
          }
        }, {
          '$lookup': {
            'from': 'scholarship_list',
            'localField': 'scholarshipListId',
            'foreignField': 'ID',
            'as': 'scholarship'
          }
        }, {
          '$unwind': {
            'path': '$user'
          }
        }, {
          '$unwind': {
            'path': '$personal'
          }
        }, {
          '$unwind': {
            'path': '$academic'
          }
        }, {
          '$unwind': {
            'path': '$contact'
          }
        }, {
          '$unwind': {
            'path': '$scholarship'
          }
        }
      ]).toArray().then(response => {
        resolve(response[0])
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateApplicationStatus: (applicationNo, statusId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.APPLICATION_COLLECTION)
        .updateOne({ applicationNo: applicationNo },
          {
            "$set": {
              "applicationStatus": parseInt(statusId)
            }
          }).then(() => {
            resolve()
          }).catch(err => {
            reject(err)
          })
    })
  },
  getScholarshipCriteria: (scholarshipId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.SCHOLARSHIP_COLLECTION)
        .findOne({ ID: parseInt(scholarshipId) }, { criteria: 1 }).then(response => {
          resolve(response.criteria)
        }).catch(err => {
          reject(err)
        })
    })
  },
  getScholarshipListId: (scholarshipId, academicId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.SCHOLARSHIP_LIST_COLLECTION)
        .findOne({ scholarshipId: parseInt(scholarshipId), academicId: parseInt(academicId) })
        .then(response => {
          resolve(response.ID)
        })
    })
  }
}