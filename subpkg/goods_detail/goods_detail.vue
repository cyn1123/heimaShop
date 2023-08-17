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
	// 从 vuex 中按需导出 mapState 辅助方法
	import { mapState } from 'vuex'
	// 按需导入 mapMutations 这个辅助方法
	import { mapMutations } from 'vuex'
	// 按需导入 mapGetters 这个辅助方法
	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
		    // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
		    ...mapState('m_cart', ['cart']),
			// 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
			...mapGetters('m_cart', ['total']),
		  },
		  watch: {
		      // 定义 total 侦听器，指向一个配置对象
		         total: {
		            // handler 属性用来定义侦听器的 function 处理函数
		            handler(newVal) {
		               const findResult = this.options.find(x => x.text === '购物车')
		               if (findResult) {
		                  findResult.info = newVal
		               }
		            },
		            // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
		            immediate: true
		         }
		    },
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
			},
			// 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
			...mapMutations('m_cart', ['addToCart']),
			// 右侧按钮的点击事件处理函数
			buttonClick(e) {
			   // 1. 判断是否点击了 加入购物车 按钮
			   if (e.content.text === '加入购物车') {
			
			      // 2. 组织一个商品的信息对象
			      const goods = {
			         goods_id: this.detailInfo.goods_id,       // 商品的Id
			         goods_name: this.detailInfo.goods_name,   // 商品的名称
			         goods_price: this.detailInfo.goods_price, // 商品的价格
			         goods_count: 1,                           // 商品的数量
			         goods_small_logo: this.detailInfo.goods_small_logo, // 商品的图片
			         goods_state: true                         // 商品的勾选状态
			      }
			
			      // 3. 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
			      this.addToCart(goods)
			
			   }
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #fff;
	}
	
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
