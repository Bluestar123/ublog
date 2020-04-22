<template>
	<view>
		<cu-custom :bgColor="'bg-'+themeColor.name" :isBack="true" :icon="'sort'">
			<block slot="content">{{lang.my}}</block>
		</cu-custom> 
		
		<!-- <button type="primary" @tap="onSubscribe">订阅消息</button>
		<button type="primary" @tap="onSend">发消息</button> -->
		
		<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="modalName =''">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in themeList" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub flex">
									<view>{{item.title}}</view>
									<view :style="{backgroundColor: item.color}" style='height: 50rpx;width: 100rpx;margin-left: 30rpx;'></view>
								</view>
								<radio class="round" :class="radio=='radio' + index?'checked':''" :checked="radio=='radio' + index?true:false"
								 :value="item.name"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		
		<button class="btn" hover-class="navigator-hover" :class="['bg-' + themeColor.name]" @click='changeLang'>切换语言</button>
		<button class="btn" hover-class="navigator-hover" :class="['bg-' + themeColor.name]" @click='changeTheme' data-target="RadioModal">更改主题</button>
	</view>
</template>

<script>
	import {ColorList} from './theme.js'
	export default {
		data() {
			return {
				radio: '',
				modalName: '',
				themeList: []
			}
		},
		methods: {
			changeLang(){
				this.$store.commit('changeLang')
			},
			changeTheme(e){
				this.themeList = []
				for (let i = 0;i<ColorList.length;i++) {
					let random = Math.floor(Math.random() * ColorList.length)
					let item = ColorList[random]
					this.themeList.indexOf(item) === -1 && this.themeList.push(item)
					if (this.themeList.length > 5) break
				}
				this.modalName = e.currentTarget.dataset.target
			},
			RadioChange(e) {
				let name = e.detail.value
				let obj = this.themeList.filter(item => {
					return item.name === name
				})
				this.$store.commit('setThemeColor', obj[0])
				this.modalName = ''
			},
			async onSend() {
				const res = await this.$uniCloud('sendSubscribe')
				console.log(res)
			},
			onSubscribe() {
				let _this = this
				uni.requestSubscribeMessage({
					tmplIds: ['RpMeij0S_6NbJBPgsVySlqxNY0XBTENXuzM3lYnAvuY'],
					success(res) {
						console.log(res)
						if (res.errMsg === 'requestSubscribeMessage:ok') {
							uniCloud.callFunction({
								name: 'subscribe',
								data: {
									data: {test: '我是测试'},
									openId: 'oA7jc4pmxnBbdvOi7xS0_3fdU2xw',
									templatedId: 'RpMeij0S_6NbJBPgsVySlqxNY0XBTENXuzM3lYnAvuY'
								}
							}).then( _ => {
								_this.$toast('订阅成功')
								// uniCloud.callFunction({
								// 	name: 'sendSubscribe'
								// }).then(r => {
								// 	console.log(r)
								// }).catch( e => {
								// 	console.log(e)
								// })
							}).catch(_ => {
								_this.$toast('订阅失败')
							})
						}
					},
					fail() {
						console.log('失败')
					}
				})
			}
		}
	}
</script>

<style>
button{
	margin-top: 20rpx;
}
</style>
