const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price'],
	},
	rating: {
		type: Number,
		default: 4,
	},
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
	name: 'Test tour',
	price: 1000,
});

testTour
	.save()
	.then(() => console.log('Tour saved!'))
	.catch(err => {
		console.log('Tour could not be saved');
		console.log(err);
	});
