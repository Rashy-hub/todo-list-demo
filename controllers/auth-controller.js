const bcrypt = require('bcrypt')
const UserModel = require('../models/user')
const { generateJWT } = require('../utils/jwt-utils')
const { ErrorResponse } = require('../utils/error-schema')

const authController = {
    register: async (req, res) => {
        const { username, email, password } = req.validatedData

        try {
            // Hashage du mot de passe
            const hashedPassword = await bcrypt.hash(password, 10)

            // Création de l'utilisateur
            const newUser = new UserModel({ username, email, password: hashedPassword })

            // Enregistrement dans la base de données
            const savedUser = await newUser.save()

            // Génération du JWT
            const token = await generateJWT({
                id: savedUser._id,
                pseudo: savedUser.username,
                isAdmin: savedUser.isAdmin,
            })

            res.json({
                title: 'Registration',
                message: `${username} has been registered`,
                token: token.token,
            })
        } catch (error) {
            res.status(422).json(new ErrorResponse('Registration failed: ' + error.message, 422))
        }
    },

    login: async (req, res) => {
        const { email, password } = req.validatedData

        try {
            // Trouver l'utilisateur
            const user = await UserModel.findOne({ email: email })
            if (!user) {
                return res.status(422).json(new ErrorResponse('Invalid credentials', 422))
            }

            // Vérification du mot de passe
            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) {
                return res.status(422).json(new ErrorResponse('Invalid credentials', 422))
            }

            // Génération du JWT
            const token = await generateJWT({
                id: user._id,
                pseudo: user.username,
                isAdmin: user.isAdmin,
            })

            res.json({
                title: 'Logged In',
                message: `${user.username} is logged in`,
                token: token.token,
                user: user.username,
                id: user._id,
            })
        } catch (error) {
            res.status(500).json(new ErrorResponse('Login failed: ' + error.message, 500))
        }
    },

    refresh: async (req, res) => {
        const { email } = req.validatedData

        try {
            const user = await UserModel.findOne({ email: email })
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            // Génération du JWT
            const token = await generateJWT({
                id: user._id,
                pseudo: user.username,
                isAdmin: user.isAdmin,
            })

            res.json({ token: token.token })
        } catch (error) {
            res.status(500).json(new ErrorResponse('Token refresh failed: ' + error.message, 500))
        }
    },
}

module.exports = authController
