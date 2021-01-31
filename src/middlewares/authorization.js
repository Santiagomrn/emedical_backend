let jwt = require('jsonwebtoken');
 /**
   * Authoriza al usurio de accedes a los recursos del sistema,
   * @param {object} res
   * @param {object} req
   * @param {object} req.headers.authorization
   * @returns {object} errores en caso de que el token sea incorreto o haya expirado.
   */
module.exports = (req, res, next) => {
    if (req.headers.hasOwnProperty("authorization")) {
        let authorization = req.headers.authorization.split(" ");
        //console.log(authorization);
        try {
            var decoded = jwt.verify(authorization[1],process.env.APP_KEY);
            req.context=decoded
            console.log(req.context)
        } catch (err) {
           return res.status(401).send({ errors: "Unauthorized" })
        }
    }else{
        return res.status(401).send({ errors: "Unauthorized" })
    }
    next()
} 