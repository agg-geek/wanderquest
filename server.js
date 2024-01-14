const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

mongoose
	.connect(process.env.DATABASE_URL)
	.then(() => console.log('Successfully connected to the database!'))
	.catch(() => console.log('Connection to database failed'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
