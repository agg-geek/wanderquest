const fs = require('fs');
const express = require('express');

const app = express();

// the data from post is not directly added to req obj by express
// we need to use express.json() (a middleware) to do that
// without this, req.body will be undefined for a post requeest (checked!)
app.use(express.json());

// notice JSON.parse and readFileSync (sync, but at the top level)
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-files/data/tours-simple.json`));

// the callback fn is known as route handler
app.get('/api/v1/tours', (req, res) => {
	// using JSend specification for JSON response
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: { tours },
	});
});

// send the post request with body in raw/json format
app.post('/api/v1/tours', (req, res) => {
	// console.log(req.body);

	const tourId = tours.at(-1).id + 1;
	const newTour = Object.assign({ id: tourId }, req.body); // req.body.id = tourId mutates req.body
	tours.push(newTour);

	// notice JSON.stringify(tours)
	fs.writeFile(`${__dirname}/dev-files/data/tours-simple.json`, JSON.stringify(tours), err => {
		res.status(201).json({
			// status 201 means created
			status: 'success',
			data: { newTour },
		});
	});
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
