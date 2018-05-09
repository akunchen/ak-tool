import * as fs from 'fs'
import { DB_KEY_QINIU, DB_PATH } from '../utils/Constants'
import connection from '../models/connection'
import * as models from '../models/index'

export class Init {
  static run () {
    this.initDb()
  }

  /**
   * 初始化数据库
   */
  static async initDb () {
    if (!fs.existsSync(DB_PATH)) {
      return
    }

    try {
      let tables = await connection.getQueryInterface().showAllTables()

      Object.values(models).forEach(async model => {
        if (tables.indexOf(model.tableName) === -1) {
          try {
            await model.sync()
          } catch (e) {
            console.error('init db', e)
          }
        }
      })

    } catch (e) {
      console.error('build error', e)
    }
  }
}