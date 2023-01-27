const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { error } = require('../utils/responseWrapper');


module.exports = async (req, res, next) => {

    if (
        !req.headers ||
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer")) {
        // return res.status(401).send("Authorization header is required")
        return res.send(error(401, "Authorization header is required"))

    }
    const acessToken = req.headers.authorization.split(" ")[1]

    try {
        const decoded = jwt.verify(acessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        req._id = decoded._id

        const user = await User.findById(req._id);
        if (!user) {
            return res.send(error(404, "User not found"))  // when account is deletted or user not exists
        }

        next()
    }
      
    catch (e) {
        console.log(e)
        // return res.status(401).send("Invalid Acess key")
        return res.send(error(401, "Invalid Acess key"))


    }

    console.log(acessToken)
}
