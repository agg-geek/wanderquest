import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../utils/apiRequest';
import './Signup.scss';
import { AuthContext } from '../../context/AuthContext';

function Signup() {
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const { updateUser } = useContext(AuthContext);

	const handleSubmit = async e => {
		e.preventDefault();

		setError('');
		setIsLoading(true);

		const formData = new FormData(e.target);
		const name = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');
		const passwordConfirm = formData.get('passwordConfirm');

		try {
			const res = await apiRequest.post('/users/signup', {
				name,
				email,
				password,
				passwordConfirm,
			});

			updateUser(res.data.data.user);
			navigate('/');
		} catch (err) {
			console.log(err);

			setError(err.response.data.message);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="registerPage">
			<div className="formContainer">
				<form onSubmit={handleSubmit}>
					<h1>Create an Account</h1>
					<input name="name" type="text" placeholder="Name" />
					<input name="email" type="text" placeholder="Email" />
					<input name="password" type="password" placeholder="Password" />
					<input
						name="passwordConfirm"
						type="password"
						placeholder="Confirm password"
					/>
					<button disabled={isLoading}>Register</button>
					{error && <span>{error}</span>}
					<Link to="/login">Do you already have an account?</Link>
				</form>
			</div>
		</div>
	);
}

export default Signup;
