const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).render('home', { title: 'Home' });
});

router.get('/tours', viewController.addUserLocal, viewController.renderAllTours);
router.get('/tours/:tourSlug', viewController.addUserLocal, viewController.renderTour);

router.get('/login', viewController.addUserLocal, viewController.renderLoginForm);
router.get('/my-account', authController.isLoggedIn, viewController.renderAccountPage);

module.exports = router;
