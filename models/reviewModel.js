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
		// we add parent references to tour and user
		// so each review stores it tour and user
		// but no tour and user stores the reviews, not even their ids
		// this is to avoid creation of huge references array in tour and user docs
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

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
