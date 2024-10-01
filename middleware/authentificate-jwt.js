const { decodeJWT } = require('../utils/jwt-utils')
const UserModel = require('../models/user')

/**
 * Middleware d'authentification via les JSON Web Token
 * @param {{adminRight: boolean}} options
 * @returns {(req: Request, res: Response, next: NextFunction) => Void}
 */
const authentificateJwt = (options = { adminRight: false }) => {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization']

        const token = authHeader && authHeader.split(' ')[1]

        // Si aucun token n'a été reçu, erreur 401.
        if (!token) {
            return res.sendStatus(401)
        }

        try {
            const tokenData = await decodeJWT(token)

            // Vérification des droits de l'utilisateur si le flag "adminRight" est présent
            if (options.adminRight) {
                const admin = await UserModel.findOne({ _id: tokenData.id, isAdmin: true })
                if (!admin) {
                    return res.sendStatus(403)
                }
            }

            // Ajout des infos du token à l'objet "request" de Express
            req.user = tokenData

            // On continue :)
            next()
        } catch (error) {
            console.log(error)
            res.sendStatus(403)
        }
    }
}

module.exports = {
    authentificateJwt,
}
