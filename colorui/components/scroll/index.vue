<template>
	<view class="">
		<view id="success" :class="['success', successShow ? 'success--show' : '', successTran ? 'success--tran' : '']" :style="{ top: hasTop ? refreshSize + 'rpx' : 0, color: color }">
			<view class="info">刷新成功</view>
		</view>

		<movable-area class="movable-area" >
			<movable-view
				class="scroll"
				 :style="{height: `calc(100vh - ${CustomBar}px + 80rpx)`}"
				@change="change"
				@touchend="touchend"
				direction="vertical"
				out-of-bounds
				:disabled="refreshStatus >= 3"
				:y="move"
			>
				<scroll-view
					class="scroll__view"
					:style="{ paddingBottom: bottomSize + 'rpx', paddingTop: hasTop ? refreshSize + 'rpx' : 0 }"
					:scroll-y="refreshStatus == 1"
					@scroll="scroll"
					:scroll-top="scrollTop"
					:lower-threshold="10"
					@scrolltolower="more"
				>
					<!-- rpx可以全端通用，且支持动态绑定，不再需要uni.upx2px方法。 -->
					<view id="refresh" :class="['scroll__refresh', successShow ? 'scroll__refresh--hidden' : '']" :style="{ height: refreshSize + 'rpx', padding: '20rpx 0' }">
						<view class="scroll__loading">
							<view v-if="refreshStatus == 1 || refreshStatus == 2" :class="['arrow', refreshStatus == 2 ? 'rotate' : '']"></view>

							<view v-if="refreshStatus == 3" class="loading">
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
							</view>

							<view class="text" v-if="refreshStatus == 1">下拉刷新</view>
							<view class="text" v-else-if="refreshStatus == 2">松开更新</view>
							<view class="text" v-else-if="refreshStatus == 3">加载中...</view>
						</view>
					</view>

					<slot></slot>
					<view v-if="listCount === 0 && emptyShow" class="empty">
						<image class="empty__image" :src="emptyUrl"></image>
						<view class="empty__text">{{ emptyText }}</view>
					</view>

					<view v-if="listCount !== 0 && overOnePage" class="scroll__bottom">
						<view class="scroll__loading" v-if="end"><text class="text">已全部加载</text></view>

						<view class="scroll__loading" v-else>
							<view class="loading">
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
								<view class="loading__item"></view>
							</view>
							<view class="text">加载中...</view>
						</view>
					</view>
				</scroll-view>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
