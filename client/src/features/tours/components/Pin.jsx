import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import './Pin.scss';

function Pin({ location, showTourDetail }) {
	return (
		<Marker position={[location.coordinates[1], location.coordinates[0]]}>
			<Popup>
				<div className="popupContainer">
					{/* <img src={location.img} alt="" /> */}
					<div className="textContainer">
						{showTourDetail && (
							<Link to={`/tours/${location._id}`}>{location.name}</Link>
						)}
						<b>{location.description}</b>
						{!showTourDetail && <span>Day {location.day}</span>}
					</div>
				</div>
			</Popup>
		</Marker>
	);
}

export default Pin;
