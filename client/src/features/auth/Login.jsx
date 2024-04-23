import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../utils/apiRequest';
import './Login.scss';
import { AuthContext } from '../../context/AuthContext';

function Login() {
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const { updateUser } = useContext(AuthContext);

	const handleSubmit = async e => {
		e.preventDefault();

		setIsLoading(true);
		setError('');

		const formData = new FormData(e.target);
		const email = formData.get('email');
		const password = formData.get('password');

		try {
			const res = await apiRequest.post('/users/login', {
				email,
				password,
			});

			updateUser(res.data.data.user);
			navigate('/');
		} catch (err) {
			setError(err.response.data.message);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="login">
			<div className="formContainer">
				<form onSubmit={handleSubmit}>
					<h1>Welcome back</h1>
					<input name="email" type="email" required placeholder="Email" />
					<input
						name="password"
						type="password"
						required
						placeholder="Password"
					/>
					<button disabled={isLoading}>Login</button>
					{error && <span>{error}</span>}
					<Link to="/register">Don&apos;t have a account?</Link>
				</form>
			</div>
		</div>
	);
}

export default Login;
