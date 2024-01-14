const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.param('id', tourController.validateId);

// prettier-ignore
router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.validateTour, tourController.createTour);

// prettier-ignore
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
