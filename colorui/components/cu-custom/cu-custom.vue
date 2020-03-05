<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text :class="'cuIcon-' + icon"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
		
		<tui-drawer mode="left" :visible="leftDrawer" @close="closeDrawer">
			<view class="d-container h-100 flex flex-direction justify-center align-center">
				<view class="cu-avatar xl bg-red round cu-card shadow margin-bottom-xl">
					<!-- 随机头像 http://api.btstu.cn/doc/sjtx.php-->
					<image src="http://api.btstu.cn/sjtx/api.php" class="w-100 h-100"></image>
				</view>
				<view class="cu-list grid col-1">
					<view class="cu-item" v-for="(item,index) in cuIconList" :key="index" v-if="index<gridCol*2">
						<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]"></view>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
		</tui-drawer>
	</view>
</template>

<script>
	import tuiDrawer from "../drawer/drawer"
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				leftDrawer: false,
			};
		},
		name: 'cu-custom',
		components: {
			tuiDrawer
		},
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			icon: {
				type: String,
				default: 'back'
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		onReady() {
			console.log(getCurrentPages(), __wxConfig)
		},
		methods: {
			BackPage() {
				if (this.icon === 'back') {
					if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
						let url = '/' + __wxConfig.pages[0]
						return uni.redirectTo({url})
					}
					uni.navigateBack({
						delta: 1
					});
				} else if (this.icon === 'sort') {
					// 左侧边栏
					this.leftDrawer = true
				}
				
			},
			closeDrawer() {
				this.leftDrawer = false
			}
		}
	}
</script>

<style lang="scss">
.d-container {
	width: 375rpx;
	.cu-avatar{
		&.shadow {
			box-shadow: darkgrey 0px 0px 20px 2px;
		}
	}
}
</style>
