const express = require('express');
const viewController = require('./../controllers/viewController');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).render('home', { title: 'Home' });
});

router.get('/tours', viewController.getAllTours);
router.get('/tours/:tourSlug', viewController.getTour);

module.exports = router;
