import { QueryTypes } from 'sequelize'
import { MssqlSchemaJs } from './language/MssqlSchemaJs'
import { MssqlSchemaPhp } from './language/MssqlSchemaPhp'
import { MssqlSchemaJava } from './language/MssqlSchemaJava'

/**
 * mysql 数据库表结构查询
 */
export class MssqlSchema {
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

    const sql = `SELECT col.name, ISNULL( ep.[value], '' ) AS comment, t.name AS type, col.length AS size, ISNULL( COLUMNPROPERTY( col.id, col.name, 'Scale' ), 0 ) AS scale, CASE WHEN COLUMNPROPERTY( col.id, col.name, 'IsIdentity' ) = 1 THEN '1' ELSE '' END AS 标识 , CASE WHEN EXISTS ( SELECT 1 FROM dbo.sysindexes si INNER JOIN dbo.sysindexkeys sik ON si.id = sik.id AND si.indid = sik.indid INNER JOIN dbo.syscolumns sc ON sc.id = sik.id AND sc.colid = sik.colid INNER JOIN dbo.sysobjects so ON so.name = si.name AND so.xtype = 'PK' WHERE sc.id = col.id AND sc.colid = col.colid ) THEN '1' ELSE '' END AS primaryKey, CASE WHEN col.isnullable = 1 THEN '1' ELSE '' END AS allowNull, ISNULL( comm.text, '' ) AS defaultValue FROM dbo.syscolumns col LEFT JOIN dbo.systypes t ON col.xtype = t.xusertype INNER JOIN dbo.sysobjects obj ON col.id = obj.id AND obj.xtype = 'U' AND obj.status >= 0 LEFT JOIN dbo.syscomments comm ON col.cdefault = comm.id LEFT JOIN sys.extended_properties ep ON col.id = ep.major_id AND col.colid = ep.minor_id AND ep.name = 'MS_Description' LEFT JOIN sys.extended_properties epTwo ON obj.id = epTwo.major_id AND epTwo.minor_id = 0 AND epTwo.name = 'MS_Description' WHERE obj.name = '${this.tableName}' ORDER BY col.colorder;`

    let columns = await this.database.getConnection().query(sql, {
      type: QueryTypes.SELECT
    })

    this._columns = columns.map(column => {
      column.dbType = column.type + '(' + column.size + ')'
      column.type = this._getHandler().formatColumnType(column.type, column.size)
      return column
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
        return MssqlSchemaJs
      case 'php':
        return MssqlSchemaPhp
      case 'java':
        return MssqlSchemaJava
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
    let schema = new MssqlSchema(database, tableName, language)
    let columns = await schema.getColumns()

    return schema._getHandler().render(columns)
  }
}
