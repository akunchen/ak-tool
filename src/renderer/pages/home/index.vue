<template>
    <div id="wrapper">
        <main>
            <index-menu class="home-index-menu"/>
            <router-view class="home-index-content"/>
        </main>
    </div>
</template>

<script>
  import IndexMenu from './menu'

  export default {
    data () {
      return {
        text: 'reading'
      }
    },
    name: 'landing-page',
    components: {
      IndexMenu
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style scoped lang="less">
    @import "../../assets/lesses/home";
</style>
