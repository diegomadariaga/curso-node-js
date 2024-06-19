import express from 'express'
import { createUser, getUsers, deleteUser, updateUser, login } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.post('/', createUser)
userRouter.delete('/', deleteUser)
userRouter.put('/', updateUser)
userRouter.post('/login', login)

export default userRouter
