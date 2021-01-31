"use estrict";
const express = require("express");
// const fileUpload = require('express-fileupload');
const path = require("path");
const router = express.Router();
const pathientSchema = require("../schemas/pathient");
var Validator = require("jsonschema").Validator;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Pathient = require("../database/models/pathient");
const authorization = require("../middlewares/authorization");
const isRole = require("../middlewares/isRole");
const nodemailer = require("nodemailer");
var emailKeys = require("../mail/keys.json");
var v = new Validator();

//everyone can create a pathient account
router.post(
  "/",
  /**
   * Guarda información de un nuevo paciente en la base de datos
   * @param {object} res
   * @param {object} req
   * @param {object} req.body
   * @returns {object} Retorna informacion del nuevo paciente generado.
   */
  async (req, res) => {
    let pathient;
    let resultValidator = v.validate(req.body, pathientSchema);

    if (resultValidator.valid) {
      let password = req.body.password;
      //hash password
      req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
      //validate email
      try {
        pathient = await Pathient.query()
          .where("email", req.body.email)
          .first();
        if (pathient) {
          return res.status(400).send({ errors: "Email already exist" });
        }

        pathient = await Pathient.query().insertAndFetch(req.body);
      } catch {
        return res.status(500).send({ errors: "Internal Server Error" });
      }

      //send Email
      const transporter = nodemailer.createTransport(emailKeys);

      var mailOptions = {
        from: "Medical Portal <noreply.medicalportal@gmail.com>",
        to: "cosasutilesparagenteutil@gmail.com",
        subject: "Medical Portal Pathient Account",
        text: `Hi create account.`,
        html: /*html*/ `
            <h1>Welcome to medical Portal</h1>
            <p><strong>Email:</strong> ${pathient.email} <p>
            <p><strong>Password:</strong> ${password} <p>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.status(200).send(pathient);
    } else {
      return res.status(400).send({ errors: resultValidator.errors });
    }
  }
);

////////////// autorization required//////////////
/**
    Uso de mideware de autorizacion
*/
router.use(authorization);

router.get(
  "/",
  isRole(["doctor", "manager"]),
  /**
   * Retorna lista de pacientes
   * @param {object} res
   * @param {object} req
   * @param {int} req.query.limit
   * @param {int} req.query.page
   * @returns {object} Restorna una lista de pacientes con paginacion.
   */
  async (req, res) => {
    //pagination params
    let limit = req.query.limit ? req.query.limit : 10;
    let page = req.query.page ? req.query.page * limit : 0;
    if (req.query.name) {
      await Pathient.query()
        .select()
        .where("name", "like", "%" + req.query.name + "%")
        .orWhere("lastName", "like", "%" + req.query.name + "%")
        .limit(limit)
        .offset(page);
    }
    let pathients = await Pathient.query().select().limit(limit).offset(page);

    return res.status(200).send(pathients);
  }
);

router.get(
  "/:id",
  isRole(["doctor", "manager", "pathient"]),
  /**
   * Retorna informacion de un paciente
   * @param {object} res
   * @param {object} req
   * @param {int} req.params.id
   * @returns {object} Retorna informacion de un paciente con la req.params.id como id.
   */
  async (req, res) => {
    let pathient;

    try {
      //validate if is his account
      if (req.context.rol == "pathient" && req.params.id != req.context.id) {
        return res.status(401).send({ errors: "Unauthorized" });
      }

      pathient = await Pathient.query()
        .select()
        .where("id", req.params.id)
        .first();

      if (pathient) {
        return res.status(200).send(pathient);
      } else {
        return res.status(404).send({ errors: "Not Found" });
      }
    } catch {
      return res.status(500).send({ errors: "Internal Server Error" });
    }
  }
);

router.put(
  "/:id",
  isRole(["pathient", "manager"]),
  /**
   * Actualiza la informacion de un paciente con la req.params.id como id
   * @param {object} res
   * @param {object} req
   * @param {int} req.params.id
   * @param {object} req.body
   * @returns {object} Retorna informacion actualizada de un paciente con la req.params.id como id.
   */
  async (req, res) => {
    let pathient;
    //validate if is his account
    if (req.context.rol == "pathient" && req.params.id != req.context.id) {
      return res.status(401).send({ errors: "Unauthorized" });
    }
    let resultValidator = v.validate(req.body, pathientSchema);

    if (resultValidator.valid) {
      try {
        pathient = await Pathient.query()
          .where("email", req.body.email)
          .first();

        if (pathient) {
          return res.status(400).send({ errors: "Email already exist" });
        }

        pathient = await Pathient.query().updateAndFetchById(
          req.params.id,
          req.body
        );
      } catch {
        return res.status(500).send({ errors: "Internal Server Error" });
      }

      if (pathient) {
        return res.status(200).send(pathient);
      } else {
        return res.status(404).send({ errors: "Not Found" });
      }
    } else {
      return res.status(400).send({ errors: resultValidator.errors });
    }
  }
);
router.delete(
  "/:id",
  isRole(["manager"]),
  /**
   * Elimina la informacion de un paciente con id igual a req.params.id existente en el sitema.
   * @param {object} res
   * @param {object} req
   * @param {object} req.params.id
   * @returns {object} Retorna ok o Not Found.
   */
  async (req, res) => {
    //validate if is his account
    if (req.context.rol == "pathient" && req.params.id != req.context.id) {
      return res.status(401).send({ errors: "Unauthorized" });
    }
    let pathient = await Pathient.query().deleteById(req.params.id);
    if (pathient == 1) {
      return res.status(200).send({ message: "ok" });
    } else {
      return res.status(404).send({ errors: "Not Found" });
    }
  }
);

// //image upload
// router.use(fileUpload());

// router.put('/:id/image_profile', async (req, res) => {
//     //console.log(req.files.file); // the uploaded file object
//     let profile_picture = req.files.file;
//     profile_picture.mv(__dirname + '/../pictures/' + req.files.file.md5 + ".jpg");
//     let pathient
//     try {
//         pathient = await Pathient.query()
//             .patchAndFetchById(req.params.id, { imageProfile: req.files.file.md5 });
//         console.log(pathient)
//     } catch {
//         return res.status(500).send({ errors: "Internal Server Error" });
//     }
//     return res.status(200).send(pathient);
// });

// //get image upload
// router.get('/image_profile/:id_image', (req, res) => {
//     let fileName = req.params.id_image + ".jpg";
//     res.status(200).sendFile(path.join(__dirname, '../pictures/') + fileName, (err) => {
//         if (err) {
//             res.status(404).send();
//         }
//     });
// });

module.exports = router;
