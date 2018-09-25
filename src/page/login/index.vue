<template>
  <div class="sys-login">
    <div class="login-area">
      <div class="logo">
        <img src="~sysStatic/images/logo.png" alt="">
      </div>
      <div class="form-group">
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px">
          <el-form-item prop="name">
            <el-input v-model="loginForm.name" type="text" :placeholder="$t('global.username')"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" :placeholder="$t('global.password')"></el-input>
          </el-form-item>
          <el-form-item prop="captcha" class="captcha.show" v-if="captcha.show">
            <img :src="captcha.src" alt="">
            <el-input v-model="loginForm.captcha" type="text" :placeholder="$t('global.captcha')"/>
          </el-form-item>
          <p class="textR">{{$t('global.forgetPassword')}}</p>
          <a class="btn-login" type="primary" @click="submitForm">{{$t('global.login')}}</a>
        </el-form>
        <div v-if="sysMsg">{{sysMsg}}</div>
      </div>
      <div class="lang-toggle">
        <span :class="{cur: lang == 'zhCN'}" @click="changeLang('zhCN')">中</span>
        <span :class="{cur: lang == 'en'}" @click="changeLang('en')">En</span>
      </div>
      <div class="lang-toggle">
        <span :class="{cur: theme =='theme-default'}" @click="changeTheme('theme-default')">浅</span>
        <span :class="{cur: theme =='theme-dark'}" @click="changeTheme('theme-dark')">深</span>
      </div>
      <div class="tip">
        <p>{{$t('global.loginTip')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import setTheme from '../../util/setTheme'

  export default {
    name: 'login',
    data () {
      return {
        loginForm: {
          name: '',
          password: '',
          captcha: ''
        },
        loginRules: {
          name: [
            {required: true, message: '', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '', trigger: 'blur'}
          ],
          captcha: [
            {required: false, message: '', trigger: 'blur'}
          ]
        },
        captcha: {
          show: false,
          src: ''
        },
        sysMsg: ''
      }
    },
    computed: {
      ...mapState({
        lang: state => state.lang,
        theme: state => state.theme
      })
    },
    watch: {
      'captcha.show' (val) {
        this.loginRules.captcha[0].required = val
      }
    },
    beforeMount () {
      //  初始化错误信息。保证单数点击input时可以弹出正确的错误提示
      this.setErrMsg()
    },
    methods: {
      ...mapActions({
        login: 'auth/loginByEmail',
        loadLang: 'loadLang'
      }),
      submitForm () {
        /*validate
        *对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束
        * 后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回
        * 调函数，则会返回一个 promise
        */
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.login({
              name: this.loginForm.name,
              password: this.loginForm.password
            }).then(res => {
              // console.log(123)
              console.log(res)
              if(res.login){
                this.$router.push('home')
              } else {
                this.sysMsg = res.message
                this.captcha.show = true
                this.captcha.src = res.captcha
              }
            })
          } else {
            return false
          }
        });
      },
      changeLang(val){
        if (val == this.lang){
          return
        }
        this.loadLang(val).then(()=>{
          this.setErrMsg()
          //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
          this.$refs.loginForm.resetFields()
        })
      },
      changeTheme(val){
        if (val == this.theme) return
        setTheme(val)
        this.$store.commit('setThemeColor', val)
      },
      setErrMsg(){
        this.loginRules.name[0].message = this.$t('global.errMsg.inputRequired', {cont: this.$t('global.username')})
        this.loginRules.password[0].message = this.$t('global.errMsg.inputRequired', {cont: this.$t('global.password')})
        this.loginRules.captcha[0].message = this.$t('global.errMsg.inputRequired', {cont: this.$t('global.captcha')})
      }
    }
  }
</script>

<style scoped>

</style>
