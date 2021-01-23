const express = require('express');
const router = express.Router();
const pathientRoutes = require('./pathient')
const doctorRoutes = require('./doctor')
const medicalAppointmentRoutes= require('./medicalAppointment')
const managerRoutes= require('./manager');
const authenticationRoutes= require('./authentication')
const authorization = require('../middlewares/authorization')
const isRole = require('../middlewares/isRole');
router.use('/login',authenticationRoutes);

router.use('/pathient',pathientRoutes);
router.use('/doctor',doctorRoutes );
router.use(authorization);
router.use('/medicalAppointment',medicalAppointmentRoutes);
router.use('/manager',managerRoutes);

module.exports = router
