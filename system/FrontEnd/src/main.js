import Vue from 'vue'
import App from './App.vue'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// the style of vue drag and drop dialog
import 'vue-dialog-drag/dist/vue-dialog-drag.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

// Vue.prototype.$axios = axios
window.baseURL = ""
// if (process.env.NODE_ENV === 'production') {
//   // axios.defaults.baseURL = process.env.API_ROOT
//   axios.defaults.baseURL = "http://go-tree.info/api"
//   window.baseURL = "http://go-tree.info/api"
//   // 在production的模式下需要增加前缀
//   // window.baseURL = "http://vis.pku.edu.cn/gotree_server"
// }

Vue.use(VueAxios, axios)

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.config.productionTip = false


import * as d3 from "d3"
window.d3 = d3

import * as $ from 'jquery'
window.$ = $

window.exports = {}

window.disableUpload = false

import './assets/icon_font/iconfont.css'

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
