import DataTypes from 'sequelize/lib/data-types'

import connection from './connection'
import { qiniuHelper } from '../util/Qiniu'

// 数据库
let Image = connection.define('Image', {
  hash: {
    type: DataTypes.STRING(500),
    primaryKey: true
  },
  name: DataTypes.STRING(250),
  desc: DataTypes.STRING(250),
}, {
  tableName: 't_image'
})

/**
 * 获取图片访问的url
 * @return {string}
 */
Image.prototype.getUrl = function () {
  return `${qiniuHelper.getHost()}/${this.hash}`
}

export default Image
