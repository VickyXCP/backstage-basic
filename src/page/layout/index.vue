<template>
  <div class="wrapper">
    <template v-if="layout == 'left'">
      <header-bar v-once>
        <p slot="logo">VueJs模板系统</p>
      </header-bar>
    </template>
    <template v-if="layout == 'top'">
      <header-bar>
        <!--<p slot="logo">VueJs模板系统</p>-->
        <p slot="logo">模板系统</p>

        <template slot="topnav">
          <nav-bar :layout="layout"/>
        </template>
      </header-bar>
    </template>
    <div class="sys-content" :class="layout">
      <tag-nav></tag-nav>
      <keep-alive :include="tagNavList">
        <router-view/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import HeaderBar from './HeaderBar'
  import NavBar from './NavBar'
  import TagNav from './TagNav'
  export default {
    name: 'index',
    components:{
      HeaderBar,
      NavBar,
      TagNav
    },
    computed:{
      layout(){
        return this.$store.state.navbarPosition
      },
      tagNavList(){
        return this.$store.state.tagNav.cachedPageName
      }
    }
  }
</script>

<style scoped>

</style>
