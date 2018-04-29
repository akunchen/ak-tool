import connection from './connection'
import DataTypes from 'sequelize/lib/data-types'

const Menu = connection.define('Menu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING(100),
  pid: DataTypes.STRING(11),
  level: DataTypes.INTEGER(1),
  status: DataTypes.BOOLEAN
}, {
  instanceMethods: {},
  getterMethods: {},
  tableName: 't_menu'
})

Menu.hasMany(Menu, {as: 'items'})
Menu.belongsTo(Menu, {as: 'menu', foreignKey: 'pid'})

export default Menu
