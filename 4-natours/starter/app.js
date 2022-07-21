const fs = require('fs');
const fsPromise = require('fs/promises');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDELWARES
app.use(morgan('dev'));
//add a middleware, which is a function that can modify the incoming request data
app.use(express.json());
//ad a middlwware function to the middleware stack
//Express passes the third function as the next function (the parameter it can be called whatever we want though)
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    requestedAt: req.requestTime,
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1; //trick to convert string to number
  const tour = tours.find((el) => el.id === id);

  //if (id > tours.length || id < 0)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = async (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  //lets us create a new object by merging existing objects
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  try {
    await fsPromise.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours)
    );
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// 3) ROUTES
app.route('/api/v1/tours').get(getAllTours).post(createTour);
// a variable defined by <:var>, to make it optional <:var?>
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// 4) START THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
