'use strict';
const express = require('express');

const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const routes = require('./src/routes/routes')
const app = express();


app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan('dev'));
app.use(helmet());
//CORS configuration
app.use(cors({
  	origin: '*',
  	methods: [
    	'GET',
    	'POST',
    	'PUT',
    	'DELETE'
  	],
  		allowedHeaders: ['Content-Type', 'Authorization']
	}));


//routes
app.use('/api/v1',routes)

//default answer
app.use((req,res) => {
	res.status(404).send({error:"Resource not found"});
} );

module.exports = app;