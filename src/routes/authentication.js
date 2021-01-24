'use estrict'
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
var jwt = require('jsonwebtoken');
const Pathient = require('../database/models/pathient');
const Doctor = require('../database/models/doctor');
const Manager = require('../database/models/manager');

router.post('/pathient',async(req,res)=>{
    let pathient;
   
    pathient=await Pathient.query().select().where("email",req.body.email).first();
 
    if(!pathient){
        return res.status(401).send({ errors: "invalid email"});
    }

    if(bcrypt.compareSync(req.body.password, pathient.password)){
        let payload ={
            rol:"pathient",
            id:pathient.id
        }
        let token=jwt.sign(payload,process.env.APP_KEY, { expiresIn: 60 * 30 });
        return res.status(200).send({token:token, id:pathient.id, rol:"pathient"});
    }else{
        return res.status(401).send({ errors: "invalid password" });
    }
});
router.post('/doctor',async(req,res)=>{
    let doctor=await Doctor.query().select().where("email",req.body.email).first();
    if(!doctor){
        return res.status(401).send({ errors: "invalid email"});
    }

    if(bcrypt.compareSync(req.body.password, doctor.password)){
        let payload ={
            rol:"doctor",
            id:doctor.id
        }
        let token=jwt.sign(payload,process.env.APP_KEY, { expiresIn: 60 * 30 });
        return res.status(200).send({token:token,rol:"doctor",
        id:doctor.id});
    }else{
        return res.status(401).send({ errors: "invalid password"});
    }
});

router.post('/manager',async(req,res)=>{
    let manager=await Manager.query().select().where("email",req.body.email).first();
    if(!manager){
        return res.status(401).send({ errors: "invalid email"});
    }
    if(bcrypt.compareSync(req.body.password, manager.password)){
        let payload ={
            rol:"manager",
            id:manager.id
        }
        let token=jwt.sign(payload,process.env.APP_KEY, { expiresIn: 60 * 30 });
        return res.status(200).send({token:token,rol:"manager",
        id:manager.id});
    }else{
        return res.status(401).send({ errors: "invalid password" });
    }
});
module.exports= router;