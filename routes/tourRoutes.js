const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// prettier-ignore
router
    .route('/') // notice '/' route
    .get(tourController.getAllTours)
    .post(tourController.createTour);

// prettier-ignore
router
    .route('/:id') // notice '/:id' route
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
