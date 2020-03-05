'use strict';
const { config } = require('./wechat_config.js')

exports.main = async (event, context) => {
	const apiUrl = 'https://api.weixin.qq.com/sns/jscode2session';
	const res = await uniCloud.httpclient.request(apiUrl,
				{			
					method: 'GET',
					dataType:"json",
					data: {
						'grant_type' : 'authorization_code',
						'appid'	  : config.appid,
						'secret'  : config.secret,
						'js_code' : event.js_code
					}
				});
	//返回数据给客户端
	return res
};