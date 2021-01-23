'use estrict'
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const router = express.Router();
const medicalAppointmentSchema = require('../schemas/medicalAppointment');
const Pathient = require('../database/models/pathient');
var Validator = require('jsonschema').Validator;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const MedicalAppointment = require('../database/models/medicalAppointment');
var nodemailer = require('nodemailer');
const isRole = require('../middlewares/isRole');
require('dotenv').config();

var v = new Validator();
router.post('/', isRole(['pathient']), async (req, res) => {

    //valida los datos de entrada
    let resultValidator = v.validate(req.body, medicalAppointmentSchema);
    if (resultValidator.valid) {
        let todayDate = new Date();
        let medicalAppointmentDate = new Date(req.body.date);
        if (todayDate > medicalAppointmentDate) {
            return res.status(403).send({ errors: "Forbidden" })
        }

        //valida que la fecha y turno solicitado este disponible
        let reservation = await MedicalAppointment.query().select('*').where('date', req.body.date).where('turn', req.body.turn).where('doctorId', req.body.doctorId).first();
        if (reservation) {
            return res.status(409).send({ errors: "The MedicalAppointment already exist" });
        }

        //Crea la hora de la cita con base en el turno solicitado
        let medicalAppointmentTime = new Date("2011-04-20T08:00:00.00");
        medicalAppointmentTime.setTime(medicalAppointmentTime.getTime() + ((1000 * 60) * 30) * (req.body.turn - 1));
        req.body.time = medicalAppointmentTime.getHours() + ":" + medicalAppointmentTime.getMinutes() + ":" + medicalAppointmentTime.getSeconds();
        req.body.pathientId = req.context.id;
        //inserta la cita en la base de datos
        try {
            let medicalAppointment = await MedicalAppointment.query().insertAndFetch(req.body).withGraphFetched('[doctor,pathient]');

            //send Email
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                }
            });

            var mailOptions = {
                from: 'Medical Portal <noreply.medicalportal@gmail.com>',
                to: 'cosasutilesparagenteutil@gmail.com',
                subject: 'Medical Portal Pathient Account',
                text: `Hi create account.`,
                html:/*html*/`
                    <h1>Medical Appointment Created</h1>
                    <p><strong>Date:</strong> ${medicalAppointment.date} <p>
                    <p><strong>Time:</strong> ${medicalAppointment.time} <p>
                    <p><strong>Turn:</strong> ${medicalAppointment.turn} <p>
                    <p><strong>Doctor Name:</strong> ${medicalAppointment.doctor.name} <p>
                    <p><strong>Doctor Area:</strong> ${medicalAppointment.doctor.medicalArea} <p>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            return res.status(200).send(medicalAppointment);
        } catch (err) {
            //console.log(err)
            return res.status(500).send({ errors: "Internal Server Error" });
        }
    } else {
        return res.status(400).send({ errors: resultValidator.errors });
    }
})


router.get('/', isRole(['pathient', 'doctor', 'manager']), async (req, res) => {
    //pagination params
    limit = req.query.limit ? req.query.limit : 16
    page = req.query.page ? (req.query.page * limit) : 0

    let today = new Date();
    let date = req.query.date ? (req.query.date) : today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate()

    console.log(date);
    try {
        //return only related info
        let medicalAppointment;
        if ((req.context.rol == 'pathient')) {
            medicalAppointment = await MedicalAppointment.query().select().where('pathientId', req.context.id).withGraphFetched('[doctor,pathient]').limit(limit).offset(page);
        }
        if ((req.context.rol == 'doctor')) {
            medicalAppointment = await MedicalAppointment.query().select().where('doctorId', req.context.id).withGraphFetched('[doctor,pathient]').limit(limit).offset(page);
        }
        if ((req.context.rol == 'manager')) {
            medicalAppointment = await MedicalAppointment.query().select().withGraphFetched('[doctor,pathient]').limit(limit).offset(page);
        }

        return res.status(200).send(medicalAppointment);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ errors: "Internal Server Error" });
    }
})
router.get('/:id', isRole(['pathient', 'doctor', 'manager']), async (req, res) => {
    let medicalAppointment
    try {
        medicalAppointment = await MedicalAppointment.query().select().where("id", req.params.id).withGraphFetched('[doctor,pathient]').first();
        if ((req.context.rol == 'pathient') && (medicalAppointment.pathientId != req.context.id)) {
            return res.status(401).send({ errors: "Unauthorized" })
        }
        if (medicalAppointment) {
            return res.status(200).send(medicalAppointment);
        } else {
            return res.status(404).send({ errors: "Not Found" });
        }
    } catch {
        return res.status(500).send({ errors: "Internal Server Error" });
    }
})

router.put('/:id', isRole(['pathient', 'manager']), async (req, res) => {
    //valida los datos de entrada
    let resultValidator = v.validate(req.body, medicalAppointmentSchema)
    if (resultValidator.valid) {

        if ((req.context.rol == 'pathient')) {
            //valida que la cita medica sea del paciente que solicita la actualizacion
            let medicalAppointment = await MedicalAppointment.query().select().where("id", req.params.id).withGraphFetched('[doctor,pathient]').first();
            if (medicalAppointment.pathientId != req.context.id) {
                return res.status(401).send({ errors: "Unauthorized" })
            }
        }

        //valida que la fecha y turno solicitado este disponible
        let reservation = await MedicalAppointment.query().select('*').where('date', req.body.date).where('turn', req.body.turn).where('doctorId', req.body.doctorId).first();
        if (reservation) {
            return res.status(409).send({ errors: "The MedicalAppointment already exist" });
        }

        //Crea la hora de la cita con base en el turno solicitado
        let medicalAppointmentTime = new Date("2011-04-20T08:00:00.00");
        medicalAppointmentTime.setTime(medicalAppointmentTime.getTime() + ((1000 * 60) * 30) * (req.body.turn - 1));
        req.body.time = medicalAppointmentTime.getHours() + ":" + medicalAppointmentTime.getMinutes() + ":" + medicalAppointmentTime.getSeconds();

        req.body.pathientId = req.context.id;
        //inserta la cita en la base de datos
        try {
            let medicalAppointment = await MedicalAppointment.query().updateAndFetchById(req.params.id, req.body).withGraphFetched('[doctor,pathient]');
            if (medicalAppointment) {
                return res.status(200).send(medicalAppointment);
            } else {
                return res.status(404).send({ errors: "Not Found" });
            }
        } catch (err) {
            //console.log(err)
            return res.status(500).send({ errors: "Internal Server Error" });
        }
    } else {
        return res.status(400).send({ errors: resultValidator.errors });
    }
})
router.delete('/:id', isRole(['pathient', 'manager']), async (req, res) => {
    let medicalAppointment;
    try {
        medicalAppointment = await MedicalAppointment.query().findById(req.params.id);
        //valida que la cita medica sea del paciente que solicita el borrado 
        if ((req.context.rol == 'pathient') && (medicalAppointment.pathientId != req.context.id)) {
            return res.status(401).send({ errors: "Unauthorized" })
        }
    } catch (err) {
        res.status(500).send({ errors: "Internal Server Error" })
    }
    if (medicalAppointment) {
        let todayDate = new Date();
        let medicalAppointmentDate = new Date(medicalAppointment.date);
        if (todayDate > medicalAppointmentDate) {
            return res.status(403).send({ errors: "Forbidden" })
        }
        try {
            medicalAppointment = await MedicalAppointment.query().deleteById(req.params.id);
        } catch (err) {
            res.status(500).send({ errors: "Internal Server Error" })
        }
        return res.status(200).send({ message: "ok" });
    } else {
        return res.status(404).send({ errors: "Not Found" })
    }
})

module.exports = router