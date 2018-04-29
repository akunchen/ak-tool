import { BaseForm } from './BaseForm'
import Database from '../models/Database'

/**
 * 保存数据库表单
 */
export class SaveDatabaseForm extends BaseForm {
  /**
   * @inheritDoc
   */
  rules () {
    const rules = [
      [['name', 'type', 'url'], 'required'],
      ['database', 'validateDatabase']
    ]

    switch (this.getParams().type) {
      case 'mysql':
        rules.push([['database', 'user'], 'required'])
        break
    }

    return rules
  }

  /**
   * 获取类型
   * @return {*}
   */
  static getTypes () {
    return Database.getTypes()
  }

  /**
   * 校验数据库是否正常
   * @param attribute
   */
  async validateDatabase (attribute) {
    if (this.hasErrors()) {
      return false
    }

    let db = await this.getDb()
    if (this.getParams().id && !db) {
      return this.addError(attribute, '编辑的数据库不存在')
    }

    try {
      await db.getConnection().authenticate()
    } catch (e) {
      this.addError(attribute, '数据库连接异常: ' + e.message)
    }
  }

  /**
   * 获取数据库
   * @return {Database|Model}
   */
  async getDb () {
    if (this._db) {
      return this._db
    }

    if (this.getParams().id) {
      this._db = await Database.findById(this.getParams().id)
      if (!this._db) {
        return null
      }
    } else {
      this._db = new Database()
    }

    this._db.name = this.getParams().name
    this._db.type = this.getParams().type
    this._db.host = this.getParams().url
    this._db.database = this.getParams().database
    this._db.user = this.getParams().user
    this._db.password = this.getParams().password

    return this._db
  }

  /**
   * 运行校验
   * @param params
   * @return {boolean}
   */
  async run (params = {}) {
    if (JSON.stringify(params) !== '{}') {
      this.setParams(params)
    }

    if (!await this.validate()) {
      return false
    }

    let db = await this.getDb()
    db.status = 1
    db.config = ''

    await db.save()

    return true
  }
}
