import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Default',
    component: ()=>import('../views/UserLogin.vue')
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: ()=>import('../views/UserLogin.vue')
  },
  {
    path: '/index',
    name: 'Index',
    component: ()=>import('../views/Index.vue')
  },
  {
    path: '/merchant/login',
    name: 'MerchantLogin',
    component: ()=>import('../views/MerchantLogin.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
