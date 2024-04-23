import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import List from '../booking/BookedTours';
import apiRequest from '../../utils/apiRequest';
import './Account.scss';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Account() {
	const bookedTours = useLoaderData();
	console.log(bookedTours);

	const { updateUser, currentUser } = useContext(AuthContext);

	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await apiRequest.post('/users/logout');
			updateUser(null);
			navigate('/');
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="account">
			<div className="details">
				<div className="wrapper">
					<div className="title">
						<h1>User Information</h1>
						<Link to="/my-account/update">
							<button>Update Profile</button>
						</Link>
					</div>
					<div className="info">
						<span>
							Avatar:
							<img
								src={`/users/${currentUser.photo || 'default.jpg'}`}
								alt="User avatar"
							/>
						</span>
						<span>
							Name: <b>{currentUser.name}</b>
						</span>
						<span>
							E-mail: <b>{currentUser.email}</b>
						</span>
						<button onClick={handleLogout}>Logout</button>
					</div>
					<div className="title">
						<h1>Booked tours</h1>
					</div>
					<List bookedTours={bookedTours} />
				</div>
			</div>
		</div>
	);
}

export default Account;
