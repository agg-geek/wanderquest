import axios from 'axios';
import { showAlert } from './alerts';

// type can be details or password
export const updateUserDetails = async (data, type = 'details') => {
	try {
		const res = await axios({
			method: 'PATCH',
			url: `http://127.0.0.1:3000/api/v1/users/update-${type}`,
			data,
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Details updated successfully');
			window.setTimeout(() => location.assign('/tours'), 1000);
		}
	} catch (err) {
		console.log(err);
		showAlert('error', err.response.data.message);
	}
};
