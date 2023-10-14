const express = require('express')
const createHttpError = require('http-errors')
const router = express.Router()
const User = require("../Models/User.model")
const {authSchema} = require('../helpers/validation_schema')

router.post('/register', async(req, res, next) => {
   try{
    // const {email, password} = req.body

    const result = await authSchema.validateAsync(req.body)

    const doesExist = await User.find({email: result.email})

    if(!doesExist) throw createHttpError.Conflict(`${result.email} is already registered`)

    const user = new User(result)

    const savedUser = await user.save()
    res.send(savedUser)

   }catch(error){
       if(error.isJoi === true) error.status = 422
    next(error)
   }
})

router.post('/login', async(req, res, next) => {
    res.send("login route")
})

router.post('/refresh-token', async(req, res, next) => {
    res.send("refresh route")
})

router.delete('/logout', async(req, res, next) => {
    res.send("refresh route")
})

module.exports = router