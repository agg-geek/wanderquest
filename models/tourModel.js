const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			trim: true,
		},
		slug: String,
		price: {
			type: Number,
			required: [true, 'A tour must have a price'],
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
		},
		ratingsAvg: {
			type: Number,
			default: 4,
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		priceDiscount: Number,
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

// QUERY MIDDLEWARE
// .find() returns a mongoose query obj and .find() is a query middleware,
// so 'this' points to current query obj and not current document
// we have defined secretTour property and such tours should never appear
// in getAllTour results

// on every find, this fn will not send secret tours when you request all tours
// the Tour.find() in getAllTours is the query and before you await that query
// then this find middleware is run which chains another find to that query
// this chained find then only queries for non-secret tour documents
tourSchema.pre('find', function (next) {
	// find query is effectively equal to secretTour: false
	// but other tours may not even have this attribute,
	// hence use this method
	this.find({ secretTour: { $ne: true } });
	next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
