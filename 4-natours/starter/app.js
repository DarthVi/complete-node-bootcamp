const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDELWARES
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
//add a middleware, which is a function that can modify the incoming request data
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString('it-IT', {
    timeZone: 'Europe/Rome',
  });
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//If we reach middlewares in this part of the code, it means
//that other routes failed because they were not appropriate.
//All allows us to consider all the HTTP verbs, * to handle all
//the urls not handled before
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
