const mongoClient = require('mongodb').MongoClient

const state = {
    db: null
}

module.exports.connect = (done) => {
    const url = process.env.dbLink
    const dbname = 'amj-scholarship'

    mongoClient.connect(url, { useUnifiedTopology: true }, (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbname)
        done()
    })
}

module.exports.get = () => {
    return state.db
}