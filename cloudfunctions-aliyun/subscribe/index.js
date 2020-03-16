'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
      // 在云开发数据库中存储用户订阅的课程
      const result = await db.collection('messages').add({
		  touser: event.openId, // 订阅者的openid
		  page: 'stories', // 订阅消息卡片点击后会打开小程序的哪个页面
		  data: event.data, // 订阅消息的数据
		  templateId: event.templateId, // 订阅消息模板ID
		  done: false, // 消息发送状态设置为 false
      });
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
};
