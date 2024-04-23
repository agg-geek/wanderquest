import SearchBar from './SearchBar';
import './Home.scss';

function Home() {
	return (
		<div className="home">
			<div className="textContainer">
				<div className="wrapper">
					<h1 className="title">
						Discover exciting tours and create infinite memories!
					</h1>
					<SearchBar />
				</div>
			</div>
			<div className="imgContainer">
				<img src="/bg.jpg" alt="" />
			</div>
		</div>
	);
}

export default Home;
