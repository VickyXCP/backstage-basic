import Cookies from 'js-cookie'
import axios from '../../../util/ajax'
import Auth from '../../../util/auth'

const state = {
  token: '',
  navList: []
}

const mutations = {
  setNavList: (state, data)=>{
    state.navList = data
  },
  setToken: (state, data)=>{
    if(data){
      Auth.setToken(data)
      Auth.setLoginStatus()
    }else {
      Auth.removeToken()
      Auth.removeLoginStatus()
    }
    state.token = data
  }
}

const actions = {
//  邮箱登录
  loginByEmail({commit}, userInfo){
    return new Promise((resolve)=> {
      axios({
        url: './login',
        method: 'post',
        data:{
          ...userInfo
        }
      }).then(res=>{
        if(res.login){
          commit('setToken', res.token)
          commit('user/serName', res.name,{root: true})
        }
        resolve(res)
      })
    })
  }
  
//  登出

}
