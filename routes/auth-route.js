const express = require('express')
const authController = require('../controllers/auth-controller')
const bodyValidation = require('../middleware/body-validation')
const { registerValidator, loginValidator, refreshValidator } = require('../validators/auth-validators')

const authRouter = express.Router()

authRouter.post('/auth/register', bodyValidation(registerValidator), authController.register)
authRouter.post('/auth/login', bodyValidation(loginValidator), authController.login)
authRouter.post('/auth/refresh', bodyValidation(refreshValidator), authController.refresh)

module.exports = authRouter
