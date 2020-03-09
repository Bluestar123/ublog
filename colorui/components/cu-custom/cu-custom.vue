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
				
				<view class="cu-list w-100 menu">
					<view class="cu-item arrow" @tap='handleNav(item)' v-for="(item, index) in navList" :key='index' hover-class="hover-class">
						<view class="content">
							<text class="text-grey" :class="['cuIcon-' + item.icon]"></text>
							<text class="text-grey">{{item.navName}}</text>
						</view>
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
				leftDrawer: false
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
			},
			navList() {
				let arr =  [
					{
						icon: 'friend',
						navName: this.lang.drawer_friends
					},{
						icon: 'search',
						navName: this.lang.drawer_search
					},{
						icon: 'writefill',
						navName: this.lang.drawer_feed
					},{
						icon: 'settings',
						navName: this.lang.drawer_settings
					}
				]
				return arr
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
		methods: {
			handleNav () {
				console.log(123)
			},
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
	// .cu-item {
	// 	border-bottom: 1rpx solid #ccc;
	// }
}
</style>
