/*
 *路由懒加载
 * https://router.vuejs.org/zh/guide/advanced/lazy-loading.html
 */

const Layout = () => import(/* webpackChunkName: 'index' */ '../page/layout')

const staticRoute = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: ()=>import(/* webpackChunkName: 'login' */ '../page/login')
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '',
        component: ()=>import(/* webpackChunkName: 'home' */ '../page/home')
      }
    ]
  }
]

export default staticRoute
