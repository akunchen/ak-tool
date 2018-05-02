<template>
    <div>
        <el-select v-model="selectedTable" filterable placeholder="请选择" @change="selectChange" value="">
            <el-option v-for="table in tables" :key="table.name" :label="table.name" :value="table.name"/>
        </el-select>
        <el-select v-model="selectedLanguage" value="" @change="selectChange">
            <el-option v-for="language in languages" :key="language" :label="language" :value="language"/>
        </el-select>
        <el-button type="primary" @click="copyCode">复制</el-button>
        <span v-if="showCopySuccess">复制成功！</span>
        <hr v-if="code">
        <pre v-text="code" v-if="code"></pre>
    </div>
</template>

<script>
  import { clipboard } from 'electron'
  import Database from '../../models/Database'

  export default {
    name: 'tables',
    data () {
      return {
        tables: [],
        selectedTable: null,
        selectedLanguage: 'java',
        database: null,
        tableSchema: {},
        languages: ['js', 'php', 'java'],
        code: '',
        showCopySuccess: false
      }
    },
    async mounted () {
      this.database = await Database.findById(this.$route.params.id)
      await this.getTables()
    },
    methods: {
      /**
       * 获取数据库的表
       * @return {Promise<void>}
       */
      async getTables () {
        this.tables = await this.database.getTables()
      },
      /**
       * 切换选择
       * @return {Promise<boolean>}
       */
      async selectChange () {
        if (!this.selectedTable || !this.selectedLanguage) {
          return false
        }

        this.code = await this.database.getTableModelCode(this.selectedTable, this.selectedLanguage)
      },
      /**
       * 复制代码
       * @return {Promise<void>}
       */
      async copyCode () {
        clipboard.writeText(this.code)
        this.showCopySuccess = true

        setTimeout(() => {
          this.showCopySuccess = false
        }, 1000)
      }
    }
  }
</script>

<style scoped>

</style>