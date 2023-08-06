<template>
	<view>
		<view class="goods-list">
			<view class="goods" v-for="(item,index) in goodsList" :key="index" @click="gotoDetail(item)">
				<view class="left">
					<image :src="item.goods_big_logo || defaultPic"></image>
				</view>
				<view class="right">
					<view class="title">{{ item.goods_name }}</view>
					<view class="price">￥{{ item.goods_price | tofixed }} </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
				  // 查询关键词
				  query: '',
				  // 商品分类Id
				  cid: '',
				  // 页码值
				  pagenum: 1,
				  // 每页显示多少条数据
				  pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				// 是否正在请求数据
				isloading: false
			};
		},
		onLoad(options) {
		  // 将页面参数转存到 this.queryObj 对象中
		  this.queryObj.query = options.query || ''
		  this.queryObj.cid = options.cid || ''
		  
		  this.getGoodsList()
		},
		methods: {
			getGoodsList(cb){
				// 打开节流阀
				this.isloading = true
				uni.$http.get('/api/public/v1/goods/search',this.queryObj).then((res)=>{
					if(res.data.meta.status !== 200) return uni.showMessage()
					this.total = res.data.message.total
					this.goodsList = [...this.goodsList, ...res.data.message.goods]		
				})
				this.isloading = false
				cb && cb()
			},
			gotoDetail(item) {
				uni.navigateTo({
				    url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				  })
			}
		},
		filters: {
			tofixed(num){
				return Number(num).toFixed(2)
			}
		},
		onReachBottom() {
			if(this.isloading) return
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.showMessage('到底了...')
			this.queryObj.pagenum += 1
			this.getGoodsList()
			
		},
		onPullDownRefresh() {
			this.queryObj.pagenum = 1
			this.goodsList = []
			this.total = 0
			this.isloading = false
			
			this.getGoodsList(()=>{uni.stopPullDownRefresh()})
		}
	}
</script>

<style lang="less">
	.goods-list {
		.goods {
			display: flex;
			height: 300rpx;
			border-bottom: 1px #efefef solid;
			background-color: #fff;
			padding: 20rpx 10rpx;
			
			.left {
				margin-right: 15rpx;
				image {
					width: 300rpx;
					height: 300rpx;
				}
			}
			
			.right {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.title {
					font-size: 28rpx;
				}
				.price {
					color: #c00000;
					font-size: 32rpx;
				}
			}
		}
	}
</style>
