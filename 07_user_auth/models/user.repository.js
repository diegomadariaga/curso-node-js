import { DataTypes, Sequelize } from 'sequelize'
import sequelize from './db_conn.js'
import bcrypt from 'bcrypt'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at'
  }
}, {
  tableName: 'users',
  timestamps: false
})

export class UserRepository {
  static async getAllUsers () {
    try {
      const users = await User.findAll()
      return users
    } catch (error) {
      console.error('Error al obtener los usuarios:', error)
      throw new Error('Error al obtener los usuarios')
    }
  }

  static async getUserByUserName ({ username }) {
    try {
      const user = await User.findOne({ where: { username } })
      return user
    } catch (error) {
      console.error('Error al obtener el usuario:', error)
      throw new Error('Error al obtener el usuario')
    }
  }

  static async createUser ({ username, password }) {
    try {
      const saltRounds = process.env.SALT_ROUNDS || 10
      const hashedPassword = bcrypt.hash(password, saltRounds)
      const userExists = await UserRepository.getUserByUserName({ username })
      if (userExists) {
        throw new Error('El usuario ya existe')
      }
      const newPass = await hashedPassword
      const user = await User.create({ username, password: newPass })
      return user
    } catch (error) {
      console.error('Error al crear el usuario:', error)
      throw new Error('Error al crear el usuario')
    }
  }

  static async deleteUser ({ username }) {
    try {
      const user = await UserRepository.getUserByUserName({ username })
      if (!user) {
        throw new Error('El usuario no existe')
      }

      await user.destroy()
    } catch (error) {
      console.error('Error al eliminar el usuario:', error)
      throw new Error('Error al eliminar el usuario')
    }
  }

  static async updateUser ({ username, password }) {
    try {
      const hashedPassword = bcrypt.hash(password, 10)
      const user = await UserRepository.getUserByUserName({ username })
      if (!user) {
        throw new Error('El usuario no existe')
      }
      const newPass = await hashedPassword
      await user.update({ password: newPass })
    } catch (error) {
      console.error('Error al actualizar el usuario:', error)
      throw new Error('Error al actualizar el usuario')
    }
  }

  static async authenticateUser ({ username, password }) {
    try {
      const user = await UserRepository.getUserByUserName({ username })
      if (!user) {
        throw new Error('El usuario no existe')
      }

      const isPasswordValid = await bcrypt.compare(password, user.dataValues.password)
      if (!isPasswordValid) {
        throw new Error('La contraseña no es válida')
      }
      return user.dataValues
    } catch (error) {
      console.error('Error al verificar la contraseña:', error)
      throw new Error('Error al verificar la contraseña')
    }
  }
}
