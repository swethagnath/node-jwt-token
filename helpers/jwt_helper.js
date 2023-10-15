const JWT = require('jsonwebtoken')
const createHttpError = require('http-errors')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
                name: "yours truly",
                userId
            }
            const secret = process.env.ACCESS_TOKEN
            const options = {
                expiresIn: "1h"
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) reject(createHttpError.InternalServerError())
                resolve(token)
            })
        })
    },
    
    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createHttpError.Unauthorized())

        const authHeader = req.header['authorization']
        const bearerToken = authHeader.split("")
        const token = bearerToken[1]
        JWT.verify(token, procees.env.ACCESS_TOKEN, (err, payload) => {
            if(err){
                return next(createHttpError.Unauthorized())

            }
        })

    }
}