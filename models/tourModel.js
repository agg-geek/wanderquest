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

tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	next();
});

// Aggregation middleware:
// here, this keyword points to current aggregation obj
// when /tour-stats is run, i don't get stats for secret tour
// whereas i should have got it (jonas got it)
// anyways, here this.pipeline() refers to the pipeline array that we passed
// unshift is simply the array method to insert elem at the beginning of array

tourSchema.pre('aggregate', function (next) {
	// console.log(this.pipeline());
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
