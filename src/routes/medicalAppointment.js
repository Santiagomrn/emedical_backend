'use estrict'
const express = require('express');

const router = express.Router();
const medicalAppointmentSchema = require('../schemas/medicalAppointment');
const authorization = require('../middlewares/authorization');
var Validator = require('jsonschema').Validator;
const MedicalAppointment = require('../database/models/medicalAppointment');
const Doctor = require('../database/models/doctor');
var nodemailer = require('nodemailer');
const isRole = require('../middlewares/isRole');
var emailKeys = require('../mail/keys.json');
const crypto = require("crypto");
var v = new Validator();

router.get('/QR/:QR', 
/**
 * Retorna información de la cita que corresponde al codigo QR
 * @param {string} req.params.QR
 * @returns {string} retorna informacion sobre sobre la cita.
 */
async (req, res) => {
    try { 
        let medicalAppointment = await MedicalAppointment.query().select().where('QRCode',req.params.QR).withGraphFetched('[doctor,pathient]').first();
        if (medicalAppointment) {
            //return res.status(200).send(medicalAppointment);
            res.send(/*html*/`
            <h1>Medical Appointment Information</h1>
            <p><strong>Pathient:</strong> ${medicalAppointment.pathient.name+" "+medicalAppointment.pathient.lastName} <p>
           <p><strong>Date:</strong> ${medicalAppointment.date} <p>
           <p><strong>Time:</strong> ${medicalAppointment.time} <p>
           <p><strong>Turn:</strong> ${medicalAppointment.turn} <p>
           <p><strong>Doctor Name:</strong> ${medicalAppointment.doctor.name} <p>
           <p><strong>Doctor Area:</strong> ${medicalAppointment.doctor.medicalArea} <p>`)
        } else {
            return res.status(404).send({ errors: "Not Found" });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ errors: "Internal Server Error" });
    }
});
////////////// autorization required//////////////
router.use(authorization);
router.get('/turn/NotAvailable',isRole(['pathient', 'doctor', 'manager']),
/**
 * Retorna información sobre los turnos de citas no disponibles u ocupados de ese dia.
 * @param {string} req.query.date
 * @returns {object} Retorna información sobre los turnos de citas no disponibles u ocupados de ese dia.
 */
async (req,res)=>{
    if(req.query.date){
        let medicalAppointment = await MedicalAppointment.query().select('turn').where('date',req.query.date);
        return res.status(200).send(medicalAppointment);
    }else{
        return res.status(400).send({errors: "bad request"})
    }
});

router.get('/:id/QR', isRole(['pathient']), 
/**
 * Genera el codigo QR para el acceso a la informacion de la cita.
 * @param {string} req.params.id
 * @returns {object} Retorna un link que permite acceder a la informacio de la cita
 */
async (req, res) => {
    try {
        //valida que la cita medica sea del paciente que solicita la actualizacion
        let medicalAppointment = await MedicalAppointment.query().select().where("id", req.params.id).withGraphFetched('[doctor,pathient]').first();
        if(!medicalAppointment){
            return res.status(404).send({ errors: "Not Found" });
        }
        if (medicalAppointment.pathientId != req.context.id) {
            return res.status(401).send({ errors: "Unauthorized" })
        }
    
        //generate crypto
        const hmac = crypto.createHmac('sha256', process.env.PORT);
        hmac.update(JSON.stringify(medicalAppointment));
        let hash=hmac.digest('hex');
  
        medicalAppointment = await MedicalAppointment.query().select().patchAndFetchById(req.params.id,{QRCode:hash});
        
        return res.status(200).send({link:process.env.HOST+"/api/v1/medicalAppointment/QR/"+hash});
    } catch (err) {
        console.log(err)
        return res.status(500).send({ errors: "Internal Server Error" });
    }

});

router.post('/', isRole(['pathient']), async (req, res) => {

    //valida los datos de entrada
    let resultValidator = v.validate(req.body, medicalAppointmentSchema);
    if (resultValidator.valid) {
        let todayDate = new Date();
        let medicalAppointmentDate = new Date(req.body.date);
        if (todayDate > medicalAppointmentDate) {
            return res.status(403).send({ errors: "Forbidden" })
        }
        //valida que el medico existeKK
        let doctor = await Doctor.query().select().where("id", req.body.doctorId).first();
        if (!doctor) {
            return res.status(404).send({ errors: "The Doctor not exist" });
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
            const transporter = nodemailer.createTransport(emailKeys);

            var mailOptions = {
                from: 'Medical Portal <noreply.medicalportal@gmail.com>',
                to: 'cosasutilesparagenteutil@gmail.com',
                subject: 'Medical Portal Pathient Account',
                text: `Medical Appointment`,
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
            console.log(err)
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
        //return only related infoK
        let medicalAppointment;
        if ((req.context.rol == 'pathient')) {
            medicalAppointment = await MedicalAppointment.query().select().where('pathientId', req.context.id).withGraphFetched('[doctor,pathient]').limit(limit).offset(page).orderBy('date', 'desc');
        }
        if ((req.context.rol == 'doctor')) {
            medicalAppointment = await MedicalAppointment.query().select().where('doctorId', req.context.id).withGraphFetched('[doctor,pathient]').limit(limit).offset(page).orderBy('date', 'desc');
        }
        if ((req.context.rol == 'manager')) {
            medicalAppointment = await MedicalAppointment.query().select().withGraphFetched('[doctor,pathient]').limit(limit).offset(page).orderBy('date', 'desc');
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
        //valida que el medico existe
        let doctor = await Doctor.query().select().where("id", req.body.doctorId).first();
        if (!doctor) {
            return res.status(404).send({ errors: "The Doctor not exist" });
        }
     
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