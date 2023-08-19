<template>
	<view>
		<view class="car-container" v-if="cart.length != 0">
			<view class="address" v-if="JSON.stringify(address) === '{}'">
				<button type="primary" size="mini" @click="chooseAddress">请选择收货地址+</button>
			</view>
			
			<view class="address2" v-else @click="chooseAddress">
				<view class="row1">
					<text>收货人: {{address.name}}</text>
					<view class="phone">
						<text>电话: {{address.phone}}</text>
						<uni-icons type="forward"></uni-icons>
					</view>
				</view>
				
				<view class="row2">
					<text>收货地址: {{address.addr}}</text>
				</view>
			</view>
			
			<view class="pic">
				<image src="/static/cart_border@2x.png" mode="widthFix"></image>
			</view>
			<view class="title">
				<uni-icons type="shop" size="20"></uni-icons>
				<text>购物车</text>
			</view>
			<view class="goods-list">
				<uni-swipe-action>
					<view v-for="(item,index) in cart" :key="index">
						<uni-swipe-action-item :right-options="options" @click="deleteGoods(item.goods_id)">
							<view class="goods">
								<view class="left">
									<radio @click="radioChange(index)" :checked="item.goods_state" color="#c00000"/>
									<image :src="item.goods_small_logo"></image>
								</view>
								<view class="right">
									<view class="name">
										<text>{{ item.goods_name }}</text>
									</view>
									<view class="price-count">
										<view class="price">
											<text>￥{{ item.goods_price }}</text>
										</view>
										<view class="count">
											<uni-number-box @change="changeValue(index, $event)" :value="item.goods_count" min="1"/>
										</view>
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</view>
					
				</uni-swipe-action>
			</view>
			
			<view class="all-price">
				<view class="select">
					<radio color="#c00000" :checked="flag" @click="allRadioChange"/>
					<text>全选</text>
				</view>
				
				<view class="price">
					<text>合计: ￥{{ price }} </text>
				</view>
				
				<view class="btn">
					<button @click="getMoney">结算({{total}})</button>
				</view>
			</view>
		</view>
		
		<view class="car-null" v-else>
			<image src="../../static/cart_empty@2x.png" mode=""></image>
			<text>空空如也~</text>
		</view>
	</view>
