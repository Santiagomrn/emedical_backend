let jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.headers.hasOwnProperty("authorization")) {
        let authorization = req.headers.authorization.split(" ");
        console.log(authorization);
        try {
            var decoded = jwt.verify(authorization[1],process.env.APP_KEY);
            req.context=decoded
            // console.log(req.context)
        } catch (err) {
           return res.status(401).send({ errors: "Unauthorized" })
        }
    }else{
        return res.status(401).send({ errors: "Unauthorized" })
    }
    next()
} 