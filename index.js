// Import ExpressJS framework
import express from 'express';

//Setup handlebars
import exphbs from 'express-handlebars';

import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import pgPromise from 'pg-promise';
import MangoShopper from './mango-shopper.js';
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


const mangoShop = MangoShopper(db);
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

app.get('/', async function(req, res) {
	const qty = req.body.qty;
	const price = req.body.price;
	const shop = req.body.shop;
	await mangoShop.topFiveDeals(shop, qty, price);
	res.render('home')
});

app.get('/mango-deal', async function (req, res) {
	const shops = await mangoShop.listShops();
	res.render('mangoDeal', {shops});
});

app.post('/mango-deal', async function(req, res) {
	const qty = req.body.qty;
	const price = req.body.price;
	const shop = req.body.shop;
	await mangoShop.createDeal(shop, qty, price);
	res.render('shops');
});


app.get("/shops", async function(req, res) {
	const shops = await mangoShop.listShops();
	res.render('shops', {shops})
});

app.get("/shops/:shopId", async function(req, res) {
	const shopId = req.params.shopId
	const deals = await mangoShop.dealsForShop(shopId);
	res.render('shopDeals', {deals})
});

app.get('/add-shop', function(req, res) {
	res.render('shopAdd');
});

app.post('/add-shop', async function(req, res) {
	await mangoShop.createShop(req.body.name);
	const shops = await mangoShop.listShops();
	res.render('shops', {shops})
});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`MangoApp started on port ${PORT}`)
});