module.exports = (req, res, next) => {
    if (req.context.role=="doctor") {
        next()
    }else{
        return res.status(401).send({ errors: "Unauthorizad" })
    }
    
} 