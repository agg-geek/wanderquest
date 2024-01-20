const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

// you should notice that reviews routes are accessible in 2 ways now
// /reviews (route created in app.js)
//      where GET gives all reviews irrespective of tour
//      where POST will create a new review, and body should include tourId and userId
// and /tours/:tourId/reviews (route created in tourRoutes.js)
//      where GET gives all reviews on a tour
//      where POST will create a new review, without need to specify tourId and userId in body

router
	.route('/')
	.get(authController.isLoggedIn, reviewController.getAllReviews)
	.post(
		authController.isLoggedIn,
		authController.authorize('user'),
		reviewController.createReview
	);

router.route('/:id').get(authController.isLoggedIn, reviewController.getReview);

module.exports = router;
