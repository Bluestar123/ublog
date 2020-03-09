const db = uniCloud.database()
exports.get = async (data) => {
	const collection = db.collection('article_category')
	
	return await collection.get()
}