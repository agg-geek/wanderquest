const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			trim: true,
			minlength: [10, 'A tour name must have atleast 10 characters'],
			maxlength: [40, 'A tour name must have atmost 40 characters'],
			validate: {
				validator: tourName =>
					validator.isAlphanumeric(tourName, 'en-GB', { ignore: ' ' }),
				message: 'Tour name must only contain characters',
			},
		},
		slug: String,
		price: {
			type: Number,
			required: [true, 'A tour must have a price'],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (discount) {
					return discount < this.price;
				},
				message: 'Discount price ({VALUE}) should be less than regular price',
			},
		},
		duration: {
			type: Number,
			required: [true, 'A tour must have a duration'],
		},
		maxGroupSize: {
			type: Number,
			required: [true, 'A tour must have a max group size'],
		},
		difficulty: {
			type: String,
			required: [true, 'A tour must have a difficulty'],
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: 'Difficulty can be either easy, medium or difficult',
			},
		},
		ratingsAvg: {
			type: Number,
			default: 4,
			min: [1, 'Rating must be atleast 1'],
			max: [5, 'Rating must be atmost 5'],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		summary: {
			type: String,
			required: [true, 'A tour must have a summary'],
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		imageCover: {
			type: String,
			required: [true, 'A tour must have a cover image'],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		startDates: [Date],
		secretTour: {
			type: Boolean,
			default: false,
		},
		// start location is the start location of the tour
		// start location is GeoJSON data
		// to make it GeoJSON, it needs a type and coordinates
		// this object literal here for startLocation
		// is not a schema type obj like others
		// it is an embedded obj itself
		startLocation: {
			// type itself is variable whose schematype obj is mentioned
			type: {
				// this type String is the type of 'type' variable above
				type: String,
				default: 'Point',
				enum: ['Point'],
			},
			// type of coordinates is an array of Number
			// for GeoJSON, this array is [lng, lat]
			coordinates: [Number],
			address: String,
			description: String,
		},
		// we model tours and location by embedding locations in the tour itself
		// so each element of locations is a document in itself
		// notice that tours.json has an ID on every locations elem
		// which means that each location is a document, embedded into tours

		// locations is an array of stops of the tour
		// it is an array of GeoJSON elements itself
		locations: [
			{
				type: {
					type: String,
					default: 'Point',
					enum: ['Point'],
				},
				coordinates: [Number],
				address: String,
				description: String,
				// day of the tour when you reach this location
				day: Number,
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

tourSchema.virtual('durationWeeks').get(function () {
	return this.duration / 7;
});

tourSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	next();
});

tourSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
