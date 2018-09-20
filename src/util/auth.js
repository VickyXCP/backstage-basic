import Cookies from 'js-cookie'
const authToken = {
  //当token超时时采取何种策略
  //jumpAuthPage 每次请求时判断token是否超时，若超时则跳转授权页面
  //getNewToken  每次请求判断token是否超时，若超时则获取新token
  tokenTimeoutMethod: 'getNewToken',
  //在cookie中记录登录状态的key
  loginKey: 'isLogin',
  //token是否超时
  hasToken(){
    return Cookies.get('token')
  },
  //当前是否是登录状态
  isLogin(){
    return Cookies.get(this.loginKey)
  },
  //设置token
  setToken(token){
    //TODO ：设置token，并填写有效日期
    var maxAge = new Date(new Date().getTime() + 30 * 1000)
    Cookies.set('token', token, {
      expires: maxAge
    })
  },
  //设置登录状态
  setLoginStatus(){
    //TODO: 设置超时登录时间，在该时间范围内没有任何请求操作则自动删除
    console.log('登录状态最长时间更新')
    var maxAge = new Date(new Date().getTime() + 30*60*1000)
    Cookies.set(this.loginKey, 'true', {
      expires: maxAge
    })
  },
  //移除token
  removeToken(){
    Cookies.remove('token')
  },
  //移除登录状态
  removeLoginStatus(){
    Cookies.remove(this.loginKey)
  }
}

export default authToken
