import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import Pin from './Pin';
import 'leaflet/dist/leaflet.css';
import './Map.scss';
import { useEffect } from 'react';
import L from 'leaflet';

const FitBounds = ({ coordinates }) => {
	const map = useMap();

	useEffect(() => {
		if (coordinates.length > 0) {
			const bounds = L.latLngBounds(coordinates);
			map.fitBounds(bounds);
		}
	}, [coordinates, map]);

	return null;
};

function Map({ locations, showTourDetail }) {
	// console.log(locations);

	return (
		<MapContainer
			center={[52.4797, -1.90269]}
			zoom={7}
			// scrollWheelZoom={false}
			className="map"
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{locations.map(location => (
				<Pin
					showTourDetail={showTourDetail}
					location={location}
					key={location._id}
				/>
			))}

			<FitBounds
				coordinates={locations.map(({ coordinates }) => [
					coordinates[1],
					coordinates[0],
				])}
			/>
		</MapContainer>
	);
}

export default Map;
