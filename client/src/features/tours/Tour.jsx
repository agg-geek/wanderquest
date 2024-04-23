import './Tour.scss';
import Slider from './components/Slider';
import Map from './components/Map';
// import { tour, userData } from '../../lib/dummydata';
import { Link, useLoaderData } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Tour() {
	const tour = useLoaderData();

	const { currentUser } = useContext(AuthContext);

	return (
		<div className="tour">
			<div className="details">
				<div className="wrapper">
					<Slider images={tour.images} />
					<div className="info">
						<div className="top">
							<div className="post">
								<h1>{tour.name}</h1>
								<div className="address">
									<img src="/pin.png" alt="" />
									<span>{tour.startLocation.description}</span>
								</div>
								<div className="price">$ {tour.price}</div>
							</div>

							<div className="purchase">
								{currentUser ? (
									<Link to={`/pay/${tour._id}`}>
										<span>Book tour!</span>
									</Link>
								) : (
									<Link to="/login">
										<span>Login to book tour</span>
									</Link>
								)}
							</div>
						</div>
						<div className="bottom">{tour.description}</div>
					</div>
				</div>
			</div>
			<div className="features">
				<div className="wrapper">
					<p className="title">Tour description</p>
					<div className="listHorizontal">
						<div className="feature">
							<svg>
								<use xlinkHref="/icons.svg#icon-clock"></use>
							</svg>
							<div className="featureText">
								<span>Duration</span>
								<p>{tour.duration} days</p>
							</div>
						</div>
						<div className="feature">
							<svg>
								<use xlinkHref="/icons.svg#icon-map-pin"></use>
							</svg>
							<div className="featureText">
								<span>Start location</span>
								<p>{tour.startLocation.description}</p>
							</div>
						</div>
						<div className="feature">
							<svg>
								<use xlinkHref="/icons.svg#icon-calendar"></use>
							</svg>
							<div className="featureText">
								<span>Tour starts</span>
								<p>
									{new Date(tour.startDates[0]).toLocaleDateString(
										'en-GB'
									)}
								</p>
							</div>
						</div>
					</div>
					<div className="listHorizontal">
						<div className="feature">
							<svg>
								<use xlinkHref="/icons.svg#icon-trending-up"></use>
							</svg>
							<div className="featureText">
								<span>Difficulty</span>
								<p>
									{tour.difficulty[0].toUpperCase() +
										tour.difficulty.substr(1)}
								</p>
							</div>
						</div>
						<div className="feature">
							<svg>
								<use xlinkHref="/icons.svg#icon-user"></use>
							</svg>
							<div className="featureText">
								<span>Participants</span>
								<p>Max {tour.maxGroupSize} people</p>
							</div>
						</div>
						<div className="feature">
							<svg>
								<use xlinkHref="/icons.svg#icon-star"></use>
							</svg>
							<div className="featureText">
								<span>Tour rating</span>
								<p> {tour.ratingsAvg} / 5</p>
							</div>
						</div>
					</div>
					<p className="title">Location</p>
					<div className="mapContainer">
						<Map locations={tour.locations} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Tour;
