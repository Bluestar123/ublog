<template>
	<view class="register">
		<cu-custom :bgColor="'bg-'+themeColor.name" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">注册</block>
		</cu-custom>
		<view class="register-title text-white text-sl text-center">{{lang.login_title}}</view>
		<view class="text-white text-sm text-center">{{lang.create_new_account}}</view>
		<view class="form-wrapper flex flex-direction margin-0-auto">
			<view class="flex flex-direction align-center">
				<view class="register-form-username border-3-white margin-top-xl margin-bottom-xl">
					<input v-model='form.username' class="w-100 h-100 text-center text-df  text-white" type="text" value="" placeholder-class="register-placeholder-class text-white" :placeholder="lang.login_form_username_placeholder" />
				</view>
				<view class="register-form-password border-3-white margin-top-xs margin-bottom-xl padding-left-sm padding-right-sm">
					<input v-model="form.password" class="w-100 h-100 text-center text-df text-white" type="password" value="" placeholder-class="register-placeholder-class text-white" :placeholder="lang.login_form_password_placeholder" />
				</view>
				<view class="register-form-password border-3-white margin-top-xs margin-bottom-xl padding-left-sm padding-right-sm">
					<input v-model="form.confirm_password" class="w-100 h-100 text-center text-df text-white" type="password" value="" placeholder-class="register-placeholder-class text-white" :placeholder="lang.register_form_confirm_password_placeholder" />
					<text v-if='isConfirm' class="text-red wrong-confirm-password animation-fade">{{lang.register_wrong_confirm_password_tips}}</text>
				</view>

				<button type="primary" @tap='register' class="cu-btn register-btn text-xl margin-top-sm" :class="['bg-' + themeColor.name, 'light']">{{lang.register_submit_btn}}</button>
			</view>
			<view class="register-with-wechat text-df margin-top-auto text-white text-center text-btn">
				{{lang.register_policy}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
					confirm_password: ''
				},
				isConfirm: false
			}
		},
		onLoad() {

		},
		watch:{
			'form.confirm_password'(val) {
				if (val && val !== this.form.password) {
					this.isConfirm = true
				} else if (val && val === this.form.password) {
					this.isConfirm = false
				}
			}
		},
		methods: {
			async register() {
				if (!this.form.username || !this.form.password || !this.form.confirm_password) {
					this.$toast('请填写正确信息')
					return
				}
				if (this.form.password !== this.form.confirm_password) {
					this.$toast(this.lang.register_wrong_confirm_password_tips)
					return
				}
				let res = await uniCloud.callFunction({
					name: 'user',
					data: Object.assign({}, this.form, {
						type: 'add'
					})
				})
				if (res.result.code === 0) {
					this.$toast('注册成功')
					// 跳转
					setTimeout(() =>{
						uni.navigateBack()
					}, 1500)
				} else {
					this.$toast(res.result.msg)
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #999;
	}
	.register {
		.register-title {
			padding: 212rpx 0 20rpx 0;
		}

		.form-wrapper {
			.flex-direction {
				height: 660rpx;

				.register-form-username {
					width: 400rpx;
					height: 88rpx;
					border-radius: 44rpx;
				}

				.register-form-password {
					@extend .register-form-username;
					position: relative;
					.wrong-confirm-password{
						position:absolute;
						top: 100%;
						left: 20rpx;
					}
				}

				.register-btn {
					width: 400rpx;
					height: 88rpx;
					border-radius: 44rpx;
				}
			}
		}
	}
</style>
