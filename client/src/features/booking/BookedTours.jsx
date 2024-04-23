import './BookedTours.scss';
import Card from '../tours/components/TourCard';

function List({ bookedTours }) {
	return (
		<div className="list">
			{bookedTours.map(tour => (
				<Card key={tour.id} tour={tour} />
			))}
		</div>
	);
}

export default List;
