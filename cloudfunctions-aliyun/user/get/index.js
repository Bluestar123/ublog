const db = uniCloud.database()
const util = require('../utils/index.js')
exports.get = async (data) => {
	const collection = db.collection('user')
	let user
	
	if (data.openid) {
		user = await collection.where({
			openid: data.openid
		}).get()
		
		if (user.affectedDocs < 1) {
			// 没有就新增
			await collection.add({
				openid: data.openid
			})
		}
		
		return {
			code: global.successCode,
			msg: global.successMsg
		}
	} else {
		user = await collection.where({
			username: data.username,
			password: util.sha1(data.password)
		}).get()
		
		if (user.affectedDocs < 1) {
			return {
				code: global.wrongCode,
				msg: '用户名或密码错误'
			}
		} else {
			return {
				code: global.successCode,
				msg: global.successMsg
			}
		}
	}
}