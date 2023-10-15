const JWT = require('jsonwebtoken')

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
                if(err) reject(err)
                resolve(token)
            })
        })
    }
}