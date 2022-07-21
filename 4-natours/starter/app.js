const fs = require('fs');
const fsPromise = require('fs/promises');
const express = require('express');

const app = express();

//add a middleware, which is a function that can modify the incoming request data
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// a variable defined by <:var>, to make it optional <:var?>
app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', async (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
