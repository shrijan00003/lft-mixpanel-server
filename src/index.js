import './env';
import './db';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import routes from './routes';
import favicon from 'serve-favicon';
import logger from './utils/logger';
import bodyParser from 'body-parser';
import compression from 'compression';
import json from './middlewares/json';
import * as errorHandler from './middlewares/errorHandler';

import redis from 'redis';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);

const app = express();

const APP_PORT =
  (process.env.NODE_ENV === 'test' ? process.env.TEST_APP_PORT : process.env.APP_PORT) || process.env.PORT || '3000';
const APP_HOST = process.env.APP_HOST || '0.0.0.0';

app.set('port', APP_PORT);
app.set('host', APP_HOST);

app.locals.title = process.env.APP_NAME;
app.locals.version = process.env.APP_VERSION;

app.use(favicon(path.join(__dirname, '/../public', 'favicon.ico')));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(errorHandler.bodyParser);
app.use(json);

// Using Session using Redis
// Using cookie parser
app.use(cookieParser('secretSign#143_!223'));
app.use(
  session({
    secret: 'mynepal12',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 10000 }),
    saveUninitialized: false,
    resave: false,
  })
);

// Everything in the public folder is served as static content
app.use(express.static(path.join(__dirname, '/../public')));

// API Routes
app.use('/api', routes);

// Error Middlewares
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);

app.listen(app.get('port'), () => {
  logger.log('info', `Server started at :${app.get('port')}`);
});

export default app;
