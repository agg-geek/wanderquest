const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).render('home', { title: 'Home' });
});

router.get('/tours', authController.addUserLocal, viewController.renderAllTours);
router.get('/tours/:tourSlug', authController.addUserLocal, viewController.renderTour);

router.get('/login', authController.addUserLocal, viewController.renderLoginForm);
router.get('/my-account', authController.isLoggedIn, viewController.renderAccountPage);

module.exports = router;
