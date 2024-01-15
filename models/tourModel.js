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
		// defining slug is important otherwise the pre-save hook
		// that tries to store this.slug wouldn't function as
		// slug isn't defined in model so won't be stored in db
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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

tourSchema.virtual('durationWeeks').get(function () {
	return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() (not .insertMany())
// the fn here is called a pre-save hook
tourSchema.pre('save', function (next) {
	// pre-save fn has this pointing to current document
	// current document, hence document middleware
	// console.log(this);
	this.slug = slugify(this.name, { lower: true });
	// next() is extremely important
	next();
});

// multiple pre save hooks
// tourSchema.pre('save', function (next) {
// 	console.log('Will save document');
// 	next();
// });
//
// post hook gets access to the recently saved document
// tourSchema.post('save', function (doc, next) {
// 	console.log(doc);
// 	next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
