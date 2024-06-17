import express from 'express'

const PORT = process.env.PORT || 3000

const app = express()

app.get('/', (req, res) => {
  return res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
