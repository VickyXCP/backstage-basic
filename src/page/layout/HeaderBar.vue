<template>
  <div class="sys-header">
    <div class="logo">
      <slot name="logo"></slot>
    </div>
    <slot name="topnav"/>
    <div class="userInfo">
      <ul>
        <li>
          <el-dropdown @command="userOperation">
            <span class="user">{{username}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="editPaw">{{$t('global.editpassword')}}</el-dropdown-item>
              <el-dropdown-item command="logout">{{$t('global.logout')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>
          <span class="lang" :class="{cur: lang=='zhCN'}" @click="changeLang('zhCN')">中</span>
          <span class="lang" :class="{cur: lang=='en'}" @click="changeLang('en')">EN</span>
        </li>
      </ul>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialog.editPaw.show" :modal-append-to-body="false" custom-class="editPawDialog">
      <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px">
        <el-form-item label="旧密码" prop="oldPaw">
          <el-input v-model="editPaw.oldPaw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPaw">
          <el-input v-model="editPaw.newPaw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPaw">
          <el-input v-model="editPaw.confirmNewPaw" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="textC">
        <el-button type="primary" @click="editPawSubmit">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {Message} from 'element-ui'
  export default {
    name: 'HeaderBar',
    data () {
      return {
        dialog: {
          editPaw: {
            show: false
          }
        },
        editPaw: {
          oldPaw: '',
          newPaw: '',
          confirmNewPaw: ''
        },
        editPawRules: {
          oldPaw: [{required: true, message: '请输入旧密码', trigger: 'blur'}],
          newPaw: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 8, max: 12, message: '长度在8-20个字符之间', trigger: 'blur'},
            {
              validator (rule, value, callback, source, options) {
                var errors = []
                if (! /^[a-z0-9]+$/.test(value)) {
                  Message({
                    message: '不符合输入规则'
                  })
                  errors.push('请输入字母或特殊字符')
                }
                callback(errors)
              }
            }
          ],
          confirmNewPaw:[
            {required: true, message: '请再次输入新密码', trigger: 'blur'},
            {min: 8, max: 12, message: '长度在8-20个字符之间', trigger: 'blur'},
            {
              validator (rule, value, callback, source, options) {
                var errors = []
                if (! /^[a-z0-9]+$/.test(value)) {
                  Message({
                    message: '不符合输入规则'
                  })
                  errors.push('请输入字母或特殊字符')
                }
                callback(errors)
              }
            }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        username: state=>state.user.name,
        lang: state=>state.lang
      })
    },
    methods:{
      ...mapActions({
        sysLogout: 'auth/logout',
        loadLang: 'loadLang'
      }),
      changeLang(val){
        if (val == this.lang) return
        this.loadLang(val).then(()=>{
          window.location.reload()
        })
      },
      userOperation(command){
        switch (command) {
          case 'logout':
            this.logout();
            break;
          case 'editPaw':
            this.dialog.editPaw.show = true
            break
        }
      },
      logout(){
        this.sysLogout().then(()=>{
          this.$router.push('/login')
        })
      },
      editPawSubmit(){
        this.$refs.editPaw.validate((valid)=>{
          Message({
            type: 'success',
            message: '编辑成功'
          })
          this.dialog.editPaw.show = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
