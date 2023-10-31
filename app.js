const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const AppError = require('./utils/appError');

const pharmacyRouter = require('./routes/pharmacyRoutes');
const userRouter = require('./routes/userRoutes');
const repositoryRouter = require('./routes/repositoryRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const regionRouter = require('./routes/regionRoutes');
const driverRouter = require('./routes/driverRoutes');
const transmissionLineRouter = require('./routes/transmissionLineRoutes');
const offerRouter = require('./routes/offerRoutes');
const infoRouter = require('./routes/infoRoutes');
// const sc = require('./utils/schedule');

// sc.sc();
dotenv.config({ path: './config.env' });
const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/pharmacies', pharmacyRouter);
app.use('/users', userRouter);
app.use('/repositories', repositoryRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/regions' , regionRouter);
app.use('/drivers' , driverRouter);
app.use('/tlines',transmissionLineRouter);
app.use('/offers',offerRouter);
app.use('/info' , infoRouter);

app.all('*', (req, res, next) => {
    return next(new AppError(`This route is not exist ${req.originalUrl}`, 404));
})


module.exports = app;