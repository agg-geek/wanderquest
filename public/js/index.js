import '@babel/polyfill';

import { displayMap } from './mapbox';
import { login, logout } from './auth';
import { updateUserDetails } from './updateUser';

const mapBox = document.querySelector('#map');
const loginForm = document.querySelector('.form-login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateUserDetailsForm = document.querySelector('.form-user-data');

if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	displayMap(locations);
}

if (loginForm) {
	loginForm.addEventListener('submit', evt => {
		evt.preventDefault();

		const email = document.querySelector('#email').value;
		const password = document.querySelector('#password').value;
		login(email, password);
	});
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (updateUserDetailsForm) {
	updateUserDetailsForm.addEventListener('submit', evt => {
		evt.preventDefault();

		const name = document.querySelector('#name').value;
		const email = document.querySelector('#email').value;
		updateUserDetails(name, email);
	});
}
