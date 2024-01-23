const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).render('home', { title: 'Home' });
});

router.use(authController.addUserLocal);

router.get('/tours', viewController.renderAllTours);
router.get('/tours/:tourSlug', viewController.renderTour);

router.get('/login', viewController.renderLoginForm);

module.exports = router;
