const db = require('../configs/connection')
const collection = require('../configs/collection')
const { ObjectId } = require('mongodb')
const { resolve, reject } = require('promise')
const { response } = require('express')

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
    const now = Date.now()
    return new Promise((resolve, reject) => {
      db.get().collection(collection.ACADEMIC_YEAR_COLLECTION)
        .findOne({
          "$and": [
            { 'startDate': { '$lte': now } },
            { 'endDate': { '$gte': now } }
          ]
        }).then(response => {
          if (response === null) reject({ statusId: -2 })
          else resolve(response)
        })
    })
  },
  getScholarshipStatus: (scholarshipListId) => {
    return new Promise((resolve, reject) => {
      const now = Date.now()
      db.get().collection(collection.SCHOLARSHIP_LIST_COLLECTION)
        .findOne({
          ID: parseInt(scholarshipListId)
        }).then(response => {
          if (response == null) reject({ statusId: -2 })
          else if (response.startDate > now) reject({ statusId: -2 })
          else if (response.endDate < now) reject({ statusId: -3 })
          else resolve({ statusId: 0 })
        })
    })
  },
  getApplicationStatus: (scholarshipListId, userId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.APPLICATION_COLLECTION)
        .findOne({ scholarshipListId: parseInt(scholarshipListId), userId: ObjectId(userId) })
        .then(response => {
          if (response == null) resolve({ statusId: 0 })
          else resolve({ statusId: response.applicationStatus })
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
        response[0].user.dob = new Date(response[0].user.dob).toLocaleDateString('en-GB')
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
        .findOne({ ID: parseInt(scholarshipId) }).then(response => {
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
          if (response == null) reject()
          else resolve(response.ID)
        })
    })
  },
  getUserForEligibilityCheck: (userId) => {
    return new Promise((resolve, reject) => {
      const aggregate = [
        {
          '$match': {
            '_id': ObjectId(userId)
          }
        },
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
      ]
      db.get().collection(collection.USER_COLLECTION)
        .aggregate(aggregate).toArray().then(response => {
          resolve(response[0])
        }).catch(err => {
          reject(err)
        })
    })
  },
  getScholarship: (scholarshipId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.SCHOLARSHIP_COLLECTION)
        .findOne({ ID: parseInt(scholarshipId) }).then(scholarship => {
          resolve(scholarship)
        }).catch(err => {
          reject(err)
        })
    })
  },
  getDepartment: (departmentId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.DEPARTMENTS_COLLECTION)
        .findOne({ ID: parseInt(departmentId) })
        .then(department => {
          resolve(department)
        }).catch(err => {
          reject(err)
        })
    })
  },
  getCourse: (courseId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.COURSES_COLLECTION)
        .findOne({ ID: parseInt(courseId) })
        .then(course => {
          resolve(course)
        }).catch(err => {
          reject(err)
        })
    })
  }
}