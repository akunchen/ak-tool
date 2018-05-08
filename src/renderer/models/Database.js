import DataTypes from 'sequelize/lib/data-types'
import Sequelize from 'Sequelize'

import connection from './connection'
import { MySqlSchema, MssqlSchema } from '../util/db/DbSchema'

// 数据库
let Database = connection.define('Database', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING(100),
  host: DataTypes.STRING(250),
  type: DataTypes.STRING(250),
  database: DataTypes.STRING(250),
  user: DataTypes.STRING(250),
  password: DataTypes.STRING(250),
  status: DataTypes.BOOLEAN,
  config: DataTypes.STRING(500)
}, {
  tableName: 't_database'
})

/**
 * 获取数据库类型
 * @return {*[]}
 */
Database.getTypes = () => {
  return [
    {id: 'mysql', name: 'MySQL', dialect: 'mysql'},
    {id: 'mssql', name: 'SQL Server', dialect: 'mssql'}
  ]
}

/**
 * 获取类型
 * @return {*}
 */
Database.prototype.getType = function () {
  return Database.getTypes().reduce((result, type) => {
    if (result) {
      return result
    }

    if (type.id === this.type) {
      result = type
    }

    return result
  }, null)
}

/**
 * 获取数据库链接
 * @return {Sequelize}
 */
Database.prototype.getConnection = function () {
  if (!this._connection) {
    let config = {
      dialect: this.getType().dialect,
      host: this.host,
      username: this.user,
      password: this.password,
      database: this.database,
      pool: {max: 10, min: 0, idle: 100000}
    }
    this._connection = new Sequelize(config)
  }

  return this._connection
}

/**
 * 获取数据库链接是否正常
 * @return {Promise<boolean>}
 */
Database.prototype.isActive = async function () {
  try {
    await this.getConnection().authenticate()
    return true
  } catch (e) {
    console.error('check active error', e)
    return false
  }
}

/**
 * 获取表列表
 * @return {Promise<void>}
 */
Database.prototype.getTables = async function () {
  let schemas = await this.getConnection().getQueryInterface().showAllTables()

  return schemas.map(schema => {
    // mysql - tableName, mssql - {tableName:'xxxx',schema: 'dbo'}
    return {
      name: typeof schema === 'string' ? schema : schema.tableName
    }
  })
}

/**
 * 获取表结构
 * @param {String} tableName 表名
 * @return {Promise<any[]>}
 */
Database.prototype.getTableColumns = async function (tableName) {
  let table = await this.getConnection().getQueryInterface().describeTable(tableName)
  return Object.keys(table).map(columnName => {
    let column = table[columnName]
    return {
      name: columnName,
      allowNull: column.allowNull,
      defaultValue: column.defaultValue,
      type: column.type,
      dialect: this.type
    }
  })
}

/**
 * 获取表的model数据
 * @param {String} tableName 表名
 * @param {String} language 语言，js，php，java
 * @return {Promise<*>}
 */
Database.prototype.getTableModelCode = async function (tableName, language) {
  switch (this.type) {
    case 'mysql':
      return MySqlSchema.run(this, tableName, language)
    case 'mssql':
      return MssqlSchema.run(this, tableName, language)
    default:
      return null
  }
}

export default Database
