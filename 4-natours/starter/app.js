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
//ad a middlwware function to the middleware stack
//Express passes the third function as the next function (the parameter it can be called whatever we want though)
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString('it-IT', {
    timeZone: 'Europe/Rome',
  });
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
