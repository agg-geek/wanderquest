import { useState } from 'react';
import './SearchBar.scss';
import { Link } from 'react-router-dom';

function SearchBar() {
	const [startLocation, setStartLocation] = useState('');

	return (
		<div className="searchBar">
			<div>
				<input
					type="text"
					name="location"
					placeholder="Start location"
					onChange={e => setStartLocation(e.target.value)}
				/>
				<Link
					to={
						startLocation
							? `/tours?searchKey=startLocation.address&searchValue=${startLocation}`
							: '/tours'
					}
				>
					<button>
						<img src="/search.png" alt="" />
					</button>
				</Link>
			</div>
		</div>
	);
}

export default SearchBar;
