import express from 'express'
import { createUser, getUsers, deleteUser, updateUser, login } from '../controllers/user.controller.js'
import verifyToken from '../middlewares/login.middleware.js'

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.post('/', createUser)
userRouter.delete('/', deleteUser)
userRouter.put('/', updateUser)
userRouter.post('/login', login)
userRouter.get('/private', verifyToken, (req, res) => {
  res.json({ message: 'This is a private route' })
})

export default userRouter
