
 /**
   * Valida el rol del usurio 
   * @param {object} res
   * @param {object} req
   * @param {[string]} roles
   * @returns {object} Unauthorized en caso de que los roles no coincidan.
   */
module.exports = function HasRole(roles) {
    return function(req, res, next) {
        console.log(req.context.rol);
        if (roles.includes(req.context.rol)) {
            next()
        }else{
            return res.status(401).send({ errors: "Unauthorized" })
        }
    }
  }
  