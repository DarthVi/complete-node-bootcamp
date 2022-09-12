const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
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
  //whenever we pass something to next, Express assumes that it is
  //an error and skip all the other middleware in the stack, passing
  //the execution to the error handling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
