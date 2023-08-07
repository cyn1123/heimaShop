<template>
	<view>
		<view class="detail-box" v-if="detailInfo.goods_name">
			<view class="swiper">
				<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
					<swiper-item v-for="(item,index) in detailInfo.pics" :key="index"  @click="preview(index)">
						<image :src="item.pics_big" mode="widthFix"></image>
					</swiper-item>
				</swiper>	
			</view>
			
			<view class="detail">
				<view class="price">￥{{ detailInfo.goods_price }}</view>
				
				<view class="title">
					<view class="name">{{ detailInfo.goods_name }}</view>
					<view class="shoucang">
						<uni-icons type="star" size="20" color="gray"></uni-icons>
						<view>收藏</view>
					</view>
				</view>
				
				<view class="kuaidi">快递: 免运费</view>
			</view>
			<rich-text :nodes="detailInfo.goods_introduce"></rich-text>
			
			<uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detailInfo: {},
				goods_id: '',
				options: [{
							icon: 'shop',
							text: '店铺',
							infoColor:"red"
						}, {
							icon: 'cart',
							text: '购物车',
							info: 2
						}],
					    buttonGroup: [{
					      text: '加入购物车',
					      backgroundColor: '#ff0000',
					      color: '#fff'
					    },
					    {
					      text: '立即购买',
					      backgroundColor: '#ffa200',
					      color: '#fff'
					    }
					    ]
			};
		},
		onLoad(options) {
			this.goods_id = options.goods_id
			this.getDetailInfo(this.goods_id)
		},
		methods:{
			getDetailInfo(goods_id){
				uni.$http.get('/api/public/v1/goods/detail', { goods_id }).then((res)=>{
					if(res.data.meta.status !== 200) return uni.showMessage()
					res.data.message.goods_introduce = res.data.message.goods_introduce.replace(/<img /g, '<img style="display: block;"')
					this.detailInfo = res.data.message
					
				})
			},
			preview(index) {
				uni.previewImage({
					current: index,
					urls: this.detailInfo.pics.map(x=>x.pics_big)
				})
			},
			onClick(e) {
				if(e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.detail-box {
		background-color: #fff;
		padding-bottom: 100rpx;
		uni-goods-nav {
			// 为商品导航组件添加固定定位
			  position: fixed;
			  bottom: 0;
			  left: 0;
			  width: 100%;
		}
		
		.swiper {
			swiper {
				height: 800rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		
		.detail {
			display: flex;
			flex-direction: column;
			margin-left: 20rpx;
			margin-bottom: 30rpx;
			justify-content: space-around;
			view {
				margin-bottom: 10rpx;
			}
			
			.price {
				color: #c00000;
				font-size: 40rpx;
			}
			
			.title {
				display: flex;
				
				.name {
					font-size: 30rpx;
				}
				.shoucang {
					display: flex;
					flex-direction: column;
					width: 200rpx;
					align-items: center;
					border-left: 1px solid #efefef;
					color: gray;
				}
			}
			
			.kuaidi {
				font-size: 28rpx;
				color: gray;
			}
		}
	}
</style>
