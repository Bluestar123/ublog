'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('messages')

	try {
		const messages = await collection.where({done: false}).get()

		const sendPromises = messages.data.map(async message => {
			await uniCloud.callWxOpenApi.subscribeMessage.send({
				touser: message.touser,
				page: message.page,
				data: message.data,
				templatedId: message.templateId
			})
			return db.collection('messages').doc(message._id).update({done: true})
		})
		return Promise.all(sendPromises)
	} catch (err) {
		console.log(err);
		return err;
	}
};
