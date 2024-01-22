// route handler passes the tour data to show.ejs
// to pass the tour from show.ejs into this mapbox.js file,
// we defined a data property on the div#map element
// which is then read below, thus accessing the tour.locations data

const locations = JSON.parse(document.querySelector('#map').dataset.locations);

// mapbox key is variable defined just in show.ejs
// which is passed by the route handler into the ejs
mapboxgl.accessToken = mapboxKey;

var map = new mapboxgl.Map({
	// puts the map on the HTML element with id="map"
	container: 'map',
	style: 'mapbox://styles/abhiagg/clrpcm6iz009101pl52vkcmbo',
	cooperativeGestures: true,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(location => {
	// Create marker and add a custom CSS class to it (see styles.css)
	const el = document.createElement('div');
	el.className = 'marker';

	// Render marker on the map, location.coordinates is specified in tour
	new mapboxgl.Marker({ element: el, anchor: 'bottom' })
		.setLngLat(location.coordinates)
		.addTo(map);

	// Render popup
	new mapboxgl.Popup({ offset: 30 })
		.setLngLat(location.coordinates)
		.setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
		.addTo(map);

	// Extend map bounds to include current location
	bounds.extend(location.coordinates);
});

// adjust the map such that all the locations are shown together
map.fitBounds(bounds, {
	padding: { top: 200, bottom: 150, left: 100, right: 100 },
});
