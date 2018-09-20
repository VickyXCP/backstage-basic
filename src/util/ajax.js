/*
 *axios 全局配置
 * TODO：拦截器全局配置，根据实际情况修改
 */

import axios from 'axios'
import store from '../store'
import router from '../router'
import {Message} from 'element-ui'
import Auth from '../util/auth'

var getTokenLock = false, CancelToken = axios.CancelToken, requestList = []

/*
 *Token校验
 * @param {function} cancel - 中断函数
 * @param {function} callback - 回调
 * @description 校验token是否过期，如果token过期则根据配置采用不同方法获取新token
 * 自动获取token： 过期时自动调用获取token接口  （注意： 当有任一请求在获取token时，其余请求将顺延，直至新token获取完毕）
 * 跳转授权token： 过期时中断所有当前请求并跳转到对应页面获取token（注意： 跳转页面授权最佳实现应在授权页面点击触发）
 */

function checkToken (cancel, callback) {
  if (Auth.hasToken()) {
    //自动获取Token
    if (Auth.tokenTimeoutMethod == 'getNewToken') {
      //如果当前有请求正在获取token
      if (getTokenLock) {
        setTimeout(function () {
          checkToken(cancel, callback)
        }, 500)
      } else {
        getTokenLock = true
        store.dispatch('auth/getNewToken').then(() => {
          console.log('已获取新token')
          callback()
          getTokenLock = false
        })
      }
    }
    
    //  跳转授权Token
    if(Auth.tokenTimeoutMethod == 'jumpAutnPage' && Auth.isLogin()){
      if(router.currentRoute.path != './auth'){
      //  Bug: 无法保证一定中断所有请求
        cancel()
        router.push('/auth')
      }
    }
  }else {
    callback()
  }
}


/*
 *阻止短时间内的重复请求
 * @param {string} url - 当前请求地址
 * @param {function} c - 中断请求函数
 * @description 每个请求发起前先判断当前请求是否存在于requestList中，
 *              如果存在则取消该次请求，如果不存在则加入requestList中
 *              当请求完成后500ms，清除requestList中对应的该请求
 */

function stopRepeatRequest(url, callback){
  for (let i=0; i<requestList.length; i++){
    if(requestList[i] == url){
      callback()
      return
    }
  }
  requestList.push(url)
}

// 超时设置
const service = axios.create({
  //请求超时时间
  timeout: 5000
})

//baseURL
//axios.defaults.baseURL = 'http://api.github.com

//http request 拦截器
//每次请求都为HTTP头添加Authorization字段，其内容为token

service.interceptors.request.use(
  config=>{
    let cancel
    config.cancelToken = new CancelToken(function executor(callback){
      cancel = callback
    })
    checkToken(cancel, ()=>{
      Auth.setLoginStatus()
      config.headers.Authorization = `${store.state.user.token}`
    })
    stopRepeatRequest(config.url, cancel)
    return config
  },
  err =>{
    return Promise.reject(err)
  }
)
//http response 拦截器
//根据响应代码确认跳转到对应页面
service.interceptors.response.use(
  response=>{
    for (let i=0; i<requestList.length;i++){
      if(requestList[i]==response.config.url){
      //  注意，不能保证500ms内必定执行，异步机制
        setTimeout(function(){
          requestList.splice(i,1)
        }, 500)
        break
      }
    }
    return Promise.resolve(response.data)
  },
  error => {
    if(axios.isCancel(error)){
      console.log(error)
      return Promise.reject('Ajax Abort: 该请求在axios拦截器中被中断')
    }else if (error.response){
      switch (error.response.status) {
        case 401:
          router.push('error/401')
          break
        case 403:
          router.push('error/402')
          break
        default:
          Message({
            message: `服务器错误！错误代码：${error.response.status}`,
            type: 'error'
          })
      }
      return Promise.reject(error.response.data)
    }
  }
)

export default service
