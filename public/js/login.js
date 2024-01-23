const login = async (email, password) => {
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/v1/users/login',
			data: { email, password },
		});
		// on entering correct email and pwd,
		// the API will send a token (in res.data)
		// and also set a cookie 'jwt'
		console.log(res.data);
	} catch (err) {
		console.log(err.response.data);
	}
};

document.querySelector('.form').addEventListener('submit', evt => {
	evt.preventDefault();

	const email = document.querySelector('#email').value;
	const password = document.querySelector('#password').value;
	login(email, password);
});
