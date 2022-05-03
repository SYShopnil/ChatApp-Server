const jwt  = require('jsonwebtoken')
require('dotenv').config()
const User = require('../src/model/user')

const authenticationMiddleware = async (req, res, next) => {
    try {
        // const token = req.header('Authorization') //get the token from headers
        const {auth:token} = req.cookies //get the token from headers
        //get the dot env file data
        const securityCode = process.env.JWT_CODE //ge the security code from dot env
        if(!token) {
            res.json ({
                message: "Unauthorized user"
            })
        }else {
            const isValidToken = await jwt.verify(token, securityCode) //check that is it a valid token or not
            if(isValidToken) {
                const {email, sex} = isValidToken //store the token data as a verified userType
                const user = await User.findOne ({
                    email,
                    sex,
                    isDelete: false
                }) // find the user
                if (user) {
                    req.user = user;
                    next ();
                }else {
                    res.json ({
                        message: "Unauthorized user"
                    })
                }
            }else {
                res.json ({
                    message: "Unauthorized user"
                })
            }
        }
    }catch(err) {
        console.log(err);
        req.isAuth = false
        next ()
        console.log(err)
    }
}

module.exports = authenticationMiddleware