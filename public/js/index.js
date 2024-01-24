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

		// for uploading images, you need to create a form
		// of the type multipart/form-data, hence new FormData()
		const form = new FormData();
		form.append('name', document.querySelector('#name').value);
		form.append('email', document.querySelector('#email').value);
		// files[0] as we only need the first file
		// notice that 'photo' here is the key for updateUserDetails to identify the image
		form.append('photo', document.querySelector('#photo').files[0]);

		// updateUserDetails() requires an obj to be sent which contains the data
		// you can send the form itself as it is already in the correct format
		// no changes need to be made to the updateUserDetails fn itself
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
