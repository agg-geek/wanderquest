const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

module.exports.setIds = async (req, res, next) => {
	// used as a middleware for create review (see reviewRoutes.js)
	if (!req.body.tourId) req.body.tourId = req.params.tourId;
	if (!req.body.userId) req.body.userId = req.user.id;
	next();
};

module.exports.getAllReviews = (req, res, next) => {
	// you can get reviews on a single tour by filtering
	const filter = {
		...(req.params.tourId && { tourId: req.params.tourId }),
	};
	// and using APIFeatures, you can further filter, sort, etc
	// by using ?rating[lt]=4, etc
	// hence, the APIFeatures class and factory fn comes in handy here
	factory.getAll(Review, filter)(req, res, next);
};

module.exports.getReview = factory.getOne(Review);
module.exports.createReview = factory.createOne(Review);
module.exports.updateReview = factory.updateOne(Review);
module.exports.deleteReview = factory.deleteOne(Review);
