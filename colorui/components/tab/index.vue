<template>
	<scroll-view scroll-x scroll-with-animation :scroll-left="scrollLeft">
		<view :class="['tabs', scroll ? 'tabs--scroll' : '']" :style="{ height: size + 'rpx' }">
			<view
				:class="['tabs__item', index === tabCur ? 'tabs__item--cur' : '']"
				:style="{ height: size + 'rpx', lineHeight: size + 'rpx' }"
				v-for="(item, index) in tabData"
				:key="index"
				@tap="toggleTab(index)"
			>
				<text :id="'item-' + index" class="tabs__item-child">{{ item.name }}</text>
			</view>

			<view :class="['tabs__line', needTransition ? 'transition' : '']" :style="{ backgroundColor: color, width: lineWidth + 'px', transform: 'translateX(' + translateX + 'px)' }"></view>
		</view>
	</scroll-view>
</template>

<script>
export default {
	props: {
		// 当前索引
		curIndex: {
			type: Number,
			default: -1
		},
		// 是否可以超出滚动
		scroll: {
			type: Boolean,
			default: false
		},
		// 数据源
		tabData: {
			type: Array,
			default: () => {
				return []
			}
		},
		// tab高度
		size: {
			type: Number,
			default: 90
		},
		// 颜色
		color: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			tabCur: this.curIndex,
			needTransition: false, // 下划线是否需要过渡动画
			translateX: 0, // 下划 line 的左边距离
			lineWidth: 0, // 下划 line 宽度
			scrollLeft: 0 // scroll-view 左边滚动距离
		}
	},
	watch: {
		curIndex(newVal, oldVal) {
			this.tabCur = newVal
			this.tabCurChange(newVal, oldVal)
			this.scrollByIndex(newVal)
		},
		size(newVal, oldVal) {
			this.sizeChange(newVal, oldVal)
		},
		scroll(newVal, oldVal) {
			this.init()
		},
		tabData(newVal) {
			this.init()
		}
	},
	// mounted() {
	// 	this.init()
	// },
	methods: {
		/**
		 * 切换菜单
		 */
		toggleTab(index) {
			this.$emit('change', { index: index })
			this.scrollByIndex(index)
		},
		/**
		 * 滑动到指定位置
		 * @param tabCur: 当前激活的tabItem的索引
		 * @param needTransition: 下划线是否需要过渡动画, 第一次进来应设置为false
		 */
		scrollByIndex(tabCur, needTransition = true) {
			this.needTransition = needTransition
			const item = this.items[tabCur]
			if (!item) return

			// console.log(tabCur, item.left, item.width)

			// 子item宽度
			const chItemWidth = item.width
			// 父item左边距离
			const offsetLeft = item.left
			
			if (this.scroll) {
				// 超出滚动的情况
				// 保持滚动后当前item'尽可能'在屏幕中间
				const scrollLeft = offsetLeft - (this.windowWidth - chItemWidth) / 2
				this.scrollLeft = scrollLeft
			}
			
			setTimeout(() => {
				this.tabCur = tabCur
				this.oldTranslateX = offsetLeft
				this.translateX = offsetLeft
				this.lineWidth = chItemWidth
			}, 0)
		},
		/**
		 *  监听tab高度变化, 最小值为80rpx
		 */
		sizeChange(newVal, oldVal) {
			if (newVal <= 80) {
				this.size = 80
			}
		},
		/**
		 *  监听tabCur变化, 做对应处理
		 */
		tabCurChange(newVal, oldVal) {
			if (this.firstFlag) {
				this.scrollByIndex(newVal)
			}
			this.firstFlag = true
		},
		/**
		 *  初始化函数
		 */
		init() {
			this.tabCur = 0
			const { windowWidth } = uni.getSystemInfoSync()

			// 设置屏幕宽度
			this.windowWidth = windowWidth || 375

			// 动态item的padding大小
			// this.itemPadding = (this.windowWidth / 375) * 15

			// 获取每一个tab的宽高信息并存储起来
			let query = uni.createSelectorQuery().in(this)

			for (let i = 0; i < this.tabData.length; i++) {
				query.select(`#item-${i}`).boundingClientRect()
			}
			
			query.exec(res => {
				this.items = res
				this.scrollByIndex(this.tabCur, false)
			})
		}
	}
}
</script>

<style lang="scss">
@import '../../variables';

$top-height: 90rpx;

scroll-view {
	width: 100%;
}

.tabs {
	position: relative;
	height: $top-height;
	color: $mainBlack3;
	display: flex;

	&--scroll {
		white-space: nowrap;
		// display: block !important;
	}

	// &--scroll &__item {
	// 	flex: initial !important;
	// 	text-align: initial !important;
	// 	display: inline-block !important;
	// }

	// &--scroll &__item-child {
	// 	display: block !important;
	// }

	&__item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: $top-height;
		// line-height: $top-height;
		// text-align: center;
		padding: 0 30rpx;
		box-sizing: border-box;
		transition: color 0.3s ease-in-out;

		&--cur {
			color: $mainBlack1;
			font-size: 30rpx;
			font-weight: bold;
			// border-bottom: 2rpx solid red;
		}
	}

	&__item-child {
		font-size: 28rpx;
		// display: inline-block;
	}

	&__line {
		position: absolute;
		left: 0;
		bottom: 0;
		background-color: $mainColor;
		height: 4rpx;
		width: 0rpx;
		// display: inline-block;

		&.transition {
			transition: width 0.3s, transform 0.3s;
		}
	}
}
</style>
