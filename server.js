const app = require('./app');
const dotenv = require('dotenv');

console.log(app.get('env')); // development, env variable set by express
console.log(process.env); // env variables set by nodejs
// many packages depend on NODE_ENV, which is not defined by express
// define it as 'NODE_ENV=development nodemon server.js' in the terminal
// define other variables like 'X=23 nodemon server.js' if required

const port = 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
