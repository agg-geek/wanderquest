const fs = require('fs');
const express = require('express');
const app = express();

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

const port = 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
