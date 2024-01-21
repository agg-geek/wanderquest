const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

module.exports.setIds = async (req, res, next) => {
	if (!req.body.tourId) req.body.tourId = req.params.tourId;
	if (!req.body.userId) req.body.userId = req.user.id;
	next();
};

module.exports.getAllReviews = (req, res, next) => {
	const filter = {
		...(req.params.tourId && { tourId: req.params.tourId }),
	};
	factory.getAll(Review, filter)(req, res, next);
};

module.exports.getReview = factory.getOne(Review);
module.exports.createReview = factory.createOne(Review);
module.exports.updateReview = factory.updateOne(Review);
module.exports.deleteReview = factory.deleteOne(Review);
