const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router();

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
