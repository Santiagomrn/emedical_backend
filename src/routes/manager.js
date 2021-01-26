'use estrict'
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const router = express.Router();
const managerSchema = require('../schemas/manager')
var Validator = require('jsonschema').Validator;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Manager = require('../database/models/manager');
const authorization = require('../middlewares/authorization');
const isRole = require('../middlewares/isRole');

var v = new Validator();

router.post('/',isRole(['manager']), async (req, res) => {
    //valida el codigo de creación del manager
    if(req.query.code!= process.env.CODE){
        return res.status(401).send({ errors: "Unauthorized" })
    }

    let manager
    let resultValidator = v.validate(req.body, managerSchema)
    if (resultValidator.valid) {
        //hash password
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        //validate email
        try {
            manager = await Manager.query().where("email", req.body.email).first();
            if (manager) {
                return res.status(400).send({ errors: "Email already exist" });
            }
            manager = await Manager.query().insertAndFetch(req.body);
        } catch {
            return res.status(500).send({ errors: "Internal Server Error" });
        }
        return res.status(200).send(manager);
    } else {
        return res.status(400).send({ errors: resultValidator.errors });
    }
})

router.use(authorization);
router.get('/',isRole(['manager']), async (req, res) => {
    //pagination params
    limit = req.query.limit ? req.query.limit : 10
    page = req.query.page ? (req.query.page * limit) : 0

    let manager = await Manager.query().select().limit(limit).offset(page);

    return res.status(200).send(manager);
})
router.get('/:id', isRole(['manager']),async (req, res) => {
    let manager
    try {
        manager = await Manager.query().select().where("id", req.params.id).first();
        if (manager) {
            return res.status(200).send(manager);
        } else {
            return res.status(404).send({ errors: "Not Found" });
        }
    } catch {
        return res.status(500).send({ errors: "Internal Server Error" });
    }

})
router.delete('/:id', isRole(['manager']),async (req, res) => {
    let manager = await Manager.query().deleteById(req.params.id);
    if (manager == 1) {
        return res.status(200).send({ message: "ok" });
    } else {
        return res.status(404).send({ errors: "Not Found" })
    }

})

module.exports= router;