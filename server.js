const dotenv = require('dotenv');

// you might otherwise use config.env as defining env variable in the terminal is not very nice
// use dotenv to connect to that env file
dotenv.config({ path: './config.env' });

// keep this log here to see the env variables read by dotenv in above line
console.log(process.env);

// also keep this app after reading dotenv so that
// the process.env variables become available to code in app.js and stuff
const app = require('./app');

// also have a look at the package.json files

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
