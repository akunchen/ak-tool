import { QueryTypes } from 'sequelize'
import { MySqlSchemaJs } from './language/MySqlSchemaJs'
import { MySqlSchemaPhp } from './language/MySqlSchemaPhp'
import { MySqlSchemaJava } from './language/MySqlSchemaJava'

/**
 * mysql 数据库表结构查询
 */
export class MySqlSchema {
  /**
   * @param {Database} database 数据库
   * @param {String} tableName 表名
   * @param {String} language 开发语言
   */
  constructor (database, tableName, language) {
    this.database = database
    this.tableName = tableName
    this.language = language
  }

  /**
   * 获取表结构字段
   * @return {Promise<*>}
   */
  async getColumns () {
    if (this._columns !== void 1) {
      return this._columns
    }

    let columns = await this.database
      .getConnection()
      .query('SHOW FULL COLUMNS FROM `' + this.tableName + '`', {type: QueryTypes.SELECT})

    this._columns = columns.map(column => {
      let types = column.Type.split('(')
      let sizeMatch = column.Type.match(/\d+/)
      let size = sizeMatch ? parseInt(sizeMatch[0]) : 0

      return {
        name: column.Field,
        dbType: column.Type,
        type: this._getHandler().formatColumnType(types[0], size),
        size: size,
        allowNull: column.Null === 'YES',
        primaryKey: column.Key && column.Key.indexOf('PRI') > -1,
        comment: column.Comment
      }
    })
    return this._columns
  }

  /**
   * 获取处理
   * @return {*}
   * @private
   */
  _getHandler () {
    switch (this.language) {
      case 'js':
        return MySqlSchemaJs
      case 'php':
        return MySqlSchemaPhp
      case 'java':
        return MySqlSchemaJava
    }
  }

  /**
   * 运行
   * @param {Database} database 数据库
   * @param {String} tableName 表名
   * @param {String} language 语言
   * @return {Promise<*>}
   */
  static async run (database, tableName, language) {
    let schema = new MySqlSchema(database, tableName, language)
    let columns = await schema.getColumns()

    return schema._getHandler().render(columns)
  }
}
