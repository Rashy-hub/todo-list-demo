const jwt = require('jsonwebtoken')

// Génération du JWT
const generateJWT = ({ id, pseudo, isAdmin }) => {
    return new Promise((resolve, reject) => {
        const data = { id, pseudo, isAdmin }
        const secret = process.env.JWT_SECRET

        if (!secret) {
            return reject(new Error('JWT secret not defined in environment'))
        }

        const options = {
            algorithm: 'HS512', // Algorithme pour la signature du token
            audience: process.env.JWT_AUDIENCE || 'default_audience',
            issuer: process.env.JWT_ISSUER || 'default_issuer',
            expiresIn: '1y', // Durée de validité du token
        }

        jwt.sign(data, secret, options, (error, token) => {
            if (error) {
                return reject(new Error(`Token generation error: ${error.message}`))
            }

            const decodedToken = jwt.decode(token)
            if (!decodedToken || !decodedToken.exp) {
                return reject(new Error('Token decoding error'))
            }

            const expire = new Date(decodedToken.exp * 1000).toISOString()
            resolve({ token, expire })
        })
    })
}

// Décodage du JWT
const decodeJWT = (token) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.JWT_SECRET

        if (!secret) {
            return reject(new Error('JWT secret not defined in environment'))
        }

        jwt.verify(token, secret, (error, data) => {
            if (error) {
                return reject(new Error('Invalid JWT'))
            }
            resolve({
                id: data.id,
                pseudo: data.pseudo,
                isAdmin: data.isAdmin,
            })
        })
    })
}

module.exports = {
    generateJWT,
    decodeJWT,
}
