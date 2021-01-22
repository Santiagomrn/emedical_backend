'use estrict'
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const router = express.Router();
const pathientSchema = require('../schemas/pathient')
var Validator = require('jsonschema').Validator;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Pathient = require('../database/models/pathient');
const authorization = require('../middlewares/authorization')

var v = new Validator();

router.post('/', async (req, res) => {
    let pathient
    let resultValidator = v.validate(req.body, pathientSchema)

    if (resultValidator.valid) {
        //hash password
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        //validate email
        try {
            pathient = await Pathient.query().where("email", req.body.email).first();
            if (pathient) {
                return res.status(400).send({ errors: "Email already exist" });
            }

            pathient = await Pathient.query().insertAndFetch(req.body);
        } catch {
            return res.status(500).send({ errors: "Internal Server Error" });
        }

        return res.status(200).send(pathient);
    } else {
        return res.status(400).send({ errors: resultValidator.errors });
    }
})

////////////// autorization required//////////////
router.use(authorization);
router.get('/', async (req, res) => {
    //pagination params
    limit = req.query.limit ? req.query.limit : 10
    page = req.query.page ? (req.query.page * limit) : 0

    let pathients = await Pathient.query().select().limit(limit).offset(page);

    return res.status(200).send(pathients);
})
router.get('/:id', async (req, res) => {
    let pathient
    try {
        pathient = await Pathient.query().select().where("id", req.params.id).first();
        if (pathient) {
            return res.status(200).send(pathient);
        } else {
            return res.status(404).send({ errors: "Not Found" });
        }
    } catch {
        return res.status(500).send({ errors: "Internal Server Error" });
    }

})

router.put('/:id', async (req, res) => {
    let pathient
    let resultValidator = v.validate(req.body, pathientSchema)

    if (resultValidator.valid) {
        try {
            pathient = await Pathient.query().where("email", req.body.email).first();

            if (pathient) {
                return res.status(400).send({ errors: "Email already exist" });
            }

            pathient = await Pathient.query().updateAndFetchById(req.params.id, req.body);

        } catch {
            return res.status(500).send({ errors: "Internal Server Error" });
        }

        if (pathient) {
            return res.status(200).send(pathient);
        } else {
            return res.status(404).send({ errors: "Not Found" });
        }
    } else {
        return res.status(400).send({ errors: resultValidator.errors });
    }
})
router.delete('/:id', async (req, res) => {

    let pathient = await Pathient.query().deleteById(req.params.id);
    if (pathient == 1) {
        return res.status(200).send({ message: "ok" });
    } else {
        return res.status(404).send({ errors: "Not Found" })
    }
})

//image upload
router.use(fileUpload());

router.put('/:id/image_profile', async (req, res) =>{
    //console.log(req.files.file); // the uploaded file object
    let profile_picture = req.files.file;
    profile_picture.mv(__dirname + '/../pictures/' + req.files.file.md5 + ".jpg");
    let pathient
    try {
        pathient = await Pathient.query()
            .patchAndFetchById(req.params.id, { imageProfile: req.files.file.md5 });
        console.log(pathient)
    } catch {
        return res.status(500).send({ errors: "Internal Server Error" });
    }
    return res.status(200).send(pathient);
});

//get image upload
router.get('/image_profile/:id_image', (req, res) => {
    let fileName=req.params.id_image+".jpg";
        res.status(200).sendFile(path.join(__dirname,'../pictures/')+fileName,(err)=>{
            if(err){
                res.status(404).send();
            }
        });
});

module.exports = router