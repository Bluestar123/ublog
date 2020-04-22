<template>
	<view>
		<cu-custom :bgColor="'bg-'+themeColor.name" :isBack="true" :icon="'sort'">
			<block slot="content">{{lang.home_stories}}</block>
		</cu-custom> 
		
		<view :style="{top: CustomBar+'px'}" class="top-wrap"><tab id="category" :tab-data="categoryMenu" :cur-index="categoryCur" :size="80" :scroll="true" @change="toggleCategory"></tab></view>

		<swiper :style="{height: `calc(100vh - ${CustomBar}px)`}"  :current="categoryCur" :duration="duration" @animationfinish="swipeChange">
			<swiper-item v-for="(item, index) in categoryData" :key="index">
				<scroll :requesting="item.requesting" :end="item.end" :empty-show="item.emptyShow" :list-count="item.listCount" :has-top="true" :refresh-size="80" @refresh="refresh" @more="more">
					<view class="cells">
						<view class="cell" v-for="(itemC, i) in item.listData" @tap='intoPageDetail(itemC)'  :key="i" hover-class="hover-class">
							<view class="cell__hd"><image mode="aspectFill" :src="itemC.headImg" /></view>
							<view class="cell__bd">
								<view class="name">{{ itemC.title }}</view>
								<view class="des">{{ itemC.description }}</view>
							</view>
						</view>
					</view>
				</scroll>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>   
let pageStart = 0
let pageSize = 10

let testData = []

	import Tab from '@/colorui/components/tab/index'
	import Scroll from '@/colorui/components/scroll/index'
	export default {
		components:{
			Tab,Scroll
		},
		data() {
			return {
				CustomBar: this.CustomBar,
				duration: 300, // swiper-item 切换过渡时间
				showPage: -1, // 控制列表空状态的显示时机
				categoryCur: 0,
				categoryMenu: [],
				categoryData: []
			}
		},
		onLoad() {
			this.getCategoryMenu()
			// this.getList('refresh', pageStart)
		},
		methods: {
			async getCategoryMenu() {
				try{
					// const res = await uniCloud.callFunction({
					// 	name: 'articleCategory',
					// 	data: {
					// 		type: 'get'
					// 	}
					// })
					const res = await this.$uniCloud('articleCategory', {type: 'get'})
					
					this.categoryMenu = res.result.data
					this.categoryData = this.categoryMenu.map(item => {
						return {
							name: item.name,
							requesting: false,
							end: false,
							emptyShow: false,
							page: pageStart,
							listData: []
						}
					})
					this.getList('refresh', pageStart)
				}catch(e){
					//TODO handle the exception
					this.$toast(this.errorMsg)
				}
			},
			async getList(type, currentPage = 1) {
				let pageData = this.getCurrentData()
		
				pageData.requesting = true
		
				this.setCurrentData(pageData)
				// 自定义导航栏没有这个，需要可以自己加
				// uni.showNavigationBarLoading()
				
				// 请求数据, 第0页开始 1-10条
				// let res = await uniCloud.callFunction({
				// 	name: "article",
				// 	data: {
				// 		categoryId: this.categoryMenu[this.categoryCur]._id,
				// 		currentPage,
				// 		pageSize
				// 	}
				// })
				let res = await this.$uniCloud('article', {
					categoryId: this.categoryMenu[this.categoryCur]._id,
					currentPage,
					pageSize
				})
				testData = res.result.list
				
				setTimeout(() => {
					pageData.requesting = false
		
					// uni.hideNavigationBarLoading()
		
					if (type === 'refresh') {
						pageData.listData = testData
						pageData.listCount = pageData.listData.length
						pageData.end = false //是否已经全部加载
						pageData.page = currentPage + 1
					} else if (testData.length === 10){
						pageData.listData = pageData.listData.concat(testData)
						pageData.listCount = pageData.listData.length
						pageData.end = false
						pageData.page = currentPage + 1
					} else if (testData.length >= 0 && testData.length < 10) {
						pageData.listData = pageData.listData.concat(testData)
						pageData.listCount = pageData.listData.length
						pageData.end = true
						// pageData.page = currentPage + 1
					}
		
					this.setCurrentData(pageData)
					if (pageData.listData.length === 0) {
						pageData.emptyShow = true
					}
				}, 100)
			},
			intoPageDetail(item) {
				this.$router(`/page-details/page-details?id=${item._id}`)
			},
			// 顶部tab切换事件
			toggleCategory(e) {
				this.duration = 0
		
				setTimeout(() => {
					this.categoryCur = e.index
				}, 0)
			},
			// 页面滑动切换事件
			swipeChange(e) {
				this.duration = 300
				
				setTimeout(() => {
					this.categoryCur = e.detail.current
					
					this.loadData()
				}, 0)
			},
			// 更新页面数据
			setCurrentData(pageData) {
				this.categoryData[this.categoryCur] = pageData
			},
			// 获取当前激活页面的数据
			getCurrentData() {
				return this.categoryData[this.categoryCur]
			},
			// 判断是否为加载新的页面,如果是去加载数据
			loadData() {
				let pageData = this.getCurrentData()
				if (pageData.listData.length == 0) {
					this.getList('refresh', pageStart)
				}
			},
			// 刷新数据
			refresh() {
				this.getList('refresh', pageStart)
			},
			// 加载更多
			more() {
				this.getList('more', this.getCurrentData().page)
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '~@/colorui/variables';
.top-wrap {
	position: fixed;
	left: 0;
	/* #ifdef H5 */
	top: var(--window-top);
	/* #endif */
	width: 100%;
	background-color: #ffffff;
	z-index: 99;
}

.cells {
	background: #ffffff;
	margin-top: 20rpx;
}

.cell {
	display: flex;
	padding: 20rpx;

	&:not(:last-child) {
		border-bottom: 1rpx solid $lineColor;
	}

	&__hd {
		font-size: 0;

		image {
			width: 160rpx;
			height: 160rpx;
			margin-right: 20rpx;
			border-radius: 12rpx;
		}
	}

	&__bd {
		flex: 1;

		.name {
			@include line(2);
			font-size: 28rpx;
			margin-bottom: 12rpx;
		}

		.des {
			@include line(2);
			color: $mainBlack2;
			font-size: 24rpx;
		}
	}
}
</style>
