import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Success.scss';
import apiRequest from '../../utils/apiRequest';

const Success = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const payment_intent = searchParams.get('payment_intent');

	useEffect(() => {
		const makeRequest = async () => {
			try {
				await apiRequest.patch('/bookings', { payment_intent });
				setTimeout(() => {
					navigate('/my-account');
				}, 5000);
			} catch (err) {
				console.log(err);
			}
		};

		makeRequest();
	}, []);

	return (
		<div className="success">
			Payment successful!
			<br />
			You are being redirected to the orders page. Please do not close the page.
		</div>
	);
};

export default Success;
