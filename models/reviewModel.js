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
	// when a tour is populated with reviews,
	// we were populating the review itself with the tour info
	// and the tour in turn populated the guides and stuff
	// which is a lot of populates
	// also, guides were already available on tour as we populate the tour
	// since we only the reviews for each tour, and we don't need tour with reviews
	// we stop populating the review with tours

	// also, we need the user for each review when we populate tour
	// so this line is kept
	this.populate({ path: 'userId', select: 'name' });

	next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
