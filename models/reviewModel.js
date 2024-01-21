const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, 'Review can not be empty'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		tourId: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			required: [true, 'Review must belong to a tour, tourId missing'],
		},
		userId: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Review must belong to a user, userId missing'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

reviewSchema.pre(/^find/, function (next) {
	this.populate({ path: 'userId', select: 'name' });
	next();
});

// calculating ratingsAvg and ratingsQuantity fields on the tour
// static method, in contrast to an instance method, is applied on the model
// this keyword for static method points to the model itself (Review model here)
reviewSchema.statics.calcAverageRatings = async function (tourId) {
	const stats = await this.aggregate([
		{ $match: { tourId } },
		{
			$group: {
				_id: '$tourId',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);

	// console.log(stats); // see stats below
	// _id is the tourId that was passed, and the 2 lines represent 2 diff stats
	// each created when a review was created for a tour
	// [ { _id: new ObjectId('65ad0ee36b10119c01700a47'), nRating: 1, avgRating: 5 } ]
	// [ { _id: new ObjectId('65ad0ee36b10119c01700a47'), nRating: 2, avgRating: 4 } ]

	await Tour.findByIdAndUpdate(tourId, {
		ratingsQuantity: stats[0].nRating,
		ratingsAvg: stats[0].avgRating,
	});
};

// before saving any review, call the above function
// the above fn first matches all reviews having tourId,
// but the review first needs to be saved before it can be matched
// hence this is a post-save hook and not pre-save hook
reviewSchema.post('save', function () {
	// calcAverageRatings is a static fn, which is available on the model
	// like Review.calcAverageRatings(), but Review variable DNE, it is defined below,
	// and we cannot move this post-save fn below
	// hence use this.constructor
	this.constructor.calcAverageRatings(this.tourId);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
