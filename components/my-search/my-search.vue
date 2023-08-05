<template>
	<view>
		<view class="search-container" @click="clickHandle">
			<view class="search">
				<uni-icons type="search" size="17"></uni-icons>
				<text>搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		data() {
			return {
				
			};
		},
		methods:{
			clickHandle() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="less">
	.search-container {
		display: flex;
		align-items: center;
		background-color: #C00000;
		height: 100rpx;
		padding: 0 20rpx;
		.search {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			width: 100%;
			height: 72rpx;
			border-radius: 36rpx;
			text {
				font-size: 30rpx;
				margin-left: 10rpx;
			}
	}
	}
</style>