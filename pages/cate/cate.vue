<template>
	<view>
		<my-search @click="gotoSearch"></my-search>
		
		<view class="container">
			<scroll-view scroll-y="true" :style="{height: wh + 'px'}" class="left">
				<view v-for="(item,index) in cateList" :key="index" :class="active === index ? 'active': ''" @click="activeChange(index)">{{ item.cat_name }}</view>
			</scroll-view>
			
			<scroll-view scroll-y="true" :style="{height: wh + 'px'}" class="right" :scroll-top="scrollTop">
				<view class="box" v-for="(item,index) in cateList2" :key="index">
					<view class="title">{{ item.cat_name }}</view>
					<view class="body">
						<view class="item" v-for="(item2,index2) in item.children" :key="index2" @click="gotoGoods(item2.cat_id)">
							<image :src="item2.cat_icon"></image>
							<text>{{ item2.cat_name }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		  // 将 badgeMix 混入到当前的页面中进行使用
		mixins: [badgeMix],
		data() {
			return {
				// 屏幕可用高度
				wh: 0,
				// 分类数据列表
				cateList: [],
				active: 0,
				// 二级分类数据列表
				cateList2: [],
				scrollTop: 0
			};
		},
		onLoad() {
		  // 获取设备信息
		  const systemInfo = uni.getSystemInfoSync()
		  this.wh = systemInfo.windowHeight - 50
		  // 调用获取分类列表数据的方法
		  this.getCateList()
		},
		methods: {
			getCateList(){
				uni.$http.get('/api/public/v1/categories').then((res)=>{
					if(res.data.meta.status !== 200) return uni.showMessage()
					this.cateList = res.data.message
					this.cateList2 = this.cateList[0].children
					uni.showMessage('加载数据完成')
				})
			},
			activeChange(index) {
				this.active = index
				this.cateList2 = this.cateList[index].children
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			gotoGoods(id) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + id
				})
			},
			gotoSearch(){
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="less">
	.container {
		display: flex;
		.left {
			width: 30%;
			text-align: center;
			
			view {
				padding: 20rpx 0;
				background-color: #f7f7f7;
				font-size: 25rpx
			}
			.active {
				position: relative;
				background-color: #fff;
				}
			.active::before {
				  content: ' ';
				  display: block;
				  width: 6rpx;
				  height: 30rpx;
				  background-color: #c00000;
				  position: absolute;
				  left: 0;
				  top: 50%;
				  transform: translateY(-50%);
				}
			}
		}
		
		.right {
			background-color: #fff;
			.box {
				.title {
					text-align: center;
					padding: 20rpx 0;
					font-size: 30rpx;
					font-weight: 700;
				}
				
				.body {
					display: flex;
					flex-wrap: wrap;
					
					.item {
						display: flex;
						flex-direction: column;
						margin: 20rpx 0;
						width: 33%;
						align-items: center;
						justify-content: center;
						image {
							width: 120rpx;
							height: 120rpx;
						}
						
						text {
							font-size: 25rpx;
						}
					}
				}
			}
	}
</style>
