const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const home = require('./routes/home');
const user = require('./routes/user');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yaml');
const connect = require('./config/db');

connect();

const app = express();






//middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
//swagger middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//cookie parser
app.use(cookieParser());

//fileupload middleware
app.use(fileUpload());

// bringing rourtes
app.use(morgan('tiny'));
//using middleware to route



app.use('/api/v1', home);
app.use('/api/v1', user);



module.exports = app;
