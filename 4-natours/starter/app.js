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
      data: {
        message: err.message,
      },
    });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
