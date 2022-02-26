const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const home = require('./routes/home');
const user = require('./routes/user');
const product = require('./routes/product');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yaml');
const connectWithDb = require('./config/db');
const cloudinary = require('cloudinary');


// CLOUDINARY_API_KEY=944145249987717
// CLOUDINARY_API_SECRET=_lgYYL7scKMfOgmlnpbQiFr_7g0




connectWithDb();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

const app = express();



//template engine middleware
app.set("view engine", "ejs");

//middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
//swagger middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//cookie parser
app.use(cookieParser());

//fileupload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir : "/tmp/"
}));

// bringing rourtes
app.use(morgan('tiny'));



//using middleware to route
app.use('/api/v1', home);
app.use('/api/v1', user);
app.use('/api/v1', product);


app.get('/signuptest', (req, res) => {
  res.render('signuptest.ejs')
})



module.exports = app;
