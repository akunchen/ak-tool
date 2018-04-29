<template>
    <div id="app" class="container-fluid">
        <router-view/>
    </div>
</template>

<script>
  export default {
    name: 'electron-vue-starter'
  }
</script>

<style lang="less" rel="stylesheet/less">
    /*@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');*/
    @import "~bootstrap/dist/css/bootstrap.css";

    #app {
        padding-left: 0;
        padding-right: 0;
    }
</style>
