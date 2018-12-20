import Vue from 'vue'
// 清除浏览器默认的样式
import 'normalize.css'

import App from './App.vue'
import router from './router/router'
import store from './store/store'
import axios from './plugins/axios/index'
import apiUrl from './api/axios'
import './components/tooltip/index'

Vue.use(axios, apiUrl, {
  baseUrl: 'localhost:8080/'
})
// import axios from 'axios'
/* import VuePreview from 'vue-preview'
import VueTouch from 'vue-touch' */

/* VueTouch.registerCustomEvent('doubletap', {
  type: 'tap',
  taps: 2
})
Vue.use(VueTouch, { name: 'v-touch' })

Vue.use(VuePreview, {
  mainClass: 'pswp--minimal--dark',
  barsSize: { top: 0, bottom: 0 },
  captionEl: false,
  fullscreenEl: false,
  shareEl: false,
  tapToClose: true,
  tapToToggleControls: false
}) */
// axios是一个基于promise的HTTP库，
// baseurl 将自动加在URL前面，除非URL是一个绝对URL
// axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://192.168.118.226:50053' : ''
// axios.defaults.baseURL = ''
// Vue.prototype.$ajax = axios

// Vue.config.productionTip = false // 设置为false以阻止vue在启动时生成生产提示
// window.vue = Vue

// 注册或获取全局过滤器
Vue.filter('first', function (v) {
  return v + 1
})

window.T = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
