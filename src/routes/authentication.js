'use estrict'
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
var jwt = require('jsonwebtoken');
const Pathient = require('../database/models/pathient');
const Doctor = require('../database/models/doctor');

router.post('/pathient',async(req,res)=>{
    let pathient;
    try{
        pathient=await Pathient.query().select().where("email",req.body.email).first();
    }catch(err){
        res.send(500).send({errors:"internal server error"});
    }
  
    if(!pathient){
        return res.status(401).send({ errors: "invalid email"});
    }

    if(bcrypt.compareSync(req.body.password, pathient.password)){
        let payload ={
            rol:"pathient",
            id:pathient.id
        }
        let token=jwt.sign(payload,process.env.APP_KEY, { expiresIn: 60 * 30 });
        return res.status(200).send({token:token});
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
        return res.status(200).send({token:token});
    }else{
        return res.status(401).send({ errors: "invalid password" });
    }
});
module.exports= router;