import User from '../models/user-model.js'

async function getUsers (_req, res) {
  try {
    const users = await User.findAll()
    if (!users) {
      const errorMessage = 'No se encontraron usuarios'
      console.error(errorMessage)
      return res.status(404).json({ message: errorMessage })
    }
    return res.json(users)
  } catch (error) {
    const errorMessage = 'Error al obtener los usuarios'
    console.error('Error al obtener los usuarios:', error)
    return res.status(500).json({ message: errorMessage })
  }
}

async function createUser (req, res) {
  const { username, password } = req.body
  try {
    const userExists = await getUserByUserName({ username })
    if (userExists) {
      const errorMessage = 'El usuario ya existe'
      console.error(errorMessage)
      return res.status(409).json({ message: errorMessage })
    }

    const user = await User.create({ username, password })
    return res.status(201).json(user)
  } catch (error) {
    const errorMessage = 'Error al crear el usuario'
    console.error(errorMessage, error)
    return res.status(500).json({ message: errorMessage })
  }
}

async function getUserByUserName ({ username }) {
  try {
    const user = await User.findOne({ where: { username } })
    if (!user) {
      return null
    }
    return user
  } catch (error) {
    console.error('Error al obtener el usuario:', error)
    return null
  }
}

async function deleteUser (req, res) {
  const { username } = req.body
  try {
    const user = await User.findOne({ where: { username } })
    if (!user) {
      const errorMessage = 'El usuario no existe'
      console.error(errorMessage)
      return res.status(404).json({ message: errorMessage })
    }

    await user.destroy()
    return res.status(204).end()
  } catch (error) {
    const errorMessage = 'Error al eliminar el usuario'
    console.error(errorMessage, error)
    return res.status(500).json({ message: errorMessage })
  }
}

export { getUsers, createUser, deleteUser }
