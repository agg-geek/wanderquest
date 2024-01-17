const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
	.route('/')
	.get(authController.isLoggedIn, tourController.getAllTours)
	.post(tourController.createTour);

router
	.route('/top-5-tours')
	.get(tourController.topTours, tourController.getAllTours);

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

module.exports = router;
