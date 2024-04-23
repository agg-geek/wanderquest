import apiRequest from '../utils/apiRequest';

export const tourLoader = async ({ request, params }) => {
	const res = await apiRequest.get(`/tours/${params.id}`);
	return res.data.data;
};

export const allTourLoader = async ({ request }) => {
	const query = request.url.split('?')[1];
	const res = await apiRequest.get(`/tours?${query ? query : ''}`);
	return res.data.data;
};

export const bookedTourLoader = async () => {
	const res = await apiRequest.get(`/bookings/my-bookings`);
	return res.data.data;
};
