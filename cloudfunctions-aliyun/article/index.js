'use strict';
const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
  const collection = db.collection('article')
  // 总条数
  let total = await collection.where({categoryId : event.categoryId}).count()
  
  // 获取文章列表
  let start = event.currentPage * event.pageSize
  let res = await collection.where({categoryId : event.categoryId}).orderBy('date','desc').skip(start).limit(event.pageSize).get();
  return {
	  total: total.total,
	  list: res.data
  }
};
