<template>
	<view class="login-container">
		<view class="login" v-if="token===''">
			<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
			<button type="primary" @click="getUserProfile">一键登录</button>
			<text>登录后尽享更多权益</text>
		</view>
		
		<view class="user" v-else>
			<view class="img">
				<image :src="userinfo.avatarUrl"></image>
				<text>{{ userinfo.nickName }}</text>
			</view>
			
			<view class="box">
				<view class="box1">
					<view class="item">
						<text>8</text>
						<text>收藏的店铺</text>
					</view>
					<view class="item">
						<text>18</text>
						<text>收藏的商品</text>
					</view>
					<view class="item">
						<text>14</text>
						<text>关注的店铺</text>
					</view>
					<view class="item">
						<text>84</text>
						<text>足迹</text>
					</view>
				</view>
				
				<view class="box2">
					<view class="title">
						<text>我的订单</text>
					</view>
					<view class="body">
						<view class="item">
							<image src="/static/my-icons/icon1.png"></image>
							<text>待付款</text>
						</view>
						<view class="item">
							<image src="/static/my-icons/icon2.png"></image>
							<text>待收货</text>
						</view>
						<view class="item">
							<image src="/static/my-icons/icon3.png"></image>
							<text>退款/退货</text>
						</view>
						<view class="item">
							<image src="/static/my-icons/icon4.png"></image>
							<text>全部订单</text>
						</view>
					</view>
				</view>
				
				<view class="box3">
					<view class="item">
						<text>收货地址</text>
						<uni-icons type="forward" size="18"></uni-icons>
					</view>
					<view class="item">
						<text>联系客服</text>
						<uni-icons type="forward" size="18"></uni-icons>
					</view>
					<view class="item" @click="logout">
						<text>退出登录</text>
						<uni-icons type="forward" size="18"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	import { mapState, mapMutations, mapGetters } from 'vuex'
	export default {
		// 将 badgeMix 混入到当前的页面中进行使用
		mixins: [badgeMix],
		data() {
			return {
				
			};
		},
		computed: {
			...mapState('m_user', ['userinfo', 'token','redirectInfo']),
		},
		methods: {
			...mapMutations('m_user', ['addToUserinfo', 'addToToken','addToRedi']),
			...mapMutations('my_address', ['addToAddress']),
			getUserProfile() {
				uni.getUserProfile({
					desc: '你的授权信息',
					success: (res)=>{
						this.addToUserinfo(res.userInfo)
						this.getToken(res)
					},
					fail : (res)=>{
						if(res.errMsg === 'getUserProfile:fail auth deny') return uni.showMessage('您取消了登录授权!')
					}
				})
			},
			getToken(info){
				uni.login({
					success: (res)=> {
						if(res.errMsg === 'login:ok') {
							// const query = {
							// 	code: res.code,
							// 	encryptedData: info.encryptedData,
							// 	iv: info.iv,
							// 	rawData: info.rawData,
							// 	signature: info.signature
							// }
							// uni.$http.post('/api/public/v1/users/wxlogin', query).then((res)=>{
							// 	console.log(res);
							// })
							const token1 = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o'
							this.addToToken(token1)
							this.navigateBack()
						}else {
							return uni.showMessage('登录失败!')
						}
					},
					fail: (res)=> {
						return uni.showMessage('登录失败!' + res)
					}
				})
			},
			logout(){
				uni.showModal({
					title: '提示',
					content: '请确认退出登录!',
					success: (res)=>{
						if(res.errMsg === 'showModal:ok') {
							if(res.cancel === true) return
							if(res.confirm === true) {
								this.addToUserinfo({})
								this.addToToken('')
								this.addToAddress({})
							}
						}
					}
				})
			},
			navigateBack(){
				if(this.redirectInfo != null && this.redirectInfo.opentype === 'switchTab') {
					uni.switchTab({
						url: this.redirectInfo.from,
						// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
						complete: () => {
							this.addToRedi(null)
					  }
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.login-container {
		.login {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding-top: 300rpx;
			
			button {
				width: 80%;
				height: 100rpx;
				background-color: #c00000;
				margin: 20rpx 0;
				border-radius: 50rpx;
				font-size: 34rpx;
				line-height: 100rpx;
			}
			
			text {
				color: #AFAFAF;
				font-size: 24rpx;
			}
		}
		
		.user {
			.img {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				background-color: #c00000;
				height: 400rpx;
				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 100rpx;
					border: 3px solid #fff;
					margin-bottom: 20rpx;
				}
				
				text {
					color: #fff;
					font-weight: 700;
					font-size: 38rpx;
				}
			}
			
			.box {
				position: relative;
				top: -20rpx;
				width: 90%;
				margin: 0 auto;
				.box1 {
					display: flex;
					justify-content: space-around;
					align-items: center;
					height: 100rpx;
					background-color: #fff;
					margin-bottom: 20rpx;
					border-radius: 10rpx;
					.item {
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						align-items: center;
						font-size: 28rpx;
					}
				}
				
				.box2 {
					background-color: #fff;
					margin-bottom: 20rpx;
					border-radius: 10rpx;
					.title {
						height: 80rpx;
						border-bottom: #efefef 1px solid;
						font-size: 32rpx;
						line-height: 80rpx;
						padding-left: 20rpx;
					}
					
					.body {
						display: flex;
						justify-content: space-around;
						align-items: center;
						height: 180rpx;
						.item {
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							image {
								width: 80rpx;
								height: 80rpx;
								margin-bottom: 10rpx;
							}
							text {
								font-size: 28rpx;
							}
						}
					}
				}
				
				.box3 {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					height: 250rpx;
					background-color: #fff;
					border-radius: 10rpx;
					.item {
						display: flex;
						justify-content: space-between;
						padding: 0 20rpx;
						font-size: 32rpx;
					}
				}
			}
		}
	}
</style>
