const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-files/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: { tours },
	});
});

// '/api/v1/tours/:id/:x/:y' need to specify id, x, y
// if you didn't specify y, then error (as the exact URL is not matched)
// to keep y optional, use /tours/:id/:x/:y?
// for which req.params gives { id: '4', x: '20', y: undefined }
app.get('/api/v1/tours/:id', (req, res) => {
	// console.log(req.params);

	// req.params.id is a string, but tour.id is Number
	const tourId = Number(req.params.id);
	const tour = tours.find(tour => tour.id === tourId);

	if (!tour) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}

	res.status(200).json({
		status: 'success',
		data: { tour },
	});
});

app.post('/api/v1/tours', (req, res) => {
	const tourId = tours.at(-1).id + 1;
	const newTour = Object.assign({ id: tourId }, req.body);
	tours.push(newTour);

	fs.writeFile(`${__dirname}/dev-files/data/tours-simple.json`, JSON.stringify(tours), err => {
		res.status(201).json({
			status: 'success',
			data: { newTour },
		});
	});
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
