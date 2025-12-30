import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/index/HomeView.vue'
import ww from '../views/Administrator/ww.vue'
import Button from '../views/button/button.vue'
import Swiper3 from '../views/index/Swiper3.vue'
import Swiper from '../views/index/Swiper.vue'
import Swiper2 from '../views/index/Swiper2.vue'
import Search2 from '../views/index/Search2.vue'
import Cultural from '../views/Cultural.vue'
import Clothes from '../views/clothes.vue'
import Manageexhibitions from '../views/Manageexhibitions.vue'
import Search from '../views/Search.vue'
import Coupon from '../views/Coupon.vue'
import My from '../views/My.vue'
import users from '../views/users.vue'
import question from '../views/question.vue'
import personal from '../views/personal.vue'
import jgpy from '../views/jgpy.vue'
import zl from '../views/zl.vue'
import detailed from '../views/detailed.vue'
import CommentPage from '../views/CommentPage.vue'
import Login from '../views/Login.vue'
import Uppwd from '../views/Uppwd.vue'
import Loginout from '../views/Loginout.vue'
import Intercalate from '../views/Intercalate.vue'
import Classification from '../views/Classification.vue'
import GoodList from '../views/GoodList.vue'
import DressResult from '../views/DressResult.vue'
import ShapeIntroduction from '../views/ShapeIntroduction.vue'
import HanfuDetail from '../views/HanfuDetail.vue'
import AddClothes from '../views/AddClothes.vue'
import Vip from '../views/Vip.vue'
// import goodList from '../views/goodList.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Login',
    name: 'LoginPage',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/button',
    name: 'button',
    // component: () => import('../views/button/button.vue')
    component: Button
  },
  {
    path: '/Swiper',
    name: 'Swiper',
    // component: () => import('../views/button/button.vue')
    component: Swiper
  },
  {
    path: '/Swiper3',
    name: 'Swiper3',
    // component: () => import('../views/button/button.vue')
    component: Swiper3
  },
  {
    path: '/Swiper2',
    name: 'Swiper2',
    // component: () => import('../views/button/button.vue')
    component: Swiper2
  },
  {
    path: '/Search2',
    name: 'Search2',
    // component: () => import('../views/button/button.vue')
    component: Search2
  },
  {
    path: '/Intercalate',
    name: 'Intercalate',
    // component: () => import('../views/button/button.vue')
    component:Intercalate
  },{
    path: '/detailed',
    name: 'detailed',
    // component: () => import('../views/button/button.vue')
    component:detailed
  },
  {
    path: '/jgpy',
    name: 'jgpy',
    // component: () => import('../views/button/button.vue')
    component:jgpy
  },
  {
    path: '/Search',
    name: 'Search',
    // component: () => import('../views/button/button.vue')
    component:Search
  },
  {
    path: '/My',
    name: 'My',
    // component: () => import('../views/button/button.vue')
    component:My
  },
  {
    path: '/users',
    name: 'users',
    // component: () => import('../views/button/button.vue')
    component:users
  },
  {
    path: '/question',
    name: 'question',
    // component: () => import('../views/button/button.vue')
    component:question
  },
  {
    path: '/Coupon',
    name: 'Coupon',
    // component: () => import('../views/button/button.vue')
    component:Coupon
  },
  {
    path: '/Manageexhibitions',
    name: 'Manageexhibitions',
    // component: () => import('../views/button/button.vue')
    component:Manageexhibitions
  },
  {
    path: '/personal',
    name: 'personal',
    // component: () => import('../views/button/button.vue')
    component:personal
  },
  {
    path: '/zl',
    name: 'zl',
    // component: () => import('../views/button/button.vue')
    component:zl
  },
  {
    path: '/CommentPage',
    name: 'CommentPage',
    // component: () => import('../views/button/button.vue')
    component:CommentPage
  },
  {
    path: '/Classification',
    name: 'Classification',
    // component: () => import('../views/button/button.vue')
    component:Classification
  },
  {
    path: '/add-clothes',
    name: 'AddClothes',
    component: AddClothes
  },
  {
    path: '/goodlist/:id',
    name: 'goodlist',
    // 通过路由传参
    props:true,
    component: GoodList,
    // 源信息
    meta: { title: '商品列表' }
  },
  // {
  //   path: '/goodList',
  //   name: 'goodList',
  //   // component: () => import('../views/button/button.vue')
  //   component:goodList
  // },
  {
    path: '/clothes',
    name: 'Clothes',
    // component: () => import('../views/button/button.vue')
    component:Clothes
  },
  {
    path: '/Cultural',
    name: 'Cultural',
    // component: () => import('../views/button/button.vue')
    component:Cultural
  },
  {
    path: '/Uppwd',
    name: 'Uppwd',
    // component: () => import('../views/button/button.vue')
    component:Uppwd
  },
  {
    path: '/Loginout',
    name: 'Loginout',
    // component: () => import('../views/button/button.vue')
    component:Loginout
  },
  {
    path: '/ww',
    name: 'ww',
    // component: () => import('../views/button/button.vue')
    component:ww
  },
  {
    path: '/vip',
    name: 'Vip',
    component: Vip
  },
  {
    path: '/dress-result',
    name: 'DressResult',
    component: DressResult,
    props: true
  },
  {
    path: '/shape-introduction',
    name: 'ShapeIntroduction',
    component: ShapeIntroduction
  },
  {
    path: '/hanfu-detail',
    name: 'HanfuDetail',
    component: HanfuDetail
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
