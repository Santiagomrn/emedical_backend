const app = require("./app");
require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 3000;

//database conection
var config = require('./src/database/knexfile')['development']
const knex=require('knex')(config)
const { Model } = require('objection');

Model.knex(knex)

knex.raw('select 1+1 as result').then(function () {
	console.log("db connected")
    });
    
app.listen( process.env.PORT );