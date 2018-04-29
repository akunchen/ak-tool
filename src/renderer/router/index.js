import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/pages/home/index').default
    },
    {
      path: '/',
      name: 'database',
      component: require('@/pages/home/index').default,
      children: [
        {path: '/databases', component: require('@/pages/db/list').default, name: '数据库列表'},
        {path: '/database', component: require('@/pages/db/edit').default, name: '新建数据库'},
        {path: '/database/:id/edit', component: require('@/pages/db/edit').default, name: '编辑数据库'},
        {path: '/database/:id/tables', component: require('@/pages/db/tables').default, name: '表结构'}
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
