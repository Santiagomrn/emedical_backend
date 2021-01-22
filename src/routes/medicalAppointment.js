'use estrict'
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const router = express.Router();
const medicalAppointmentSchema = require('../schemas/medicalAppointment');
var Validator = require('jsonschema').Validator;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const MedicalAppointment = require('../database/models/medicalAppointment');

var v = new Validator();
router.post('/', async (req, res) => {

    //valida los datos de entrada
    let resultValidator = v.validate(req.body, medicalAppointmentSchema)
    if (resultValidator.valid) {

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
            let medicalAppointment = await MedicalAppointment.query().insertAndFetch(req.body).withGraphFetched('[doctor,pathient]');;
            return res.status(200).send(medicalAppointment);
        } catch (err) {
            //console.log(err)
            return res.status(500).send({ errors: "Internal Server Error" });
        }
    } else {
        return res.status(400).send({ errors: resultValidator.errors });
    }
})


router.get('/', async (req, res) => {
    //pagination params
    limit = req.query.limit ? req.query.limit : 16
    page = req.query.page ? (req.query.page * limit) : 0

    let today = new Date();
    let date = req.query.date ? (req.query.date) : today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate()

    console.log(date);
    try {
        let medicalAppointment = await MedicalAppointment.query().select().withGraphFetched('[doctor,pathient]').limit(limit).offset(page);
        return res.status(200).send(medicalAppointment);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ errors: "Internal Server Error" });
    }
})
router.get('/:id', async (req, res) => {
    let medicalAppointment
    try {
        medicalAppointment = await MedicalAppointment.query().select().where("id", req.params.id).withGraphFetched('[doctor,pathient]').first();
        if (medicalAppointment) {
            return res.status(200).send(medicalAppointment);
        } else {
            return res.status(404).send({ errors: "Not Found" });
        }
    } catch {
        return res.status(500).send({ errors: "Internal Server Error" });
    }
})

router.put('/:id',async (req, res) => {
    //valida los datos de entrada
    let resultValidator = v.validate(req.body, medicalAppointmentSchema)
    if (resultValidator.valid) {

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
            let medicalAppointment = await MedicalAppointment.query().updateAndFetchById(req.params.id,req.body).withGraphFetched('[doctor,pathient]');
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
router.delete('/:id', async (req, res) => {
    let medicalAppointment;
    try{
        medicalAppointment= await MedicalAppointment.query().findById(req.params.id);
    }catch(err){
        res.status(500).send({errors: "Internal Server Error"})
    }
    if (medicalAppointment) {
        let todayDate = new Date();
        let medicalAppointmentDate=new Date(medicalAppointment.date);
        if(todayDate>medicalAppointmentDate){
            return res.status(403).send({ errors: "Forbidden" })
        }
        try{
            medicalAppointment= await MedicalAppointment.query().deleteById(req.params.id);
        }catch(err){
            res.status(500).send({errors: "Internal Server Error"})
        }
        return res.status(200).send({ message: "ok" });
    } else {
        return res.status(404).send({ errors: "Not Found" })
    }
})

module.exports = router