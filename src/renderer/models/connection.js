import Sequelize from 'sequelize'

let config = {
  dialect: 'sqlite',
  // host: '127.0.0.1',
  // username: 'root',
  // password: '',
  database: 'main',
  // timezone: '+08:00', // 设置时差
  pool: {max: 10, min: 0, idle: 100000},
  storage: '/var/share/ak-tool.sqlite',
  define: {
    timestamps: true,
    freezeTableName: true,
    classMethods: {
      createDate () {
        return new Date()
      },
      /**
       * 生成随机长度
       * @param {number} length 长度
       * @returns {string}
       */
      createBounceString (length = 32) {
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let charsLength = chars.length

        let bounceChars = []
        for (let i = 0; i < length; i++) {
          bounceChars.push(chars.charAt(Math.floor(Math.random() + charsLength)))
        }
        return bounceChars.join('')
      },
      instanceMethods: {}
    }
  }
}

const connection = new Sequelize(config)

export default connection
