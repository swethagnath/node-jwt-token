const express = require('express')
const createHttpError = require('http-errors')
const router = express.Router()
const User = require("../Models/User.model")
const {authSchema} = require('../helpers/validation_schema')
const {signAccessToken, verifyAccessToken} = require('../helpers/jwt_helper')

router.post('/register', async(req, res, next) => {
   try{
    const result = await authSchema.validateAsync(req.body)

    const doesExist = await User.find({email: result.email})

    if(!doesExist) throw createHttpError.Conflict(`${result.email} is already registered`)

    const user = new User(result)

    const savedUser = await user.save()


    const accessToken = await signAccessToken(savedUser.id)
    res.send(accessToken)

   }catch(error){
       if(error.isJoi === true) error.status = 422
        next(error)
   }
})

router.post('/login', async(req, res, next) => {
  try{
    
    const result = await authSchema.validateAsync(req.body)
    const user = await User.findOne({email: result.email})
    if(!user) throw createError.NotFound('user not registered')

    const isMatch = await user.isValidPassword(result.password)
    if(!isMatch) throw createError.Unauthorized('username/password is not valid')

    const accessToken = await signAccessToken(user.id)
    res.send(result)
    

  }catch(error){
    if(error.isJoi === true) return next(createError.BadRequest("Invalid Username/ Password"))
    next(error)
  }
})

router.post('/refresh-token', async(req, res, next) => {
    res.send("refresh route")
})

router.delete('/logout', verifyAccessToken, async(req, res, next) => {
    res.send("refresh route")
})

module.exports = router