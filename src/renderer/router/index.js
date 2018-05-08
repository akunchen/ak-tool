import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/home/index'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/',
      name: 'database',
      component: Home,
      children: [
        {path: '/databases', component: require('@/pages/db/list').default, name: '数据库列表'},
        {path: '/database', component: require('@/pages/db/edit').default, name: '新建数据库'},
        {path: '/database/:id/edit', component: require('@/pages/db/edit').default, name: '编辑数据库'},
        {path: '/database/:id/tables', component: require('@/pages/db/tables').default, name: '表结构'}
      ]
    },
    {
      path: '/system/config',
      name: 'config',
      component: Home,
      children: [
        {path: '/config/qiniu', component: require('@/pages/config/qiniu').default, name: '七牛云存储配置'}
      ]
    },
    {
      path: '/',
      name: 'images',
      component: Home,
      children: [
        {path: '/images', component: require('@/pages/qiniu/images').default, name: '图片列表'}
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

export default router