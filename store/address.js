export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // { name, phone, address }
    address: JSON.parse(uni.getStorageSync('address') || '{}')
  }),

  // 模块的 mutations 方法
  mutations: {
	  addToAddress(state, address) {
		  state.address = address
			   this.commit('my_address/saveToStorage')
	      },
		  saveToStorage(state) {
		     uni.setStorageSync('address', JSON.stringify(state.address))
		  }
  },

  // 模块的 getters 属性
  getters: {

  },
}