module.exports = function HasRole(role) {
    return function(req, res, next) {
        if (roles.includes(req.context.role)) {
            next()
        }else{
            return res.status(401).send({ errors: "Unauthorized" })
        }
    }
  }
  