export default {
	props: {
		// 加载中
		requesting: {
			type: Boolean,
			default: false
		},
		// 加载完毕
		end: {
			type: Boolean,
			default: false
		},
		// 控制空状态的显示
		emptyShow: {
			type: Boolean,
			default: false
		},
		// 当前列表长度
		listCount: {
			type: Number,
			default: 0
		},
		// 空状态的图片
		emptyUrl: {
			type: String,
			default: '/static/images/empty/empty.png'
		},
		// 空状态的文字提示
		emptyText: {
			type: String,
			default: '未找到数据哦'
		},
		// 是否有header
		hasTop: {
			type: Boolean,
			default: false
		},
		// 下拉刷新的高度
		refreshSize: {
			type: Number,
			default: 90
		},
		// 底部高度
		bottomSize: {
			type: Number,
			default: 10
		},
		// 颜色
		color: {
			type: String,
			default: '' //#3F82FD
		}
	},
	data() {
		return {
			CustomBar: this.CustomBar,
			mode: 'refresh', // refresh 和 more 两种模式
			successShow: false, // 显示success
			successTran: false, // 过渡success
			refreshStatus: 0, // 1: 下拉刷新, 2: 松开刷新, 3: 加载中, 4: 加载完成
			move: -45, // movable-view 偏移量
			scrollHeight1: 0, // refresh view 高度负值
			scrollHeight2: 0, // refresh view - success view 高度负值
			scrollTop: 0,
			overOnePage: false
		}
	},
	computed: {},
	watch: {
		requesting(newVal, oldVal) {
			this.requestingEnd(newVal, oldVal)
		},
		refreshSize(newVal, oldVal) {
			this.refreshSizeChange(newVal, oldVal)
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		/**
		 * 处理 bindscrolltolower 失效情况
		 */
		scroll(e) {
			clearTimeout(this.timer)
			this.timer = setTimeout(() => {
				this.scrollTop = e.detail.scrollTop
			}, 300)
		},
		/**
		 * movable-view 滚动监听
		 */
		change(e) {
			const { refreshStatus } = this

			// 判断如果状态大于3则返回
			if (refreshStatus >= 3) {
				return
			}

			let diff = e.detail.y

			if (diff > 1) {
				this.refreshStatus = 2
			} else {
				this.oldY = diff
				this.refreshStatus = 1
			}
		},
		/**
		 * movable-view 触摸结束事件
		 */
		touchend() {
			const { refreshStatus } = this

			if (refreshStatus >= 3) {
				return
			}

			if (refreshStatus == 2) {
				uni.vibrateShort()
				this.refreshStatus = 3
				this.move = 0
				this.mode = 'refresh'
				this.$emit('refresh')
			} else if (refreshStatus == 1) {
				this.move = this.oldY

				this.$nextTick(() => {
					this.move = this.scrollHeight1
				})
			}
		},
		/**
		 * 加载更多
		 */
		more() {
			this.overOnePage = true
			// console.log('this.overOnePage: ', this.listCount, this.overOnePage)

			if (!this.end) {
				this.mode = 'more'
				this.$emit('more')
			}
		},
		/**
		 * 监听 requesting 字段变化, 来处理下拉刷新对应的状态变化
		 */
		requestingEnd(newVal, oldVal) {
			if (this.mode == 'more') {
				return
			}

			if (oldVal === true && newVal === false) {
				this.successShow = true
				this.refreshStatus = 4
				this.move = this.scrollHeight2

				setTimeout(() => {
					setTimeout(() => {
						this.successTran = true

						setTimeout(() => {
							this.refreshStatus = 1
							this.successShow = false
							this.successTran = false
							this.move = this.scrollHeight1
						}, 350)
					}, 1500)
				}, 650)
			} else {
				if (this.refreshStatus != 3) {
					this.refreshStatus = 3
					this.move = 0
				}
			}
		},
		/**
		 * 监听下拉刷新高度变化, 如果改变重新初始化参数, 最小高度80rpx
		 */
		refreshSizeChange(newVal, oldVal) {
			if (newVal <= 80) {
				this.refreshSize = 80
			}
			setTimeout(() => {
				this.init()
			}, 0)
		},
		/**
		 * 初始化scroll组件参数, 动态获取 下拉刷新区域 和 success 的高度
		 */
		init() {
			let query = uni.createSelectorQuery().in(this)

			query.select('#refresh').boundingClientRect()
			query.select('#success').boundingClientRect()
			query.exec(res => {
				// console.log('init query: ', res[0].height, res[1].height, res[1].height - res[0].height)

				this.scrollHeight1 = -res[0].height
				this.scrollHeight2 = res[1].height - res[0].height
			})
		}
	}
}
</script>

<style lang="scss">
@import '../../variables';

$refresh-height: 90rpx;
$success-height: 70rpx;
$success-top: $refresh-height - $success-height;
$loading-color: #a5a5a5;

.movable-area {
	width: 100%;
	height: 100%;
}

.scroll {
	width: 100%;
	// height: calc(100vh + #{$refresh-height});

	&__view {
		height: 100%;
		position: relative;
		box-sizing: border-box;
	}

	&__refresh {
		height: $refresh-height;
		position: relative;

		&--hidden {
			visibility: hidden;
		}
	}

	&__bottom {
		position: relative;
		height: 40rpx;
		padding: 40rpx 0;
	}

	&__loading {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
		text-align: center;
		color: #999999;

		.text {
			display: inline-block;
			vertical-align: middle;
			margin-left: 40rpx;
		}
	}
}

.success {
	position: absolute;
	z-index: 9;
	top: $success-top;
	left: 0;
	width: 100%;
	height: $success-height;
	line-height: $success-height;
	font-size: 24rpx;
	text-align: center;
	opacity: 0;
	color: $mainColor;

	&:after {
		content: ' ';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: currentColor;
		opacity: 0.7;
		transform: scaleX(0);
		transition: transform 0.3s ease-in-out;
		z-index: 0;
	}

	& > .info {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		color: #ffffff;
	}

	&--show {
		opacity: 1;

		&:after {
			transform: scaleX(1);
		}
	}

	&--tran {
		opacity: 0;
		transform: translateY(-100%);
		transition: opacity 0.35s linear, transform 0.35s linear;
	}
}

.empty {
	padding: 30rpx;
	text-align: center;

	&__image {
		width: 200rpx;
		height: 200rpx;
		margin: 160rpx auto 60rpx;
	}

	&__text {
		color: #999999;
	}
}

.arrow {
	position: relative;
	border-radius: 4rpx;
	width: 4rpx;
	height: 30rpx;
	background: $loading-color;
	transition: transform 0.15s ease-in-out;
	display: inline-block;
	vertical-align: middle;

	&:before {
		position: absolute;
		content: '';
		bottom: -4rpx;
		right: 50%;
		width: 4rpx;
		height: 16rpx;
		transform: rotate(45deg);
		transform-origin: 100% 100%;
		background: $loading-color;
		border-radius: 4rpx;
	}

	&:after {
		position: absolute;
		content: '';
		bottom: -4rpx;
		left: 50%;
		width: 4rpx;
		height: 16rpx;
		transform: rotate(-45deg);
		transform-origin: 0% 100%;
		background: $loading-color;
		border-radius: 4rpx;
	}

	&.rotate {
		transform: rotate(-180deg);
	}
}

.loading {
	position: relative;
	display: inline-block;
	vertical-align: middle;
	width: 36rpx;
	height: 36rpx;
	margin-right: -14rpx;

	&__item {
		position: absolute;
		top: 0;
		left: 0;
		width: 36rpx;
		height: 36rpx;

		&:before {
			content: '';
			display: block;
			margin: 0 auto;
			width: 4rpx;
			height: 8rpx;
			background-color: $loading-color;
			border-radius: 4rpx;
			animation: fadeDelay 1.2s infinite ease-in-out both;
		}

		&:nth-child(2) {
			transform: rotate(30deg);

			&:before {
				animation-delay: -1.1s;
			}
		}

		&:nth-child(3) {
			transform: rotate(60deg);

			&:before {
				animation-delay: -1s;
			}
		}

		&:nth-child(4) {
			transform: rotate(90deg);

			&:before {
				animation-delay: -0.9s;
			}
		}

		&:nth-child(5) {
			transform: rotate(120deg);

			&:before {
				animation-delay: -0.8s;
			}
		}

		&:nth-child(6) {
			transform: rotate(150deg);

			&:before {
				animation-delay: -0.7s;
			}
		}

		&:nth-child(7) {
			transform: rotate(180deg);

			&:before {
				animation-delay: -0.6s;
			}
		}

		&:nth-child(8) {
			transform: rotate(210deg);

			&:before {
				animation-delay: -0.5s;
			}
		}

		&:nth-child(9) {
			transform: rotate(240deg);

			&:before {
				animation-delay: -0.4s;
			}
		}

		&:nth-child(10) {
			transform: rotate(270deg);

			&:before {
				animation-delay: -0.3s;
			}
		}

		&:nth-child(11) {
			transform: rotate(300deg);

			&:before {
				animation-delay: -0.2s;
			}
		}

		&:nth-child(12) {
			transform: rotate(330deg);

			&:before {
				animation-delay: -0.1s;
			}
		}
	}

	@keyframes fadeDelay {
		0%,
		39%,
		100% {
			opacity: 0.2;
		}
		40% {
			opacity: 1;
		}
	}

	@-webkit-keyframes fadeDelay {
		0%,
		39%,
		100% {
			opacity: 0.2;
		}
		40% {
			opacity: 1;
		}
	}
}
</style>
