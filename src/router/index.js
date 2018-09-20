import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import Auth from '../util/auth'
import store from '../store'
import staticRoute from './staticRoute'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: staticRoute
})
export default router
