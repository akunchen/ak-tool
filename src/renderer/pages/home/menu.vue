<template>
    <div class="home-menu-container">
        <div class="panel-group">
            <div class="panel" v-for="menu in menus">
                <div class="panel-heading" @click="toggleMenu(menu)">
                    <div class="panel-title">
                        <div class="panel-toggle">{{menu.name}}</div>
                    </div>
                </div>
                <div class="panel-collapse collapse" :class="menu.showClass" v-if="menu.items && menu.items.length > 0">
                    <div class="panel-body">
                        <ul class="list-group">
                            <li class="list-group-item" v-for="item in menu.items" @click="link(item)">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        text: 'unread',
        menus: [
          {
            name: '数据库',
            showClass: 'in',
            items: [
              {name: '列表', url: '/databases'},
              {name: '新建', url: '/database'}
            ]
          }
        ]
      }
    },
    async created () {
    },
    methods: {
      toggleMenu (menu) {
        menu.showClass = menu.showClass ? '' : 'in'
      },
      link (item) {
        this.$router.push(item.url)
      }
    }
  }
</script>

<style scoped lang="less">
    @import "../../assets/lesses/home";
</style>