const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.route('/top-5-tours').get(tourController.topTours, tourController.getAllTours);
router.route('/annual-plan/:year').get(tourController.getMontlyPlan);
router
	.route('/tour-stats')
	.get(
		authController.isLoggedIn,
		authController.authorize('admin', 'lead', 'guide'),
		tourController.getTourStats
	);
router.route('/nearby-tours/:latlng').get(tourController.getNearbyTours);

router
	.route('/')
	.get(tourController.getAllTours)
	.post(
		authController.isLoggedIn,
		authController.authorize('admin', 'lead'),
		tourController.createTour
	);

router
	.route('/:id')
	.get(tourController.getTour)
	.patch(
		authController.isLoggedIn,
		authController.authorize('admin', 'lead'),
		tourController.updateTour
	)
	.delete(
		authController.isLoggedIn,
		authController.authorize('admin', 'lead'),
		tourController.deleteTour
	);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
