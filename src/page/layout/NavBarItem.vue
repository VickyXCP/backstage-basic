<template>
  <el-submenu v-if="item.child && item.child.length" :index="navIndex">
    <!--创建父级菜单-->
    <template slot="title"><i v-if="item.icon" class="item.icon"></i>{{item.name}} </template>
  </el-submenu>
</template>

<script>
  export default {
    name: 'NavBarItem',
    props:['item', 'navIndex']
  }
</script>

<style scoped>

</style>
