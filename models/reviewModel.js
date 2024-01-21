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

// a single user cannot create multiple reviews on the same tour
// hence, combination of tourId and userId has to be unique
reviewSchema.index({ tourId: 1, userId: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
	this.populate({ path: 'userId', select: 'name' });
	next();
});

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

	await Tour.findByIdAndUpdate(tourId, {
		ratingsQuantity: stats[0].nRating,
		ratingsAvg: stats[0].avgRating,
	});
};

reviewSchema.post('save', function () {
	this.constructor.calcAverageRatings(this.tourId);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
