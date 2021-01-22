'use estrict'
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const router = express.Router();
const doctorSchema = require('../schemas/doctor')
var Validator = require('jsonschema').Validator;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Doctor = require('../database/models/doctor');

var v = new Validator();
router.post('/', async (req,res)=>{
    let doctor
    let resultValidator = v.validate(req.body, doctorSchema)

    if (resultValidator.valid) {
        //hash password
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        //validate email
        try {
            doctor = await Doctor.query().where("email", req.body.email).first();
            if (doctor) {
                return res.status(400).send({ errors: "Email already exist" });
            }

            doctor = await Doctor.query().insertAndFetch(req.body);
        } catch(err) {
            console.log(err);
            return res.status(500).send({ errors: "Internal Server Error" });
        }

        return res.status(200).send(doctor);
    } else {
        return res.status(400).send({ errors: resultValidator.errors });
    }
})
router.get('/',async (req,res)=>{
        //pagination params
        limit = req.query.limit ? req.query.limit : 10
        page = req.query.page ? (req.query.page * limit) : 0
    
        let doctors = await Doctor.query().select().limit(limit).offset(page);
    
        return res.status(200).send(doctors);
});

router.get('/:id',async (req,res)=>{
    let doctor
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
});

router.put('/:id',async (req,res)=>{
    let doctor
    let resultValidator = v.validate(req.body, doctorSchema)

    if (resultValidator.valid) {
        try {
            doctor = await Doctor.query().where("email", req.body.email).first();

            if (doctor) {
                return res.status(400).send({ errors: "Email already exist" });
            }

            doctor = await Doctor.query().updateAndFetchById(req.params.id, req.body);

        } catch {
            return res.status(500).send({ errors: "Internal Server Error" });
        }

        if (doctor) {
            return res.status(200).send(doctor);
        } else {
            return res.status(404).send({ errors: "Not Found" });
        }
    } else {
        return res.status(400).send({ errors: resultValidator.errors });
    }
});
router.delete('/:id', async (req,res)=>{
    let doctor = await Doctor.query().deleteById(req.params.id);
    if (doctor == 1) {
        return res.status(200).send({ message: "ok" });
    } else {
        return res.status(404).send({ errors: "Not Found" })
    }
});

module.exports = router