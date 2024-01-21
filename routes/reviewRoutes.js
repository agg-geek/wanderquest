const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.isLoggedIn);

router
	.route('/')
	.get(reviewController.getAllReviews)
	.post(
		authController.authorize('user'),
		reviewController.setIds,
		reviewController.createReview
	);

router
	.route('/:id')
	.get(reviewController.getReview)
	.patch(authController.authorize('admin', 'user'), reviewController.updateReview)
	.delete(authController.authorize('admin', 'user'), reviewController.deleteReview);

module.exports = router;
