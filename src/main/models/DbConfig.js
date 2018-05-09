import DataTypes from 'sequelize/lib/data-types'

import connection from './connection'

// 数据库
let DbConfig = connection.define('DbConfig', {
  key: {
    type: DataTypes.STRING(250),
    primaryKey: true
  },
  desc: DataTypes.STRING(250),
  value: DataTypes.JSON
}, {
  tableName: 't_config'
})

/**
 * 获取配置
 * @return {{}|*}
 */
DbConfig.prototype.getValues = function () {
  if (this._values === void 1) {
    this._values = this.value
  }

  return this._values
}

/**
 * 设置values
 * @param value
 * @return {DbConfig}
 */
DbConfig.prototype.setValues = function (value) {
  this._values = value
  this.value = value

  return this
}

export default DbConfig
