const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const { error, success } = require("../utils/responseWrapper")



const signUpController = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!email || !password || !name) {
            return res.send(error(400, "All fields are required"))
        }

        const oldUser = await User.findOne({ email })
        if (oldUser) {
            return res.send(error(409, "User is already registered"))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        return res.send(success(201, "user created successfully"))

    } catch (e) {
        return res.send(error(500, e.message))

    }

}
const loginController = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.send(error(400, "All fields are required"))


        }

        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.send(error(404, "User is not regisered"))

        }

        const matched = await bcrypt.compare(password, user.password)
        if (!matched) {
            return res.send(error(403, "Incorrect password"))
        }

        const acessToken = generateAcessToken({
            _id: user._id
        })
        const refreshToken = generateRefreshToken({
            _id: user._id
        })

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })
        return res.send(success(200, { acessToken }))


    } catch (e) {
        return res.send(error(500, e.message))

    }

}

const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        })
        return res.send(success(200, "user logged out"))
    } catch (e) {
        return res.send(error(500, e.message))

    }
}
// this will check the refreshtoken validity and retutn access token\
const refreshAcessTokenController = async (req, res) => {

    const cookies = req.cookies;
    console.log(cookies)
    if (!cookies.jwt) {
        // return res.status(401).send("Refresh token in cookie is required")
        return res.send(error(401, "Refresh token in cookie is required"))


    }
    const refreshToken = cookies.jwt

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id = decoded._id

        const acessToken = generateAcessToken({ _id })
        return res.send(success(201, { acessToken }))


    }

    catch (e) {
        console.log(e)
        return res.send(error(401, "Invalid Refresh Token"))


    }
}

// internal functions
const generateAcessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "1d" })
        console.log(token)
        return token

    } catch (e) {
        return res.send(error(500, e.message))

    }
}
const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "1y" })
        console.log(token)
        return token

    } catch (error) {
        console.log(error)

    }
}


module.exports = {
    signUpController,
    loginController,
    logoutController,
    refreshAcessTokenController
}