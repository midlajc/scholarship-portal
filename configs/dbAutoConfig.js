let generateUserId = () => {
    db.get().collection(collection.ID_GENERATOR).findOne({_id:"id"}).then((response) => {
        if (response == null) {
            db.get().collection(collection.ID_GENERATOR).insertOne({ _id: "id", seq: 1 })
        }
    })
}