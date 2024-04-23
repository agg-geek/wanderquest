import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.scss';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Layout({ requireAuth = false }) {
	const { currentUser } = useContext(AuthContext);
	if (requireAuth && !currentUser) return <Navigate to="/login" />;

	return (
		<div className="layout">
			<div className="navbar">
				<Navbar />
			</div>
			<div className="content">
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
