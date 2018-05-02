<template>
    <div class="container-fluid">
        <h1>新建数据库</h1>
        <hr>
        <div class="col-xs-6">
            <div class="form-group" :class="errors.name? 'has-error' : ''">
                <label class="control-label" for="databasesaveform-name">简称</label>
                <input type="text" id="databasesaveform-name" class="form-control" v-model="form.name">
                <p class="help-block help-block-error" v-text="errors.name"></p>
            </div>
            <div class="form-group" :class="errors.type? 'has-error' : ''">
                <label class="control-label" for="databasesaveform-type">数据库类型</label>
                <select id="databasesaveform-type" class="form-control" v-model="form.type">
                    <option :value="t.id" v-for="t in types">{{t.name}}</option>
                </select>

                <p class="help-block help-block-error" v-text="errors.type"></p>
            </div>
            <div class="form-group" :class="errors.url? 'has-error' : ''">
                <label class="control-label" for="databasesaveform-url">数据库地址</label>
                <input type="text" id="databasesaveform-url" class="form-control" v-model="form.url">

                <p class="help-block help-block-error" v-text="errors.url"></p>
            </div>
        </div>
        <div class="col-xs-6">
            <div class="form-group" :class="errors.database? 'has-error' : ''">
                <label class="control-label" for="databasesaveform-database">数据库</label>
                <input type="text" id="databasesaveform-database" class="form-control" v-model="form.database">

                <p class="help-block help-block-error" v-text="errors.database"></p>
            </div>
            <div class="form-group" :class="errors.user? 'has-error' : ''">
                <label class="control-label" for="databasesaveform-user">用户名</label>
                <input type="text" id="databasesaveform-user" class="form-control" v-model="form.user">

                <p class="help-block help-block-error" v-text="errors.user"></p>
            </div>
            <div class="form-group" :class="errors.password? 'has-error' : ''">
                <label class="control-label" for="databasesaveform-password">密码</label>
                <input type="password" id="databasesaveform-password" class="form-control" v-model="form.password">

                <p class="help-block help-block-error" v-text="errors.password"></p>
            </div>
        </div>
        <div class="clearfix"></div>
        <div class="col-xs-8">
            <button class="btn btn-primary" @click="save()">提交</button>&nbsp;&nbsp;
            <span v-text="result"></span>
            <!--<a class="btn btn-default" href="javascript: ;">取消</a>-->
        </div>
    </div>
</template>

<script>
  import { remote, clipboard } from 'electron'
  import { SaveDatabaseForm } from '../../forms/SaveDatabaseForm'
  import Database from '../../models/Database'

  const {Menu, MenuItem} = remote

  export default {
    name: 'edit',
    data () {
      return {
        form: {
          name: '',
          type: 'mysql',
          url: '',
          database: '',
          user: '',
          password: ''
        },
        errors: {},
        types: SaveDatabaseForm.getTypes(),
        result: ''
      }
    },
    mounted () {
      this.getDatabase()
      this.bindClick()
    },
    methods: {
      /**
       * 点击保存
       * @return {Promise<boolean>}
       */
      async save () {
        const form = new SaveDatabaseForm(this.form)
        let run = await form.run()

        if (run) {
          this.result = '保存成功'
          return this.$router.push('/databases')
        }

        this.errors = form.getErrors()
        this.result = '保存失败'
      },
      /**
       * 获取数据库
       * @return {Promise<void>}
       */
      async getDatabase () {
        if (!this.$route.params.id) {
          return false
        }

        let database = await Database.findOne({
          where: {id: this.$route.params.id}
        })

        this.form.id = database.id
        this.form.name = database.name
        this.form.type = database.type
        this.form.url = database.host
        this.form.database = database.database
        this.form.user = database.user
        this.form.password = database.password
      },
      bindClick () {
        const _this = this;
        ['name', 'url', 'database', 'user', 'password'].forEach(key => {
          const menu = new Menu()

          menu.append(new MenuItem({label: '粘贴', click () { _this.form[key] = clipboard.readText('String') }}))
          menu.append(new MenuItem({label: '清空', click () { _this.form[key] = '' }}))

          document.getElementById(`databasesaveform-${key}`).addEventListener('contextmenu', (e) => {
            e.preventDefault()
            menu.popup(remote.getCurrentWindow())
          }, false)
        })
      }
    }
  }
</script>

<style scoped>

</style>