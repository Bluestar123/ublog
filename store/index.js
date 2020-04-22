import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules'

Vue.use(Vuex);

// 国际化相关代码
let lang
try {
	// 1. 是否有本地缓存语言
	let userLang = uni.getStorageSync("userLang");
	// 2. 没有用户设置，取系统语言
	if(!userLang){
		const sys = uni.getSystemInfoSync();
		userLang = sys.language;
	}
	console.log('系统语言：', userLang);
	// 根据语言读取文件
	if(userLang.substring(0,2) == 'zh'){
		lang = require('../language/zh.js');
	}else{
		lang = require('../language/en.js');
	}
} catch (e) {
    // error
}
const store = new Vuex.Store({
	modules,
	state: {
		lang: lang,
		themeColor: {
			title: '嫣红',
			name: 'red',
			color: '#e54d42'
		},
		errorMsg: '系统故障请稍后重试'
	},
	mutations: {
		changeLang: function(state){
			uni.showActionSheet({
				itemList:['简体中文', 'English'],
				success (e) {
					if(e.tapIndex == 0){
						lang = require('../language/zh.js')
					}else{
						lang = require('../language/en.js')
					}
					uni.setStorageSync("userLang", lang.langType)
					state.lang = lang;
					// 改tabbar
					uni.setTabBarItem({
						index:0,
						text: lang.home_stories
					})
					uni.setTabBarItem({
						index:3,
						text: lang.my
					})
				}
			})
		},
		setThemeColor(state, val) {
			state.themeColor = val
		}
	}
})
export default store;