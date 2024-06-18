import express from 'express'
import userRouter from './routes/user-routes.js'
import sequelize from './models/db_conn.js'

const app = express()

sequelize.sync().then(() => {
  console.log('Database connected')
}
)
  .catch((error) => {
    console.error('Error connecting to the database:', error)
  })

app.use(express.json())

app.use('/users', userRouter)

export default app
