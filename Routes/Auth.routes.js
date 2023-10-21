const express = require('express')
const createHttpError = require('http-errors')
const router = express.Router()
const User = require("../Models/User.model")
const {authSchema} = require('../helpers/validation_schema')
const {signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwt_helper')

router.post('/register', async(req, res, next) => {
   try{
    const result = await authSchema.validateAsync(req.body)

    const doesExist = await User.find({email: result.email})

    if(!doesExist) throw createHttpError.Conflict(`${result.email} is already registered`)

    const user = new User(result)

    const savedUser = await user.save()

    const accessToken = await signAccessToken(savedUser.id)
    const refreshToken = await signRefreshToken(savedUser.id)
    res.send({refreshToken, accessToken} )

   }catch(error){
       if(error.isJoi === true) error.status = 422
        next(error)
   }
})

router.post('/login', async(req, res, next) => {
  try{ 
    const result = await authSchema.validateAsync(req.body)
    console.log("here", result.email)
    const user = await User.findOne({email: result.email})
    if(!user) throw createHttpError.NotFound('user not registered')

    const isMatch = await user.isValidPassword(result.password)
    if(!isMatch) throw createHttpError.Unauthorized('username/password is not valid')

    const accessToken = await signAccessToken(user.id)
    const refreshToken = await signRefreshToken(user.id)
    res.send({accessToken, refreshToken })
    

  }catch(error){
    console.log(error)
    if(error.isJoi === true) return next(createHttpError.BadRequest("Invalid Username/ Password"))
    next(error)
  }
})

router.post('/refresh-token', async(req, res, next) => {
    try{
      const {refreshToken} = req.body
      console.log(refreshToken, "refreshToken")
      if(!refreshToken) throw createHttpError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)
      console.log(userId)
      const accessToken = await signAccessToken(userId)
      const newRefToken = await signRefreshToken(userId)
      res.send({accessToken, refreshToken:newRefToken})
    }catch(error){
      next(error)
    }
})

router.delete('/logout', verifyAccessToken, async(req, res, next) => {
    res.send("refresh route")
})

module.exports = router