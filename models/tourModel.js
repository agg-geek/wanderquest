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

// we define this.start for post hook
// even though this refers to a query obj, it is still a normal obj
// and we can define our own custom properties on it (like start here)
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	this.start = Date.now(); // current time in milliseconds
	next();
});

// post-find hook gets access to all documents actually found after query
tourSchema.post(/^find/, function (docs, next) {
	// console.log(docs);
	// we just defined a start property on the query before searching it
	// we then log here the time taken to execute the query
	console.log(`Query took ${Date.now() - this.start} milliseconds!`);
	next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
