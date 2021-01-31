"use estrict";
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const router = express.Router();
const doctorSchema = require("../schemas/doctor");
var Validator = require("jsonschema").Validator;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const authorization = require("../middlewares/authorization");
const Doctor = require("../database/models/doctor");
const isRole = require("../middlewares/isRole");
var v = new Validator();

router.get(
  "/",
  /**
   * Retorna lista de doctores
   * @param {object} res
   * @param {object} req
   * @param {int} req.query.limit
   * @param {int} req.query.page
   * @returns {object} Restorna una lista de doctores con paginacion.
   */
  async (req, res) => {
    limit = req.query.limit ? req.query.limit : 10;
    page = req.query.page ? req.query.page * limit : 0;
    let doctors = await Doctor.query().select().limit(limit).offset(page);
    return res.status(200).send(doctors);
  }
);

router.get(
  "/:id",
  /**
   * Retorna informacion de un doctor
   * @param {object} res
   * @param {object} req
   * @param {int} req.params.id
   * @returns {object} Retorna informacion de un doctor con la req.params.id como id, con paginacion.
   */
  async (req, res) => {
    let doctor;
    try {
      doctor = await Doctor.query().select().where("id", req.params.id).first();
      if (doctor) {
        return res.status(200).send(doctor);
      } else {
        return res.status(404).send({ errors: "Not Found" });
      }
    } catch {
      return res.status(500).send({ errors: "Internal Server Error" });
    }
  }
);

////////////// autorization required//////////////
/**
    Uso de mideware de autorizacion
*/
router.use(authorization);
router.post("/", isRole(["manager"]),
  /**
   * Guarda información de un nuevo doctor en la base de datos
   * @param {object} res
   * @param {object} req
   * @param {object} req.body
   * @returns {object} Retorna informacion del nuevo doctor generado.
   */
async (req, res) => {
  let doctor;
  let resultValidator = v.validate(req.body, doctorSchema);

  if (resultValidator.valid) {
    //hash password
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    //validate email
    try {
      doctor = await Doctor.query().where("email", req.body.email).first();
      if (doctor) {
        return res.status(400).send({ errors: "Email already exist" });
      }
      doctor = await Doctor.query().where("phone", req.body.phone).first();
      if (doctor) {
        return res.status(400).send({ errors: "Phone already exist" });
      }

      doctor = await Doctor.query().insertAndFetch(req.body);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ errors: "Internal Server Error" });
    }

    return res.status(200).send(doctor);
  } else {
    return res.status(400).send({ errors: resultValidator.errors });
  }
});

router.delete("/:id", isRole(["manager"]), 
  /**
   * Elimina la informacion de un doctor con id igual a req.params.id existente en el sitema.
   * @param {object} res
   * @param {object} req
   * @param {object} req.params.id
   * @returns {object} Retorna ok o Not Found .
   */
async (req, res) => {
  let doctor = await Doctor.query().deleteById(req.params.id);
  if (doctor == 1) {
    return res.status(200).send({ message: "ok" });
  } else {
    return res.status(404).send({ errors: "Not Found" });
  }
});

module.exports = router;
