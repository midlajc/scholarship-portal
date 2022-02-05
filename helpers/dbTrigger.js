const db = require('../configs/connection')

module.exports = {
    generateDepartmentId=() => {
        return new Promise(async (resolve, reject) => {
            let doc = await db.get().collection(collection.ID_GENERATOR).findOneAndUpdate({ _id: "id" }, { "$inc": { seq: 1 } })
            resolve(doc.value.seq)
        })
    }
}