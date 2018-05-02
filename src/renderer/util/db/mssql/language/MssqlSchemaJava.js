export class MssqlSchemaJava {
  /**
   * 格式化字段 - java
   * @param {String} type 类型
   * @param {Integer} size 长度
   * @return {string}
   */
  static formatColumnType (type, size) {
    if (type === 'tinyint' || type === 'bit') {
      return 'Byte'
    } else if (type === 'int' || type === 'bigint') {
      return 'Long'
    } else if (type.indexOf('int') > -1) {
      return 'Integer'
    } else {
      return 'String'
    }
  }

  /**
   * 渲染页面
   * @param {String} columns 字段列表
   */
  static render (columns = []) {
    return columns.reduce((currentCode, column) => {
      let comment = column.comment ? column.comment + '，' : ''
      comment += column.dbType

      return currentCode + `// ${comment} \nprivate ${column.type} ${column.name};\n`
    }, '')
  }
}
