import Vue from 'vue'
import App from './App'

require('./utils/plugins.js')

import cuCustom from './colorui/components/cu-custom/cu-custom.vue'

Vue.component('cu-custom', cuCustom)

Vue.config.productionTip = false
// 全局公用
Vue.mixin({
	computed: {
		lang() {
			return this.$store.state.lang
		},
		themeColor() {
			return this.$store.state.themeColor
		},
		errorMsg() {
			return this.$store.state.errorMsg
		}
	}
})

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
