import { Link } from 'react-router-dom';
import './TourCard.scss';

function TourCard({ tour }) {
	return (
		<div className="card">
			<Link to={`/tours/${tour._id}`} className="imageContainer">
				<img src={`/tours/${tour.imageCover}`} alt="" />
			</Link>
			<div className="textContainer">
				<h2 className="title">
					<Link to={`/tours/${tour._id}`}>{tour.name}</Link>
				</h2>
				<p className="address">
					<img src="/pin.png" alt="" />
					<span>{tour.startLocation.description}</span>
				</p>
				<p className="price">
					$ {tour.price} <small>per person</small>
				</p>
				<div className="bottom">
					<div className="features">
						<div className="feature">
							<svg>
								<use xlinkHref="/icons.svg#icon-trending-up"></use>
							</svg>
							<p>
								{tour.difficulty[0].toUpperCase() +
									tour.difficulty.substr(1)}
							</p>
						</div>
						<div className="feature">
							<svg>
								<use xlinkHref="/icons.svg#icon-clock"></use>
							</svg>
							<p>{tour.duration} days</p>
						</div>
						<div className="feature">
							<svg>
								<use xlinkHref="/icons.svg#icon-star"></use>
							</svg>
							<p> {tour.ratingsAvg} / 5</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TourCard;
