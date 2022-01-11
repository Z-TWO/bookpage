import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Default',
    component: () => import('../views/userpage/Index.vue'),
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
    component: () => import('../views/userpage/Index.vue'),
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
    path: '/register',
    name: 'Register',
    component: () => import('../views/UserRegister.vue')
  },
  {
    path: '/merchant/login',
    name: 'MerchantLogin',
    component: () => import('../views/MerchantLogin.vue')
  },
  {
    path: '/merchant/index',
    name: 'MerchatIndex',
    component: () => import('../views/merchatpage/Index.vue'),
    children: [{
        path: "bookoption",
        name: "BookOption",
        component: () => import('../views/merchatpage/BookOption.vue')
      },
      {
        path: "useroption",
        name: "UserOption",
        component: () => import('../views/merchatpage/UserOption.vue')
      },
      {
        path: "borrowoption",
        name: "BorrowInfoOption",
        component: () => import('../views/merchatpage/BorrowInfoOption.vue')
      },

    ],
  },
]


const router = new VueRouter({
  routes
})

export default router