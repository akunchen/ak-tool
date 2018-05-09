export class MssqlSchemaPhp {
  /**
   * 格式化字段 - php
   * @param {String} type 类型
   * @param {Integer} size 长度
   * @return {string}
   */
  static formatColumnType (type, size) {
    if (type.indexOf('int') > -1) {
      return 'integer'
    } else {
      return 'string'
    }
  }

  /**
   * TODO
   * 渲染页面
   * @param {String} columns 字段列表
   */
  static render (columns = []) {
    return 'todo'
  }
}
