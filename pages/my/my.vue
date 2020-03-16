<template>
	<view>
		<cu-custom :bgColor="'bg-'+themeColor.name" :isBack="true" :icon="'sort'">
			<block slot="content">{{lang.home_stories}}</block>
		</cu-custom> 
		
		<button type="primary" @tap="onSubscribe">订阅消息</button>
		<button type="primary" @tap="onSend">发消息</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
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

</style>
