require('dotenv').config()
require('./config/db')
const express = require('express')
const app = express()
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/url', require('./routes/url'))
app.use('/api/users', require('./routes/user'))
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running ar ${PORT} port`))