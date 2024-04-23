import { useSearchParams } from 'react-router-dom';
import './Filter.scss';
import { useState } from 'react';

function Filter() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [query, setQuery] = useState({
		searchKey: searchParams.get('searchKey') || '',
		searchValue: searchParams.get('searchValue') || '',
		difficulty: searchParams.get('difficulty') || '',
		duration: searchParams.get('duration[lte]') || '',
		minPrice: searchParams.get('price[gte]') || '',
		maxPrice: searchParams.get('price[lte]') || '',
	});

	const handleChange = e => {
		if (e.target.name == 'startLocation') {
			return setQuery({
				...query,
				searchKey: 'startLocation.address',
				searchValue: e.target.value,
			});
		}

		setQuery({
			...query,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = evt => {
		evt.preventDefault();
		setSearchParams(query);
	};

	return (
		<div className="filter">
			<h1>Search results</h1>
			<form onSubmit={handleSubmit}>
				<div className="top">
					<div className="item">
						<label htmlFor="startLocation">Tour Start Location</label>
						<input
							type="text"
							id="startLocation"
							name="startLocation"
							placeholder="Enter location, eg Miami"
							onChange={handleChange}
						/>
					</div>
				</div>
				<div className="bottom">
					<div className="item">
						<label htmlFor="difficulty">Difficulty</label>
						<select
							name="difficulty"
							id="type"
							value={query.difficulty}
							onChange={handleChange}
						>
							<option value="">All</option>
							<option value="easy">Easy</option>
							<option value="medium">Medium</option>
							<option value="difficult">Hard</option>
						</select>
					</div>
					<div className="item">
						<label htmlFor="duration">Max duration (days)</label>
						<input
							type="number"
							id="maxDuration"
							name="duration[lte]"
							placeholder="Duration"
							// value={query.duration}
							onChange={handleChange}
						/>
					</div>
					{/* <div className="item">
						<label htmlFor="duration">Duration (days)</label>
						<select
							name="duration"
							id="duration"
							value={query.duration}
							onChange={handleChange}
						>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</select>
					</div> */}
					<div className="item">
						<label htmlFor="minPrice">Min price</label>
						<input
							type="number"
							id="minPrice"
							name="price[gte]"
							placeholder="Price"
							// value={query.minPrice}
							onChange={handleChange}
						/>
					</div>
					<div className="item">
						<label htmlFor="maxPrice">Max price</label>
						<input
							type="number"
							id="maxPrice"
							name="price[lte]"
							placeholder="Price"
							// value={query.maxPrice}
							onChange={handleChange}
						/>
					</div>
					{/* <div className="item">
						<label htmlFor="groupsize">Max Group Size</label>
						<input
							type="number"
							id="groupsize"
							name="groupsize"
							placeholder="Size"
						/>
					</div> */}
					<button>
						<img src="/search.png" alt="" />
					</button>
				</div>
			</form>
		</div>
	);
}

export default Filter;
