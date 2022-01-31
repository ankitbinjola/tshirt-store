const app = require('./app');
require('dotenv').config();

// bringing rourtes

const home = require('./routes/home');


//using middleware to route
app.use('/api/v1', home);



app.listen(process.env.PORT, () => {
    console.log(`server running on PORT ${process.env.PORT}`);
})