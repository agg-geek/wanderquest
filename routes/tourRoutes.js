const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// prettier-ignore
router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

// creating an alias for a tour
// notice that we use a middleware
// also note that the url is /api/v1/tours/top-5-tours, contains '/tours'
// also note that '/top-5-tours' and not 'top-5-tours'
// prepending '/' is actually reqd for all route
// also, this route should be before the '/:id' route
// otherwise express will treat 'top-5-tours' as the id
// prettier-ignore
router.route('/top-5-tours').
get(tourController.topTours, tourController.getAllTours);

// prettier-ignore
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
