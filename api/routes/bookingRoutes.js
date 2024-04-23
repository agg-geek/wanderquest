const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn, authController.authorize('user'));

router.post('/create-payment-intent/:tourId', bookingController.createPaymentIntent);
router.patch('/', bookingController.confirmPayment);
router.get('/my-bookings', bookingController.getBookedTours);

module.exports = router;
