const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('./../utils/appError');
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

module.exports.createPaymentIntent = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.tourId);
	if (!tour) return next(AppError(404, 'Booking failed as tour does not exist'));

	const paymentIntent = await stripe.paymentIntents.create({
		shipping: {
			name: req.user.name,
			address: {
				line1: 'Fake line1',
				postal_code: '11111',
				city: 'Fake city',
				state: 'Fake state',
				country: 'US',
			},
		},
		amount: tour.price * 100,
		currency: 'inr',
		description: 'Tour booking services',
		automatic_payment_methods: {
			enabled: true,
		},
	});

	await Booking.create({
		tourId: tour._id,
		userId: req.user._id,
		name: tour.name,
		price: tour.price,
		img: tour.imageCover,
		payment_intent: paymentIntent.id,
	});

	res.status(200).send({ clientSecret: paymentIntent.client_secret });
});

module.exports.confirmPayment = catchAsync(async (req, res, next) => {
	if (!req.body.payment_intent) return AppError('Payment ID missing', 400);

	const bookings = await Booking.findOneAndUpdate(
		{ payment_intent: req.body.payment_intent },
		{ $set: { isCompleted: true } }
	);

	res.status(200).send('Booking has been confirmed!');
});

module.exports.getBookedTours = catchAsync(async (req, res, next) => {
	const bookings = await Booking.find({
		userId: req.user._id,
		isCompleted: true,
	});

	const tours = await Promise.all(bookings.map(({ tourId }) => Tour.findById(tourId)));
	res.status(200).send({
		status: 'success',
		results: tours.length,
		data: tours,
	});
});
