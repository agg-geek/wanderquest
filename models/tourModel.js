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

// when you used the pre-find hook to get the secret tour using getTour
// you will actually get it, because
// the pre-find hook only works for .findOne()
// and we used .findById (equivalent to .findOne) in getAllTours
// we need to define it separately for .findOne (in getTour) like:
// tourSchema.pre('findOne', function (next) {

// our we can define all together like:
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
