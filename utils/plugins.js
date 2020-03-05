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