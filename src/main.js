import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TDesign from 'tdesign-vue';
import 'tdesign-vue/es/style/index.css';
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(TDesign)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')