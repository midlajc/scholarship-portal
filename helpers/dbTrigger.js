const db = require('../configs/connection')
const collection = require('../configs/collection')

module.exports = {
    generateDepartmentId: () => {
        return new Promise(async (resolve, reject) => {
            let doc = await db.get().collection(collection.ID_COLLECTION)
                .findOneAndUpdate({ collectionName: collection.DEPARTMENTS_COLLECTION }, { "$inc": { seq: 1 } })
            resolve(doc.value.seq)
        })
    }
}