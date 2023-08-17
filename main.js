
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 1. 导入 store 的实例对象
import store from './store/store.js'

import { $http } from '@escook/request-miniprogram'
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

uni.showMessage = function(title='数据请求失败!', duration=1000) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	// 2. 将 store 挂载到 Vue 实例上
	store,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
  }
}
// #endif