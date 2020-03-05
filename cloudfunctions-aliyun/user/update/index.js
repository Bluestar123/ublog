const db = uniCloud.database()

exports.update = async (data) => {
	const collection = db.collection('user')
	// const res = await collection.add(event)
	return collection
}