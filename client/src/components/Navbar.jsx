import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
	const [open, setOpen] = useState(false);

	const { currentUser } = useContext(AuthContext);

	return (
		<nav>
			<div className="left">
				<Link to="/" className="logo">
					{/* <img src="/logo.png" alt="" /> */}
					<span>WanderQuest</span>
				</Link>
				<Link to="/tours">All tours</Link>
			</div>
			<div className="right">
				{currentUser ? (
					<div className="user">
						<Link to="/my-account">
							<img
								src={`/users/${currentUser.photo || 'default.jpg'}`}
								alt="User avatar"
							/>
						</Link>
						{/* <span>John Doe</span>
						<Link to="/my-account" className="profile">
							<div className="notification">3</div>
							<span>My Account</span>
						</Link> */}
					</div>
				) : (
					<>
						<Link to="/login">Login</Link>
						<Link to="/signup" className="register">
							Sign up
						</Link>
					</>
				)}
				<div className="menuIcon">
					<img src="/menu.png" alt="" onClick={() => setOpen(prev => !prev)} />
				</div>
				<div className={open ? 'menu active' : 'menu'}>
					<Link to="/">Home</Link>
					<Link to="/tours">All tours</Link>
					<Link to="/signup">Sign up</Link>
					<Link to="/login">Log in</Link>
					<Link to="/my-account">My account</Link>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
