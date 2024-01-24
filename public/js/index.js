import '@babel/polyfill';

import { displayMap } from './mapbox';
import { login, logout } from './auth';
import { updateUserDetails } from './updateUser';

const mapBox = document.querySelector('#map');
const loginForm = document.querySelector('.form-login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateUserDetailsForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');

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

		const form = new FormData();
		form.append('name', document.querySelector('#name').value);
		form.append('email', document.querySelector('#email').value);
		form.append('photo', document.querySelector('#photo').files[0]);
		updateUserDetails(form);
	});
}

if (updatePasswordForm) {
	updatePasswordForm.addEventListener('submit', async evt => {
		evt.preventDefault();

		document.querySelector('.btn--save-password').textContent = 'Updating...';

		const currentPwd = document.querySelector('#password-current').value;
		const newPwd = document.querySelector('#password').value;
		const newPwdConfirm = document.querySelector('#password-confirm').value;
		await updateUserDetails({ currentPwd, newPwd, newPwdConfirm }, 'password');

		document.querySelector('.btn--save-password').textContent = 'Password updated!';
		document.querySelector('#password-current').value = '';
		document.querySelector('#password').value = '';
		document.querySelector('#password-confirm').value = '';
	});
}
