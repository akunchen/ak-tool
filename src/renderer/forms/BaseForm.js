/**
 * 基础校验表单
 */
export class BaseForm {
  constructor (data = {}) {
    this._params = data
  }

  /**
   * 获取表单参数
   * @param params
   */
  setParams (params = {}) {
    this._params = params

    return this
  }

  /**
   * 获取表单参数
   * @return {*}
   */
  getParams () {
    return this._params
  }

  /**
   * 检验规则
   * 格式如下：[ name, method, message ]
   * @return {Array}
   */
  rules () {
    return []
  }

  /**
   * 校验
   */
  async validate () {
    this._errors = {}

    let promises = []

    this.rules().forEach(async rule => {
      let [name, type, message] = rule

      if (type === 'required') { // 必填字段
        if (typeof name === 'string') {
          name = [name]
        }
        name.forEach(n => {
          if (!this._params[n]) {
            return (this._errors[n] = message || `${n}不为空`) && false
          }

          return true
        })
      } else if (typeof this[type] === 'function') { // 调用自定义方法
        // await this[type](name)

        promises.push(this[type](name))
      } else {
        return false
      }
    })

    if (promises.length > 0) {
      await Promise.all(promises)
    }

    return !this.hasErrors()
  }

  /**
   * 获取错误信息
   * @return {{}}
   */
  getErrors () {
    return this._errors
  }

  /**
   * 添加错误
   * @param name
   * @param error
   */
  addError (name, error) {
    this._errors[name] = error
  }

  /**
   * 获取是否有错误
   * @return {boolean}
   */
  hasErrors () {
    return Object.keys(this._errors).length > 0
  }
}
