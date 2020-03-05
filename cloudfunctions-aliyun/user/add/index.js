// 增加人员
const util = require('../utils/index.js')
const db = uniCloud.database()

exports.add = async (data) => {
	const collection = db.collection('user')
	
	let user = await collection.where({
		username: data.username
	}).get()
	
	if (user.affectedDocs < 1) {
		const res = await collection.add({
			username: data.username,
			password: util.sha1(data.password) // 加密
		})
		return {
			code: global.successCode,
			msg: global.successMsg
		}
	} else {
		return {
			code: global.wrongCode,
			msg: '用户名重复，请重新录入'
		}
	}

}