const express = require('express');
const router = express.Router();
const pathientRoutes = require('./pathient')
const doctorRoutes = require('./doctor')
const medicalAppointmentRoutes= require('./medicalAppointment')
const authenticationRoutes= require('./authentication')
const authorization = require('../middlewares/authorization')

router.use('/login',authenticationRoutes);


router.use('/pathient',pathientRoutes);

router.use('/doctor',doctorRoutes );
//autorization///
router.use(authorization);
router.use('/medicalAppointment',medicalAppointmentRoutes);

module.exports = router
