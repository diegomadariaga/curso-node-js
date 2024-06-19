import express from 'express'
import { createUser, getUsers, deleteUser } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.post('/', createUser)
userRouter.delete('/', deleteUser)

export default userRouter
