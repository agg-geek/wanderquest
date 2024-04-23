import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './features/home/Home';
import Tours from './features/tours/Tours';
import Tour from './features/tours/Tour';
import Account from './features/auth/Account';
import Signup from './features/auth/Signup';
import Login from './features/auth/Login';
import UpdateAccount from './features/auth/UpdateAccount';
import { allTourLoader, bookedTourLoader, tourLoader } from './lib/loaders';
import Payment from './features/booking/Payment';
import Success from './features/booking/Success';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <Layout />,
			children: [
				{ path: '/', element: <Home /> },
				{ path: '/signup', element: <Signup /> },
				{ path: '/login', element: <Login /> },
				{ path: '/tours', element: <Tours />, loader: allTourLoader },
				{ path: '/tours/:id', element: <Tour />, loader: tourLoader },
			],
		},
		{
			path: '/',
			element: <Layout requireAuth={true} />,
			children: [
				{ path: '/my-account', element: <Account />, loader: bookedTourLoader },
				{ path: '/my-account/update', element: <UpdateAccount /> },
				{ path: '/pay/:id', element: <Payment /> },
				{ path: '/payment-success', element: <Success /> },
			],
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