</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	// 按需导入 mapGetters 这个辅助方法
	import { mapState, mapMutations, mapGetters } from 'vuex'
	export default {
		// 将 badgeMix 混入到当前的页面中进行使用
		mixins: [badgeMix],
		data() {
			return {
				flag: false,
				options: [{
							text: '删除',
							style: {
								backgroundColor: '#c00000'
							}
						}],
				seconds: 3,
				timer: null
			};
		},
		computed: {
			...mapState('m_cart', ['cart']),
			...mapGetters('m_cart', ['total']),
			...mapState('my_address', ['address']),
			...mapState('m_user', ['token']),
			price(){
				let sum = 0
				this.cart.forEach((item)=>{
					if(item.goods_state) {
						sum += item.goods_count * item.goods_price
					}
				})
				return sum.toFixed(2)
			}
		  },
		  onLoad() {
		  	const re = this.cart.every(item=>item.goods_state)
		  	if(re) {
		  		this.flag = true
		  	}
		  },
		methods: {
			radioChange(index) {
				if(this.cart[index].goods_state) {
					this.cart[index].goods_state = false
					this.saveToStorage(this.cart)
				}else {
					this.cart[index].goods_state = true
					this.saveToStorage(this.cart)
				}
				
				const re = this.cart.every(item=>item.goods_state)
				if(re) {
					this.flag = true
				}else {
					this.flag = false
				}
				
				this.setBadge()
			},
			...mapMutations('m_cart', ['saveToStorage', 'deleteFromCart']),
			...mapMutations('my_address', ['addToAddress']),
			...mapMutations('m_user', ['addToRedi']),
			changeValue(index,e){
				this.cart[index].goods_count = e
				this.saveToStorage(this.cart)
				this.setBadge()
			},
			allRadioChange() {
				if(this.flag) {
					this.cart.forEach((item)=>{
						item.goods_state = false
						this.flag = false
					})
				}else {
					this.cart.forEach((item)=>{
						item.goods_state = true
						this.flag = true
					})
				}
				this.setBadge()
			},
			deleteGoods(id){
				this.deleteFromCart(id)
			},
			chooseAddress() {
				uni.chooseAddress({
					success: (res)=>{
						if(res.errMsg === 'chooseAddress:ok') {
							const name = res.userName
							const phone = res.telNumber
							const addr = res.provinceName + res.cityName + res.countyName +  res.detailInfo
							const info = { name, phone, addr }
							this.addToAddress(info)
						}
					},
					fail(res) {
						console.log(res);
					}
				})
			},
			getMoney() {
				const re = this.cart.every(item=>item.goods_state===false)
				if(re) {
					return uni.showMessage('请选择需要结算的商品!')
				}
				if(JSON.stringify(this.address)==='{}') {
					return uni.showMessage('请选择收货地址!')
				}
				if(!this.token) {
					// return uni.showMessage('请先登录!')
					return this.delaylogin()
				}
				
				// 4. 实现微信支付功能
				  this.payOrder()
			},
			delaylogin() {
				this.seconds = 3
				this.showTip(this.seconds)
				this.timer = setInterval(()=>{
					this.seconds --
					if(this.seconds <= 0) {
						clearInterval(this.timer)
						uni.switchTab({
							url: '/pages/my/my',
							success: ()=>{
								this.addToRedi({
									from: '/pages/cart/cart',
									opentype: 'switchTab'
								})
							}
						})
						return
					}
					this.showTip(this.seconds)
				},1000)
			},
			showTip(n) {
				uni.showToast({
					// 不展示任何图标
					icon: 'none',
					// 提示的消息
					title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
					// 为页面添加透明遮罩，防止点击穿透
					mask: true,
					// 1.5 秒后自动消失
					duration: 1500
				})
			},
			payOrder() {
				const goods = this.cart.filter(x=>x.goods_state)
				uni.showModal({
					title:'提示',
					content:'支付成功!',
					success: ()=>{
						goods.forEach((item)=>{
							this.deleteGoods(item.goods_id)
							this.setBadge()
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #fff;
	}
	.car-container {
		.address {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 200rpx;
		}
		.address2 {
			display: flex;
			flex-direction: column;
			justify-content: center;
			height: 200rpx;
			padding: 0 20rpx;
			font-size: 32rpx;
			.row1 {
				display: flex;
				justify-content: space-between;
				padding: 15rpx 0;
				.phone {
					text {
						padding-right: 10rpx;
					}
				}
			}
		}
		.pic {
			image {
				width: 100%;
			}
		}
		
		.title {
			background-color: #fff;
			border-bottom: 1px #efefef solid;
			text {
				font-size: 32rpx;
				padding-left: 10rpx;
			}
			padding: 20rpx 10rpx;
		}
		
		.goods-list {
			padding-bottom: 100rpx;
			.goods {
				display: flex;
				border-bottom: 1px #efefef solid;
				.left {
					display: flex;
					align-items: center;
					image {
						width: 300rpx;
						height: 300rpx;
					}
				}
				
				.right {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					margin-right: 10rpx;
					.name {
						font-size: 28rpx;
					}
					.price-count {
						display: flex;
						justify-content: space-between;
						.price {
							font-size: 30rpx;
							color: #c00000;
						}
						
					}
				}
			}
		}
		
		.all-price {
			display: flex;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			border-top: 1px #efefef solid;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			font-size: 30rpx;
			background-color: #fff;
			.price {
				color: #c00000;
			}
			.btn {
				width: 200rpx;
				
				button {
					color: #fff;
					background-color: #c00000;
				}
			}
			
		}
	}
	
	.car-null {
		display: flex;
		flex-direction: column;
		// justify-content: center;
		align-items: center;
		padding-top: 400rpx;
		image {
			width: 200rpx;
			height: 200rpx;
		}
		
		text {
			margin-top: 20rpx;
			font-size: 24rpx;
			color: gray;
		}
	}
</style>
