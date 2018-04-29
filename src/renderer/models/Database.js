import connection from './connection'
import DataTypes from 'sequelize/lib/data-types'
import Sequelize from 'Sequelize'

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
  instanceMethods: {},
  getterMethods: {},
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

export default Database
