'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser')();
const config = require('config');
const session = require('koa-session')
const passport = require('koa-passport');
const YandexStrategy = require('passport-yandex').Strategy;

const logger = require('libs/logger')('app');

const {renderToStaticMarkup} = require('react-dom/server');

const loginBotController = require('./controllers/bot/login');
const getCardsController = require('./controllers/cards/get-cards');
const createCardController = require('./controllers/cards/create');
const deleteCardController = require('./controllers/cards/delete');
const getTransactionController = require('./controllers/transactions/get');
const createTransactionsController = require('./controllers/transactions/create');
const getTransactionByFileController = require('./controllers/transactions/file-transactions');
const cardToCard = require('./controllers/cards/card-to-card');
const cardToMobile = require('./controllers/cards/card-to-mobile');
const mobileToCard = require('./controllers/cards/mobile-to-card');

const errorController = require('./controllers/error');

const ApplicationError = require('libs/application-error');
const CardsModel = require('source/models/cards');
const TransactionsModel = require('source/models/transactions');
const UsersModel = require('source/models/users');
const Bot = require('source/models/bot');

const getTransactionsController = require('./controllers/transactions/get-transactions');
const confirmTransactionsController = require('./controllers/transactions/confirm-transactions');

const mongoose = require('mongoose');
mongoose.connect(config.get('mongo.uri'), { useMongoClient: true });
mongoose.Promise = global.Promise;

const app = new Koa();

function getView(viewId) {
	const viewPath = path.resolve(__dirname, 'views', `${viewId}.server.js`);
	delete require.cache[require.resolve(viewPath)];
	return require(viewPath);
}

async function getData(ctx) {
	let user = [],
		cards = [],
		transactions = [];
	if (ctx.session.passport) {
		user = await ctx.usersModel.getById(ctx.session.passport.user);
		user.isAuthorized = true;
		cards = await ctx.cardsModel.getAllFromUser(user.id);
		transactions = await ctx.transactionsModel.getAll();
	} else {
		user.login = 'none';
		user.name = 'none';
		user.isAuthorized = false;
	}

	return {
		user,
		cards,
		transactions
	};
}

app.keys = ['secret-3hfc34875cb238d2nd3d2'];
app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new YandexStrategy({
	clientID: process.env.NODE_ENV === 'production' ? config.get('auth.prod.clientID') : config.get('auth.dev.clientID'),
	clientSecret: process.env.NODE_ENV === 'production' ? config.get('auth.prod.clientSecret') : config.get('auth.dev.clientSecret'),
	//callbackURL:  "https://localhost:3000/auth",
	//passReqToCallback: true
}, async function (accessToken, refreshToken, profile, next) {

	const usersModel = new UsersModel();
	const user = await usersModel.getByYandexId(profile.id);
	let id;

	if (user && user.id) {
		id = user.id;
	} else {
		const userParam = {
			login: profile._json.login,
			name: profile._json.real_name,
			yandex: profile.id,
		};
		if (!profile._json.is_avatar_empty) {
			userParam.avatar = 'https://avatars.yandex.net/get-yapic/'+profile._json.default_avatar_id+'/islands-200/';
		}

		const newUser = await usersModel.create(userParam);
		id = newUser.id;
	}

	return next(false, id);
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// Сохраним параметр id в ctx.params.id
router.param('id', (id, ctx, next) => next());

router.get('/', async (ctx) => {
	const data = await getData(ctx);
	const indexView = getView('index');
	const indexViewHtml = renderToStaticMarkup(indexView(data));

	ctx.body = indexViewHtml;
});

router.get('/auth/yandex', passport.authenticate('yandex'));
router.get('/auth',
	passport.authenticate('yandex', {
		successRedirect: '/',
		failureRedirect: '/'
	})
);

router.get('/logout',async (ctx) => {
	ctx.session.passport = null;
	ctx.body = 'ok';
});

router.get('/bot/:id', loginBotController);

router.get('/cards/', getCardsController);
router.post('/cards/', createCardController);
router.delete('/cards/:id', deleteCardController);

router.get('/cards/:id/transactions/', getTransactionController);
router.post('/cards/:id/transactions/', createTransactionsController);
router.get('/cards/:id/file-transactions/', getTransactionByFileController);

router.post('/cards/:id/transfer', cardToCard);
router.post('/cards/:id/pay', cardToMobile);
router.post('/cards/:id/fill', mobileToCard);

router.get('/transactions/', getTransactionsController);
router.post('/transactions/confirm', confirmTransactionsController);

router.all('/error', errorController);

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		logger.error('Error detected', err);
		ctx.status = err instanceof ApplicationError ? err.status : 500;
		ctx.body = `Error [${err.message}] :(`;
	}
});

// Создадим модель Cards и Transactions на уровне приложения и проинициализируем ее
app.use(async (ctx, next) => {
	ctx.cardsModel = new CardsModel();
	ctx.transactionsModel = new TransactionsModel();
	ctx.usersModel = new UsersModel();
	ctx.bot = Bot();

	await next();
});

app.use(bodyParser);
app.use(router.routes());
app.use(serve('./public'));

const listenCallback = function() {
	const {
		port
	} = this.address();

	logger.info(`Application started on ${port}`);
};

const LISTEN_PORT = process.env.PORT ? process.env.PORT :
	config.get('server.port') ? config.get('server.port') : 3000;

if (!module.parent && config.get('isHttps')) {
	const protocolSecrets = {
		key: fs.readFileSync(config.get('ssl.key')),
		cert: fs.readFileSync(config.get('ssl.cert'))
	};

	https
		.createServer(protocolSecrets, app.callback())
		.listen(LISTEN_PORT, listenCallback);
}

if (!module.parent && !config.get('isHttps')) {
	http
		.createServer(app.callback())
		.listen(LISTEN_PORT, listenCallback);
}

module.exports = app;
