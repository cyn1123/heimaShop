<template>
	<view>
		<view class="search">
			<uni-search-bar @input="input" :radius="100" bg-color="#fff" cancelButton="none" focus="true"></uni-search-bar>
		</view>
		
		<view class="history-box" v-if="searchResult.length === 0">
			<view class="header">
				<view class="name">搜索历史</view>
				<uni-icons type="trash" size="25" @click="clean"></uni-icons>
			</view>
			
			<view class="body">
				<uni-tag :text="item" v-for="(item,index) in historys" :key="index" inverted="true" @click="gotoGoodsList(item)"></uni-tag>
			</view>
			
		</view>
		
		<view class="search-list" v-else>
			<view class="item" v-for="(item,index) in searchResult" :key="index" @click="gotoDetail(item)">
				<view class="name">{{ item.goods_name }}</view>
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				// 搜索关键词
				kw: '',
				// 搜索结果
				searchResult: [],
				// 搜素历史数据
				searchHistory: []
			};
		},
		methods: {
			input(e){
				// 清除  timer 延时器
				clearTimeout(this.timer)
				// 重新启动一个延时器
				this.timer = setTimeout(()=>{
					this.kw = e
					this.getSearchResult()
				},500)
			},
			getSearchResult(){
				if(this.kw === '') {
					this.searchResult = []
					return
				}
				uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw }).then((res)=>{
					if(res.data.meta.status !== 200) return uni.showMessage()
					this.searchResult = res.data.message
				})
				this.getHistory()
			},
			gotoDetail(item){
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			getHistory(){
				const set = new Set(this.searchHistory)
				set.delete(this.kw)
				set.add(this.kw)
				this.searchHistory = Array.from(set)
				// 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
				uni.setStorageSync('kw', JSON.stringify(this.searchHistory))
			},
			clean(){
				this.searchHistory = []
				// 清空本地存储中记录的搜索历史
				uni.setStorageSync('kw', '[]')
			},
			gotoGoodsList(item){
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + item
				})
			}
		},
		onLoad() {
		  this.searchHistory = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		computed: {
		  historys() {
		    // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
		    // 而是应该新建一个内存无关的数组，再进行 reverse 反转
		    return [...this.searchHistory].reverse()
		  }
		}
	}
</script>

<style lang="less">
	.search {
		position: sticky;
		top: 0;
		z-index: 999;
		
	}
	
	.search-list {
		padding: 0 15rpx;
		.item {
			display: flex;
			border-bottom: 1px #efefef solid;
			padding: 26rpx 0;
			justify-content: space-between;
			.name {
				font-size: 25rpx;
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 6rpx;
			}
		}
	}
	
	.history-box {
		.header {
			display: flex;
			justify-content: space-between;
			border-bottom: 3px #efefef solid;
			padding: 20rpx 10rpx;
			.name {
				font-size: 28rpx
			}
		}
		
		.body {
			display: flex;
			flex-wrap: wrap;
			margin-top: 10rpx;
			uni-tag {
				font-size: 25rpx;
				margin: 10rpx 10rpx;
			}
		}
	}
</style>
