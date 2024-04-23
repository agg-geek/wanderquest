import { listData } from '../../lib/dummydata';
import Filter from './components/Filter';
import TourCard from './components/TourCard';
import Map from './components/Map';
import './Tours.scss';
import { useLoaderData } from 'react-router-dom';

function Tours() {
	// const data = listData;

	const tours = useLoaderData();
	// console.log(tours);

	return (
		<div className="tours">
			<div className="listContainer">
				<div className="wrapper">
					<Filter />
					{tours.map(tour => (
						<TourCard key={tour.id} tour={tour} />
					))}
				</div>
			</div>
			<div className="mapContainer">
				<Map
					showTourDetail={true}
					locations={tours.map(tour => ({
						...tour.startLocation,
						name: tour.name,
						_id: tour._id,
					}))}
				/>
			</div>
		</div>
	);
}

export default Tours;
