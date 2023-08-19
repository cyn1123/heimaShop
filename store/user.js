export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
	token: uni.getStorageSync('token') || '',
	// 重定向的 object 对象 { openType, from }
	redirectInfo: null
  }),

  // 模块的 mutations 方法
  mutations: {
	  addToUserinfo(state, userinfo) {
		  state.userinfo = userinfo
		  this.commit('m_user/saveToStorage')
	      },
	  addToToken(state, token) {
		  state.token = token
		  uni.setStorageSync('token', state.token)
	    },
	  addToRedi(state, info) {
		state.redirectInfo = info  
	  },
	  saveToStorage(state) {
		 uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
	  }
  },

  // 模块的 getters 属性
  getters: {

  },
}