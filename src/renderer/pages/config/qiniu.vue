<template>
    <el-form ref="submitForm" :model="form" label-width="90px" :rules="rules">
        <el-form-item label="key" prop="key">
            <el-input v-model="form.key" readonly/>
        </el-form-item>
        <el-form-item label="accessKey" prop="accessKey">
            <el-input v-model="form.accessKey"/>
        </el-form-item>
        <el-form-item label="secretKey" prop="secretKey">
            <el-input v-model="form.secretKey"/>
        </el-form-item>
        <el-form-item label="bucket" prop="bucket">
            <el-input v-model="form.bucket"/>
        </el-form-item>
        <el-form-item label="url" prop="domain">
            <el-input v-model="form.domain"/>
        </el-form-item>
        <el-row>
            <el-button type="primary" @click="validateForm">确认</el-button>
        </el-row>
    </el-form>
</template>

<script>
  import { DB_KEY_QINIU } from '../../util/Constants'
  import DbConfig from '../../models/DbConfig'

  export default {
    name: 'qiniu',
    data () {
      return {
        form: {
          key: DB_KEY_QINIU,
          accessKey: null,
          secretKey: null,
          domain: null,
          bucket: null,
        },
        rules: {
          accessKey: [
            {required: true, type: 'string', message: '请输入accessKey', trigger: 'blur'},
          ],
          secretKey: [
            {required: true, message: '请输入secretKey', trigger: 'blur'},
          ],
          domain: [
            {
              required: true,
              message: '请输入正确的url',
              trigger: 'blur',
              pattern: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)*$/i
            },
          ],
          bucket: [
            {required: true, message: '请输入bucket', trigger: 'blur'},
          ],
        },
        config: null
      }
    },
    created () {
      this.initConfig()
    },
    methods: {
      /**
       * 初始化表单配置
       */
      async initConfig () {
        this.config = await DbConfig.findById(this.form.key)
        if (!this.config) {
          this.config = new DbConfig()
          this.config.key = this.form.key
          this.config.desc = '七牛云存储图片'
          this.config.value = {}
          await this.config.save()
        }
        this.config2form()
      },
      /**
       * 从config中读取到form表单
       */
      config2form () {
        this.form.key = this.config.key
        this.form.accessKey = this.config.getValues().accessKey
        this.form.secretKey = this.config.getValues().secretKey
        this.form.domain = this.config.getValues().domain
        this.form.bucket = this.config.getValues().bucket
      },
      /**
       * 从form表单中读取到config
       */
      form2config () {
        this.config.setValues(this.form)
        // this.config.key = this.form.key
        // this.config.accessKey = this.form.accessKey
        // this.config.accessKey = this.form.accessKey
        // this.config.accessKey = this.form.accessKey
      },
      /**
       * 校验表单
       */
      validateForm () {
        this.$refs['submitForm'].validate((valid) => {
          if (!valid) {
            return false
          }

          this.save()
        })
      },
      /**
       * 保存表单
       * @return {Promise<void>}
       */
      async save () {
        this.form2config()
        await this.config.save()
        new Notification('保存成功')
      }
    }
  }
</script>

<style scoped>

</style>