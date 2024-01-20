const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router
	.route('/')
	.get(authController.isLoggedIn, tourController.getAllTours)
	.post(tourController.createTour);

router.route('/top-5-tours').get(tourController.topTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMontlyPlan);

router
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(
		authController.isLoggedIn,
		authController.authorize('lead', 'admin'),
		tourController.deleteTour
	);

// to get all reviews for a tour / create a review for a tour
// we have been creating reviews by manually adding the tourId and userId
// however, a request should be of the form /api/v1/tours/1234/reviews
// hence, get the tourId from tours/:tourId and userId from logged in user
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
