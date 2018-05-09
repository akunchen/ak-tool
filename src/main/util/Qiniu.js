import DbConfig from '../models/DbConfig'
import { DB_KEY_QINIU } from './Constants'
import * as qiniu from 'qiniu'

/**
 * 七牛云储存
 */
class QiniuHelper {
  /**
   * 初始化调用
   * @return {Promise<void>}
   */
  constructor () {
    this.init()
  }

  /**
   * 初始化
   * @return {Promise<void>}
   * @private
   */
  async init () {
    const r = success => {
      return new Promise(resolve => {
        resolve(success)
      })
    }

    if (this._init) {
      return r(this._init)
    }

    this.config = await DbConfig.findById(DB_KEY_QINIU)
    if (
      !this.config || !this.config.getValues().accessKey
      || !this.config.getValues().secretKey || !this.config.getValues().bucket
    ) {
      return r(this._init = false)
    }

    return r(this._init = true)
  }

  /**
   * 获取mac
   * @return {qiniu.auth.digest.Mac|Mac|auth.digest.Mac}
   */
  get mac () {
    if (this._mac) {
      return this._mac
    }

    this._mac = new qiniu.auth.digest.Mac(this.config.getValues().accessKey, this.config.getValues().secretKey)
    return this._mac
  }

  /**
   * 上传策略
   * @return {qiniu.rs.PutPolicy|rs.PutPolicy|PutPolicy}
   */
  get putPolicy () {
    if (this._putPolicy) {
      return this._putPolicy
    }

    this._putPolicy = new qiniu.rs.PutPolicy({
      scope: this.config.getValues().bucket,
      expires: 365 * 24 * 86400
    })

    return this._putPolicy
  }

  /**
   * 获取空间管理器
   * @return {qiniu.rs.BucketManager|rs.BucketManager|BucketManager}
   */
  get bucketManager () {
    if (this._bucketManager) {
      return this._bucketManager
    }

    this._bucketManager = new qiniu.rs.BucketManager(this.mac, new qiniu.conf.Config())

    return this._bucketManager
  }

  /**
   * 获取七牛空间名
   * @return {*|null|{required: boolean, message: string, trigger: string}[]}
   */
  async getBucket () {
    await this.init()
    return this.config.getValues().bucket
  }

  /**
   * 获取host
   */
  getHost () {
    return this.config.getValues().domain
  }

  /**
   * 获取上传文件token
   * @return {string}
   */
  getUploadToken () {
    return this.putPolicy.uploadToken(this.mac)
  }

  /**
   * 删除文件
   * @param {string} key
   */
  removeFile (key) {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(this.config.getValues().bucket, key, (err, respBody, respInfo) => {
        if (err) {
          return reject(err)
        }

        // console.log(respInfo.statusCode)
        // console.log(respBody)
        resolve()
      })
    })
  }
}

const qiniuHelper = new QiniuHelper()

export {
  qiniuHelper
}