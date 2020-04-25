<template>
	<view>
		<Parse :content="article"  @preview="preview" @navigate="navigate"></Parse>
	</view>
</template>

<script>
	import marked from 'marked'
	import Parse from '@/colorui/components/parse/parse.vue'
	export default {
		data() {
			return {
				article: ''
			}
		},
		components:{Parse},
		onLoad(e) {
			console.log(e)
			this.getDetails(e)
		},
		methods: {
			async getDetails(e) {
				let res = await this.$uniCloud('pageDetails', {
					id: e.id
				})
				try{
					this.article = marked(res.result.data[0].content)
				}catch(e){
					//TODO handle the exception
				}
				
			},
			preview(src, e){},
			navigate(href, e){}
		}
	}
</script>

<style>
@import url("/colorui/components/parse/parse.css");
</style>
