module.exports = (req, res, next,arrayroles) => {
    if (roles.includes(req.context.role)) {
        next()
    }else{
        return res.status(401).send({ errors: "Unauthorizad" })
    }
    
} 