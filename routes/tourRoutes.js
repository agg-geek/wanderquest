const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// param middleware fn
// this param middleware fn is only run when the param id is present
// it has next() because it is middleware
// it also gets access to val which holds the value of the param id
// this fn will thus only be run for getTour, updateTour and deleteTour
// but not for getAllTours
// this param middleware will only run for tour routes and not user router
router.param('id', (req, res, next, val) => {
	console.log(`The value of param is ${val}`);
	next(); // important!
});

router.param('id', tourController.validateId);

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
