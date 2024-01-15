const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// prettier-ignore
router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

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
