const express = require('express')
const morgan = require('morgan')
const createError  = require('http-errors')
const AuthRoute = require('./Routes/Auth.routes')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

require('./helpers/init_mongodb')
require('dotenv').config()
const {verifyAccessToken} = require('./helpers/jwt_helper')

const app = express()

 
const PORT  = process.env.PORT || 3000

app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
  }));
  
app.use(express.urlencoded({extended: true}))
app.use('/auth', AuthRoute)  

app.use(async (req, res, next) => {
    next(createError.NotFound())
})



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