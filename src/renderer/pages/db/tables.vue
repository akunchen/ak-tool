<template>
    <div>
        <el-select v-model="selectedTable" filterable placeholder="请选择" @change="selectChange" value="">
            <el-option v-for="table in tables" :key="table.name" :label="table.name" :value="table.name"/>
        </el-select>
        <el-select v-model="selectedLanguage" value="" @change="selectChange">
            <el-option v-for="language in languages" :key="language" :label="language" :value="language"/>
        </el-select>
        <el-button type="primary" @click="copyCode">复制</el-button>
        <el-button type="danger" @click="dialogVisible = true" v-if="code">写入文件</el-button>

        <el-row v-if="code">
            <hr>
            <pre v-text="code"></pre>
        </el-row>

        <el-dialog title="提示" :visible="dialogVisible" width="600px">
            <el-input type="text" :readonly="true" v-model="writeForm.filePath">
                <el-button slot="prepend" @click="openFile">选择储存位置</el-button>
            </el-input>

            <el-input type="text" v-model="writeForm.className">
                <template slot="prepend">model名</template>
            </el-input>

            <el-input type="textarea" v-model="writeForm.codeHeader">
                <template slot="prepend">文件头部</template>
            </el-input>

            <el-input type="textarea" v-model="writeForm.codeFooter">
                <template slot="prepend">文件尾部</template>
            </el-input>

            <pre v-text="writeForm.fullCode"></pre>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="writeFile">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
  import { clipboard, remote } from 'electron'
  import _ from 'lodash'
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
        get code () {
          return this.writeForm.code
        },

        // 对话框相关
        dialogVisible: false,
        writeForm: {
          filePath: null,
          className: null,
          codeHeader: '',
          codeFooter: '',
          code: '',
          get fullCode () {
            let header = this.codeHeader ? (this.codeHeader + '\n') : ''
            let footer = this.codeFooter ? ('\n' + this.codeFooter) : ''
            return header + this.code + footer
          }
        }
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
          this.writeForm.code = ''
          return false
        }

        this.writeForm.code = await this.database.getTableModelCode(this.selectedTable, this.selectedLanguage)
        this.writeForm.className = _.upperFirst(_.camelCase(this.selectedTable))

        switch (this.selectedLanguage) {
          case 'java':
            this.writeForm.codeHeader = `public class ${this.writeForm.className} {`
            this.writeForm.codeFooter = '}'
            break
          case 'php':
            this.writeForm.codeHeader = `public class ${this.writeForm.className} {`
            this.writeForm.codeFooter = '}'
            break
          case 'js':
            this.writeForm.codeHeader = ''
            this.writeForm.codeFooter = ''
            break
        }
      },
      /**
       * 复制代码
       * @return {Promise<void>}
       */
      async copyCode () {
        clipboard.writeText(this.code)
        new Notification('复制成功')
      },
      /**
       * 打开文件选择器
       */
      async openFile () {
        let result = await remote.dialog.showOpenDialog({
          defaultPath: '~',
          properties: [
            'openDirectory',
          ],
          message: '选择model所在文件夹'
        })

        if (!result) {
          return
        }

        this.writeForm.filePath = result[0]
      },
      async writeFile () {
        if (!this.writeForm.filePath) {
          const r = await this.$confirm('请先现在文件路径', '提示', {}).catch(e => {
            console.log(e)
          })
          if (r === 'confirm') {
            return this.openFile()
          } else {
            return
          }
        }

      }
    }
  }
</script>

<style scoped>

</style>