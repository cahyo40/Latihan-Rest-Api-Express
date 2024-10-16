const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

const categories = require('./routes/categories');
const authRoute = require('./routes/auth'); 
const productRoute = require('./routes/product'); 
const profileRoute = require('./routes/profile'); 
const reviewRoute = require('./routes/review'); 
const { errorHandler, notFound } = require('./middleware/error_middleware');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev')); 
app.use(cookieParser());
app.use(cors());
app.use('/public/uploads',express.static(path.join(__dirname,'public/uploads')));


// Route

app.use('/api/v1/categories', categories);
app.use('/api/v1/auth', authRoute);  
app.use('/api/v1/product', productRoute);  
app.use('/api/v1/profile', profileRoute);  
app.use('/api/v1/review', reviewRoute);  

app.use(notFound);
app.use(errorHandler());


app.listen(process.env.APP_PORT, () => {
    console.log(`berjalan di port ${process.env.APP_PORT}`);
})
