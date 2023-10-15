const express = require('express')
const morgan = require('morgan')
const createError  = require('http-errors')
const AuthRoute = require('./Routes/Auth.routes')


require('./helpers/init_mongodb')
require('dotenv').config()

const app = express()

 
const PORT  = process.env.PORT || 3000



app.use(morgan('dev'))
app.use(express.json())
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