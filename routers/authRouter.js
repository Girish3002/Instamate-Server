const { signUpController, loginController, refreshAcessTokenController, logoutController } = require('../controller/authController')

const router = require('express').Router()

router.post('/signup', signUpController)
router.post('/login', loginController)
router.get('/refresh', refreshAcessTokenController)
router.post("/logout", logoutController);

module.exports = router