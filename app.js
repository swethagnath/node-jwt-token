const express = require('express')
const morgan = require('morgan')
const createError  = require('http-errors')
const AuthRoute = require('./Routes/Auth.routes')
require('./helpers/init_mongodb')

require('dotenv').config()

const app = express()

 
const PORT  = process.env.PORT || 3000

app.get('/', async(req, res, next) => {
    res.send("hello from express")
})

app.use(morgan('dev'))

app.use(async (req, res, next) => {
    next(createError.NotFound())
})

app.use('/auth', AuthRoute)

app.use((err,req, res, next) => {
    res.status(err.status || 500)
    res.send({
        erro: {
            status: err.status |500,
            message: err.message
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})