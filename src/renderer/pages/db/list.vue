<template>
    <div>
        <h1>数据库列表</h1>
        <hr>
        <table class="table table-striped table-bordered">
            <thead>
            <tr>
                <th>Id</th>
                <th>简称</th>
                <th>数据库类型</th>
                <th>数据库地址</th>
                <th>数据库</th>
                <th>用户名</th>
                <th>密码</th>
                <th>其他配置</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="database in databases">
                <td>{{database.id}}</td>
                <td>{{database.name}}</td>
                <td>{{database.getType().name}}</td>
                <td>{{database.host}}</td>
                <td>{{database.database}}</td>
                <td>{{database.user}}</td>
                <td>{{database.password}}</td>
                <td>{{database.config}}</td>
                <td>
                    <a class="btn btn-default" @click="edit(database)">编辑</a>&nbsp;&nbsp;
                    <a class="btn btn-default" @click="viewTables(database)">表结构</a>&nbsp;&nbsp;
                    <a class="btn btn-danger" @click="remove(database)">删除</a>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  import Database from '../../models/Database'

  export default {
    name: 'list',
    data () {
      return {
        databases: []
      }
    },
    mounted () {
      this.getDatabases()
    },
    methods: {
      /**
       * 获取数据库列表
       * @return {Promise<void>}
       */
      async getDatabases () {
        this.databases = await Database.findAll()
      },
      /**
       * 编辑数据库
       * @param {Database} database
       */
      edit (database) {
        this.$router.push(`/database/${database.id}/edit`)
      },
      /**
       * 查看数据库表结构
       * @param {Database} database
       */
      viewTables (database) {
        this.$router.push(`/database/${database.id}/tables`)
      },
      /**
       * 删除数据库
       * @param {Database} database
       */
      async remove (database) {
        await database.destroy()
        this.getDatabases()
      }
    }
  }
</script>

<style scoped>

</style>