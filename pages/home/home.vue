<template>
	<view>
		<view class="search">
			<my-search @click="gotoSearch"></my-search>
		</view>
		
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true" class="swiper">
			<swiper-item v-for="item in swiperList" :key="item.goods_id">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src">
				</navigator>
			</swiper-item>
		</swiper>
		
		<view class="nav-box">
			<view class="nav" v-for="(item,index) in navList" :key="index" @click="gotoPage(item)">
				<image :src="item.image_src"></image>
			</view>
		</view>
		
		<view class="floor-box">
			<view class="floor" v-for="(item, index) in floorList" :key="index">
				<!-- <text>{{item.floor_title.name}}</text> -->
				<view class="title">
					<image :src="item.floor_title.image_src"></image>
				</view>
				<view class="img">
					<view class="left">
						<navigator :url="item.product_list[0].url">
							<image :src="item.product_list[0].image_src" mode="widthFix" :style="{width: item.product_list[0].image_width + 'rpx'}"></image>
						</navigator>
					</view>
					
					<view class="right">
						<navigator v-for="(l,i) in item.product_list" :key="i" v-if="i!==0" :url="l.url">
							<image :src="l.image_src" mode="widthFix" :style="{width: l.image_width + 'rpx'}"></image>
						</navigator>
					</view>
				</view>
			</view>
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
	      // 1. 轮播图的数据列表，默认为空数组
	      swiperList: [],
		  // 分类的数据列表
		  navList: [],
		  // 楼层列表
		  floorList: [],
		  
	    }
	  },
	  onLoad() {
	    // 2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
	    this.getSwiperList()
		this.getNavList()
		this.getFloorList()
	  },
	  methods: {
	  //   // 3. 获取轮播图数据的方法
	  //   async getSwiperList() {
	  //     // 3.1 发起请求
	  //     const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
	  //     // 3.2 请求失败
	  //     if (res.meta.status !== 200) {
	  //       return uni.showToast({
	  //         title: '数据请求失败！',
	  //         duration: 1500,
	  //         icon: 'none',
	  //       })
	  //     }
	  //     // 3.3 请求成功，为 data 中的数据赋值
	  //     this.swiperList = res.message
	  //   },
	  // },
	  getSwiperList(){
		  uni.$http.get('/api/public/v1/home/swiperdata').then((res)=>{
			  console.log(res.data.message);
			  if(res.data.meta.status != 200) return uni.showMessage()
			  this.swiperList = res.data.message
			  uni.showMessage('请求数据完成!')
		  })
	  },
	  getNavList() {
		  uni.$http.get('/api/public/v1/home/catitems').then((res)=>{
			  if(res.data.meta.status!=200) return uni.showMessage()
			  this.navList = res.data.message
		  })
	  },
	  getFloorList(){
		  uni.$http.get('/api/public/v1/home/floordata').then((res)=>{
			  if(res.data.meta.status!=200) return uni.showMessage()
			  res.data.message.forEach((item)=>{
				  item.product_list.forEach((product)=>{
					  product.url = '/subpkg/goods_list/goods_list?' + product.navigator_url.split('?')[1]
				  })
			  })
			  this.floorList = res.data.message
		  })
	  },
	  gotoPage(item){
		  if(item.name === '分类')
		  uni.switchTab({
		  	url: '/pages/cate/cate'
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
	.swiper {
		height: 330rpx;
		.swiper-item image,
		.swiper-item {
			width: 100%;
			height: 100%;
		}
	}
	
	.nav-box {
		display: flex;
		justify-content: space-around;
		margin: 15rpx 0;
		.nav {
			image {
				width: 128rpx;
				height: 140rpx;
			}
		}
	}
	
	.floor-box {
		margin: 15rpx 0;
		.floor {
			margin: 15rpx 0;
			.title {
				image {
					height: 60rpx;
				}
			}
			
			.img {
				display: flex;
				padding-left: 15rpx;
				.right {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-around;
				}
			}
		}
	}
	
	.search {
		position: sticky;
		top: 0;
		z-index: 999;
	}
</style>
