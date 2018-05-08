<template>
    <el-row class="tac home-menu-container">
        <el-col :span="24">
            <el-menu default-active="2"
                     background-color="#30404f"
                     text-color="#fff"
                     active-text-color="#ffd04b">
                <el-submenu v-for="(menu,index) in menus" :index="'' +index" :key="'' +index">
                    <template slot="title">
                        <i :class="menu.iconClass"></i>
                        <span>{{menu.name}}</span>
                    </template>
                    <router-link v-for="(item,itemIndex) in menu.items" :to="item.url" :key="item.url">
                        <el-menu-item :index="'' +index+ itemIndex" :key="'' +index+ itemIndex">
                            {{item.name}}
                        </el-menu-item>
                    </router-link>

                </el-submenu>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
  export default {
    data () {
      return {
        text: 'unread',
        menus: [
          {
            name: '数据库',
            iconClass: 'el-icon-location',
            items: [
              {name: '列表', url: '/databases'},
              {name: '新建', url: '/database'}
            ]
          },
          {
            name: '系统设置',
            iconClass: 'el-icon-setting',
            items: [
              {name: '七牛云', url: '/config/qiniu'}
            ]
          },
          {
            name: '图片管理',
            iconClass: 'el-icon-location',
            items: [
              {name: '图片列表', url: '/images'}
            ]
          }
        ]
      }
    },
    async created () {
    },
    methods: {
      link (item) {
        this.$router.push(item.url)
      }
    }
  }
</script>

<style scoped lang="less">
    @import "../../assets/lesses/home";
</style>