import axios from 'axios';

export const login = async (email, password) => {
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/v1/users/login',
			data: { email, password },
		});
		if (res.data.status === 'success') {
			alert('Login successful');
			window.setTimeout(() => location.assign('/tours'), 1000);
		}
	} catch (err) {
		alert(err.response.data.message);
	}
};
