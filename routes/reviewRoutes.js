const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(authController.isLoggedIn, reviewController.getAllReviews)
	.post(
		authController.isLoggedIn,
		authController.authorize('user'),
		reviewController.setIds,
		reviewController.createReview
	);

router
	.route('/:id')
	.get(authController.isLoggedIn, reviewController.getReview)
	.patch(authController.isLoggedIn, reviewController.updateReview)
	.delete(authController.isLoggedIn, reviewController.deleteReview);

module.exports = router;
