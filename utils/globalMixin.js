import store from '../store/index.js'

export const globalMixin = {
	computed: {
		lang() {
			return store.state.lang
		},
		themeColor() {
			return store.state.themeColor
		}
	},
	onLoad() {
		uni.setNavigationBarColor({
			backgroundColor:store.state.themeColor.color
		})
	},
	watch: {
		themeColor (val) {
			// 设置导航栏
			uni.setNavigationBarColor({
				frontColor: '',
				backgroundColor: val,
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
			
			// 设置tabbar
			uni.setTabBarItem({
				index: 0,
				text: '',
				iconPath: '',
				selectedIconPath: ''
			})
		}
	}
}