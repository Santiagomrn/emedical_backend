const app = require("./app");
require('dotenv').config();

/**
 * @typedef {Object} Food
 * @property {string} name - What the food should be called
 * @property {('meat' | 'veggie' | 'other')} type - The food's type
 */

//database conection
var config = require('./src/database/knexfile')['development']
const knex=require('knex')(config)
const { Model } = require('objection');

Model.knex(knex)

knex.raw('select 1+1 as result').then(function () {
	console.log("db connected")
    });
    
app.listen( process.env.PORT );