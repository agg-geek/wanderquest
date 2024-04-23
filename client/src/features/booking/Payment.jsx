import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useParams } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';
import apiRequest from '../../utils/apiRequest';

const STRIPE_PUBLIC_KEY =
	'pk_test_51OlsgrSBhsXvhJtJrBJp8OMwvhW7qysIXaC3hs8Yo1T9nNqtm8LFFdPGjQg9BtEG5tFx1QmPiNkhu8MWgluPhwhf00hBa2Vb2q';
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const Payment = () => {
	const [clientSecret, setClientSecret] = useState('');

	const { id } = useParams();

	useEffect(() => {
		const makeRequest = async () => {
			try {
				const res = await apiRequest.post(
					`/bookings/create-payment-intent/${id}`
				);
				setClientSecret(res.data.clientSecret);
			} catch (err) {
				console.log(err);
			}
		};
		makeRequest();
	}, [id]);

	const appearance = {
		theme: 'stripe',
	};

	const options = {
		clientSecret,
		appearance,
	};

	return (
		<div className="payment">
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<CheckoutForm />
				</Elements>
			)}
		</div>
	);
};

export default Payment;
