const express = require('express');
const router = express.Router();
const pathientRoutes = require('./pathient')
const doctorRoutes = require('./doctor');
const medicalAppointmentRoutes= require('./medicalAppointment');
const managerRoutes= require('./manager');
const authenticationRoutes= require('./authentication');
const authorization = require('../middlewares/authorization');

/**
 *rutas login.
 */
router.use('/login',authenticationRoutes);
/**
 *rutas paciente.
 */
router.use('/pathient',pathientRoutes);
/**
 *rutas doctor.
 */
router.use('/doctor',doctorRoutes );
/**
 *rutas cita medica.
 */
router.use('/medicalAppointment',medicalAppointmentRoutes);
/**
 *rutas manager.
 */
router.use('/manager',managerRoutes);

module.exports = router
