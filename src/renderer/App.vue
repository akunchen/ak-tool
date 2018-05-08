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
    .el-upload__input {
        display: none !important;
    }

    #app {
        padding-left: 0;
        padding-right: 0;
    }
</style>
