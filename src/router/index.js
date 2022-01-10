import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Default',
    component: () => import('../views/Index.vue'),
    redirect: '/index/book',
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: () => import('../views/UserLogin.vue')
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../views/Index.vue'),
    children: [{
        path: "book",
        name: "BookIndex",
        component: () => import('../views/userpage/BookPage.vue')
      },
      {
        path: "user/borrowinfo",
        name: "BookIndex",
        component: () => import('../views/userpage/UserBorrowInfo.vue')
      },

    ],
  },
  {
    path: '/merchant/login',
    name: 'MerchantLogin',
    component: () => import('../views/MerchantLogin.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/UserRegister.vue')
  },
]


const router = new VueRouter({
  routes
})

export default router