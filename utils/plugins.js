import Vue from 'vue'
import store from '../store';

Vue.prototype.$store = store;

Vue.prototype.$toast = (title, duration = 1500) => uni.showToast({
	icon: 'none',
	title,
	duration
})

Vue.prototype.$router = (url) => uni.navigateTo({
	url: '/pages' + url,
	animationType:"slide-in-left",
	animationDuration: 800
})

Vue.prototype.$switchTab = (url) => uni.switchTab({
	url: '/pages' + url
})

Vue.prototype.$relaunch = (url) => uni.reLaunch({
	url: '/pages' + url
})

Vue.prototype.$uniCloud = async (name, data) => {
	uni.showLoading()
	try{
		let res = await uniCloud.callFunction({
			name,
			data
		})
		return res
	} catch(e) {
		return e
	} finally{
		uni.hideLoading()
	}
	
	
}