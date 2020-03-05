<template>
	<view>
		<cu-custom :bgColor="'bg-'+themeColor.name" :isBack="true" :icon="'sort'">
			<block slot="content">{{lang.home_stories}}</block>
		</cu-custom> 
	</view>
</template>

<script>   
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
