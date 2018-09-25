import Vue from 'vue'
import VueRouter from 'vue-router'
//页面渲染的进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {Message} from 'element-ui'
import Auth from '../util/auth'
import store from '../store'
import staticRoute from './staticRoute'
import whiteList from './whiteList'

var permissionList = []

function initRoute(router){
  return new Promise(resolve => {
    if(permissionList.length == 0){
      Message({
        message:'没有权限数据，正在获取'
      })
      store.dispatch('auth/getNavList').then(()=>{
        store.dispatch('auth/getPermissionList').then((res)=>{
          Message({
            message:'权限列表生成完毕'
          })
          permissionList = res
          res.forEach((v)=>{
            let routeItem = router.match(v.path)
            if (routeItem){
              routeItem.meta.permission = v.permission?v.permission:[]
              routeItem.meta.name = v.name
            }
          })
          resolve()
        })
      })
    }else {
      Message({
        message: '已有权限数据'
      })
      resolve()
    }
  })
}

NProgress.configure({showSpinner: false})

Vue.use(VueRouter)

const router = new VueRouter({
  mode:'hash',
  routes: staticRoute
})

//路由条赚钱验证

router.beforeEach((to,from, next)=>{
  NProgress.start()
  
//  判断用户是否处于登录状态
  if (Auth.isLogin()){
    if (to.path == '/login'){
      next({path: '/home', replace: true})
    }else if (to.path.indexOf('/error')>=0){
      //防止重定向到错误页面造成死循环
      next()
    } else {
      initRoute(router).then(()=>{
        let isPermission = false
        Message({
          message: '进入权限判断'
        })
        permissionList.forEach((v)=>{
        //  判断跳转页面是否在权限列表中
          if (v.path == to.fullPath){
            isPermission = true
          }
        })
      //  没有权限时调到401页面
        if(!isPermission){
          next({path: '/error/401', replace: true})
        }else {
          next()
        }
      })
    }
  }else {
  //  判断是否是免登录页面，如果是直接进去，不是跳到登录页
    if (whiteList.indexOf(to.path)>=0){
      Message({
        message: '该页面无需登录即可访问'
      })
      next()
    } else {
      Message({
        message: '当前处于未登录状态，请登录'
      })
      next({path: '/login', replace: true})
    //  如果store中有token，同时cookie中没有登录状态
      
      if (store.state.user.token){
        Message({
          message: '登录超时，请重新登录'
        })
      }
      NProgress.done()
    }
  }
})

//路由跳转完成后
router.afterEach(()=>{
  NProgress.done()
})

export default router
