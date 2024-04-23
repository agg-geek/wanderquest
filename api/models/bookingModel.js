const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
	tourId: {
		type: String,
		required: [true, 'Booking must be for a tour, tourId missing'],
	},
	userId: {
		type: String,
		required: [true, 'Booking must be created by a user, userId missing'],
	},
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	img: {
		type: String,
	},
	payment_intent: {
		type: String,
		required: true,
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
});

bookingSchema.index({ tourId: 1, userId: 1 }, { unique: true });

bookingSchema.virtual('tour', {
	ref: 'Tour',
	foreignField: 'tourId',
	localField: '_id',
});

module.exports = mongoose.model('Booking', bookingSchema);
