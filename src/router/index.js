import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () =>
      import ('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () =>
    import ('@/views/login/index'),
  hidden: true
},
{
  path: '/auth-redirect',
  component: () =>
    import ('@/views/login/auth-redirect'),
  hidden: true
},
{
  path: '/404',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/error-page/404'),
    hidden: true,
    name: '404',
    meta: { title: '404', noCache: true }
  }]
},
{
  path: '/401',
  component: () =>
    import ('@/views/error-page/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/home',
  children: [{
    path: 'home',
    component: () =>
      import ('@/views/home/index'),
    name: 'Home',
    meta: { title: '首页', icon: 'el-icon-s-home', affix: true }
  }]
}
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
  path: '/admin',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/admin/index'),
    name: 'Admin',
    meta: { title: '管理员', icon: 'user', noCache: true, roles: ['superAdmin'] }
  }]
},

{
  path: '/user',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/user/index'),
    name: 'Users',
    meta: { title: '用户', icon: 'peoples', noCache: true }
  }]
},

{
  path: '/order',
  component: Layout,
  meta: { title: '订单', icon: 'el-icon-s-order', noCache: true },
  children: [{
    path: 'in',
    component: () =>
      import ('@/views/order/in'),
    name: 'Order',
    meta: { title: '充值', icon: 'top-up', noCache: true }
  }, {
    path: 'out',
    component: () =>
      import ('@/views/order/out'),
    name: 'Order',
    meta: { title: '提现', icon: 'withdrawal', noCache: true }
  }]
},

{
  path: '/address',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/address/index'),
    name: 'Address',
    meta: { title: '钱包', icon: 'wallet', noCache: true }
  }]
},

{
  path: '/bot',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/bot/index'),
    name: 'Bot',
    meta: { title: '机器人', icon: 'bot', noCache: true }
  }]
},

{
  path: '/accountRecord',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/accountRecord/index'),
    name: 'AccountRecord',
    meta: { title: '流水记录', icon: 'el-icon-notebook-1', noCache: true }
  }]
},

{
  path: '/playRecord',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/playRecord/index'),
    name: 'PlayRecord',
    meta: { title: '投注记录', icon: 'el-icon-data-line', noCache: true }
  }]
},

{
  path: '/group',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/group/index'),
    name: 'Group',
    meta: { title: '彩票群设置', icon: 'component', noCache: true }
  }]
},

{
  path: '/service',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/service/index'),
    name: 'Service',
    meta: { title: '客服设置', icon: 'service', noCache: true }
  }]
},

{
  path: '/dapp',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/dapp/index'),
    name: 'Dapp',
    meta: { title: 'Dapp设置', icon: 'dapp', noCache: true }
  }]
},

{
  path: '/privateKey',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/privateKey/index'),
    name: 'PrivateKey',
    meta: { title: '私钥设置', icon: 'key', noCache: true }
  }]
},

// 404 page must be placed at the end !!!
{ path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
