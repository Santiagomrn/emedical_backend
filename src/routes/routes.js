const express = require('express');
const router = express.Router();
const pathientRoutes = require('./pathient')
const doctorRoutes = require('./doctor')
const medicalAppointmentRoutes= require('./medicalAppointment')
const managerRoutes= require('./manager');
const authenticationRoutes= require('./authentication')
const authorization = require('../middlewares/authorization')
router.use('/login',authenticationRoutes);

router.use('/pathient',pathientRoutes);
router.use('/doctor',doctorRoutes );
router.use('/medicalAppointment',medicalAppointmentRoutes);
router.use(authorization);
router.use('/manager',managerRoutes);

module.exports = router
