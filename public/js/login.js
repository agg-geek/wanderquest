const login = async (email, password) => {
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/v1/users/login',
			data: { email, password },
		});
		// res.data is the data we send from our API if request is successful
		if (res.data.status === 'success') {
			alert('Login successful');
			// on successful login, redirect to /tours
			window.setTimeout(() => location.assign('/tours'), 1000);
		}
	} catch (err) {
		alert(err.response.data.message);
	}
};

document.querySelector('.form').addEventListener('submit', evt => {
	evt.preventDefault();

	const email = document.querySelector('#email').value;
	const password = document.querySelector('#password').value;
	login(email, password);
});
