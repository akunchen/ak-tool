<template>
    <div>
        <h1>数据库列表</h1>
        <hr>
        <el-table :data="databases" style="width: 100%" height="400" class="table table-striped table-bordered">
            <el-table-column prop="id" label="id" width="40"/>
            <el-table-column prop="name" label="简称" width="80"/>
            <el-table-column prop="type" label="类型" width="60"/>
            <el-table-column prop="host" label="地址"/>
            <el-table-column prop="database" label="数据库" width="100"/>
            <el-table-column prop="user" label="用户名" width="100"/>
            <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                    <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
                    <el-button size="mini" @click="viewTables(scope.row)">表结构</el-button>
                    <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
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