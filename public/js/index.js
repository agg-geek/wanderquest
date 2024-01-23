import '@babel/polyfill';

import { displayMap } from './mapbox';
import { login } from './login';

const mapBox = document.querySelector('#map');
const loginForm = document.querySelector('.form');

// only show.ejs contains mapBox, so displayMap only if #map exists
if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	displayMap(locations);
}

// do this only for the login page
if (loginForm) {
	loginForm.addEventListener('submit', evt => {
		evt.preventDefault();

		const email = document.querySelector('#email').value;
		const password = document.querySelector('#password').value;
		login(email, password);
	});
}
