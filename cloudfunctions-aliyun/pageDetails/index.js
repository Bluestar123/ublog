'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
  const collection = db.collection('article_details')
  
  let page = await collection.where({
	  _id: event.id
  }).get()
  if (page.affectedDocs === 0) {
	  return {
		  code: 1,
		  msg: '没有文章信息'
	  }
  }
  return page
};
