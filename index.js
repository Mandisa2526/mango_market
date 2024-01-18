// Import ExpressJS framework
import express from 'express';

//Setup handlebars
import exphbs from 'express-handlebars';

import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import pgPromise from 'pg-promise';
const app = express();
const PORT =  process.env.PORT || 3019;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
const pgp = pgPromise();
// TODO configure this to work.
const connectionString = 'postgres://hztxohjj:gnf9Jun28ApL7YQiAegHpiCPPw3zQOO0@heffalump.db.elephantsql.com/hztxohjj';

const db = pgp(connectionString);

// initialise the flash middleware
app.use(flash());

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// initialise session middleware - flash-express depends on it
app.use(session({
	secret: "<add a secret string here>",
	resave: false,
	saveUninitialized: true
}));

// Import modules
import MangoShopper from './mango-shopper.js';

//Configure the express-handlebars module:
const handlebarSetup = exphbs.engine({
	partialsDir: "./views/partials",
	viewPath: './views',
	layoutsDir: './views/layouts'
  });

// enable the static folder...
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// add more middleware to allow for templating support
app.engine('handlebars', handlebarSetup);
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

let counter = 0;

app.get('/', function(req, res) {
	res.render('home', {
		counter
	});
});

app.post('/', function(req, res) {
	res.render('shopAdd', {
		
	});
});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`MangoApp started on port ${PORT}`)
});