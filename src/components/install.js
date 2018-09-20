//注册全局组件
import Vue from 'vue'

import AppNotes from './AppNotes'
import AppSearch from './AppSearch'
import AppSection from './AppSection'
import AppTitle from './AppTitle'
import AppToolbar from './AppToolbar'
import TableMixin from './TableMixin'

const components = [
  AppToolbar,
  AppTitle,
  AppSection,
  AppSearch,
  AppNotes,
  TableMixin
]

components.map((component) => {
  Vue.component(component.name, component)
})

export default Vue
