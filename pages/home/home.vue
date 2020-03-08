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
						<view class="cell" v-for="(item, index) in item.listData" :key="index">
							<view class="cell__hd"><image mode="aspectFill" :src="item.images" /></view>
							<view class="cell__bd">
								<view class="name">{{ item.title }}</view>
								<view class="des">{{ item.description }}</view>
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
let pageSize = 15

let testData = [
	{
		title: '这个绝望的世界没有存在的价值，所剩的只有痛楚',
		description: '思念、愿望什么的都是一场空，被这种虚幻的东西绊住脚，什么都做不到',
		images: 'https://images.weserv.nl/?url=https://p1.ssl.qhimgs1.com/sdr/400__/t012defb31c27aec7eb.jpg'
	},
	{
		title: '我早已闭上了双眼，我的目的，只有在黑暗中才能实现',
		description: '有太多的羁绊只会让自己迷惘，强烈的想法和珍惜的思念，只会让自己变弱',
		images: 'https://images.weserv.nl/?url=https://p1.ssl.qhimgs1.com/sdr/400__/t012defb31c27aec7eb.jpg'
	},
	{
		title: '感受痛苦吧，体验痛苦吧，接受痛苦吧，了解痛苦吧。不知道痛苦的人是不会知道什么是和平',
		description: '但我已经在无限存在的痛苦之中，有了超越凡人的成长。从凡人化为神',
		images: 'https://images.weserv.nl/?url=https://p1.ssl.qhimgs1.com/sdr/400__/t012defb31c27aec7eb.jpg'
	},
	{
		title: '我决定了 从今天起 我要选择一条不会让自己后悔的路 我要创造出属于自己的忍道 ',
		description: '我才不要在这种时候放弃,即使当不成中忍,我也会通过其他的途径成为火影的,这就是我的忍道',
		images: 'https://images.weserv.nl/?url=https://p1.ssl.qhimgs1.com/sdr/400__/t012defb31c27aec7eb.jpg'
	},
	{
		title: '为什么你会这么弱？就是因为你对我的仇恨...还不够深...',
		description: '你没有杀的价值...愚蠢的弟弟啊...想要杀死我的话...仇恨吧！憎恨吧！然后丑陋地活下去吧！逃吧 逃吧...然后苟且偷生下去吧！',
		images: 'https://images.weserv.nl/?url=https://p1.ssl.qhimgs1.com/sdr/400__/t012defb31c27aec7eb.jpg'
	},
	{
		title: '对于忍者而言怎样活着无所谓，怎样死去才是最重要的...',
		description: '所谓的忍者就是忍人所不能忍，忍受不了饿肚子，而沦落为盗贼的人，根本不能称之为忍者',
		images: 'https://images.weserv.nl/?url=https://p1.ssl.qhimgs1.com/sdr/400__/t012defb31c27aec7eb.jpg'
	},
	{
		title: '在这世上，有光的地方就必定有黑暗，所谓的胜者，也就是相对败者而言',
		description: '若以一己之思念要维持和平，必会招致战争，为了守护爱，变回孕育出恨。此间因果，是无法斩断的。现实就是如此',
		images: 'https://images.weserv.nl/?url=https://p1.ssl.qhimgs1.com/sdr/400__/t012defb31c27aec7eb.jpg'
	},
	{
		title: '世界上...只有没有实力的人,才整天希望别人赞赏...',
		description: '很不巧的是我只有一个人，你说的那些家伙们已经一个都没有了，已经??全部被杀死了',
		images: 'https://images.weserv.nl/?url=https://p1.ssl.qhimgs1.com/sdr/400__/t012defb31c27aec7eb.jpg'
	},
	{
		title: '千代婆婆，父亲大人和母亲大人回来了吗？？？',
		description: '明明剩下的只有痛苦了，既然你这么想活命，我就方你一条生路好了。不过，你中的毒不出三日就会要了你的命',
		images: 'https://images.weserv.nl/?url=https://p1.ssl.qhimgs1.com/sdr/400__/t012defb31c27aec7eb.jpg'
	},
	{
		title: '艺术就是爆炸！！~~ 嗯 ~~ 芸术は爆発します！',
		description: '我的艺术就是爆炸那一瞬，和蝎那种让人吃惊的人偶喜剧从根本上就是不同的！',
		images: 'https://images.weserv.nl/?url=https://p1.ssl.qhimgs1.com/sdr/400__/t012defb31c27aec7eb.jpg'
	}
]
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
				categoryMenu: ['推荐', '精选集锦', '最新体验', '资料', '版本', '攻略', '排行', '热门'],
				categoryData: [
					{
						name: '推荐',
						requesting: false,
						end: false,
						emptyShow: false,
						page: pageStart,
						listData: []
					},
					{
						name: '精选集锦',
						requesting: false,
						end: false,
						emptyShow: false,
						page: pageStart,
						listData: []
					},
					{
						name: '最新体验',
						requesting: false,
						end: false,
						emptyShow: false,
						page: pageStart,
						listData: []
					},
					{
						name: '资料',
						requesting: false,
						end: false,
						emptyShow: false,
						page: pageStart,
						listData: []
					},
					{
						name: '版本',
						requesting: false,
						end: false,
						emptyShow: false,
						page: pageStart,
						listData: []
					},
					{
						name: '攻略',
						requesting: false,
						end: false,
						emptyShow: false,
						page: pageStart,
						listData: []
					},
					{
						name: '排行',
						requesting: false,
						end: false,
						emptyShow: false,
						page: pageStart,
						listData: []
					},
					{
						name: '热门',
						requesting: false,
						end: false,
						emptyShow: false,
						page: pageStart,
						listData: []
					}
				]
			}
		},
		onLoad() {
			this.getList('refresh', pageStart)
		},
		methods: {
			getList(type, currentPage = 1) {
				let pageData = this.getCurrentData()
		
				pageData.requesting = true
		
				this.setCurrentData(pageData)
		
				uni.showNavigationBarLoading()
		
				setTimeout(() => {
					pageData.requesting = false
		
					uni.hideNavigationBarLoading()
		
					if (type === 'refresh') {
						pageData.listData = testData
						pageData.listCount = pageData.listData.length
						pageData.end = false //是否已经全部加载
						pageData.page = currentPage + 1
					} else {
						pageData.listData = pageData.listData.concat(testData)
						pageData.listCount = pageData.listData.length
						pageData.end = true
						pageData.page = currentPage + 1
					}
		
					this.setCurrentData(pageData)
				}, 100)
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

<style lang="scss">
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
