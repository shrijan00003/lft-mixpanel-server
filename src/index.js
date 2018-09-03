import './env';
import './db';
import cors from 'cors';
import path from 'path';
import redis from 'redis';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import routes from './routes';
import favicon from 'serve-favicon';
import logger from './utils/logger';
import bodyParser from 'body-parser';
import compression from 'compression';
import json from './middlewares/json';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as errorHandler from './middlewares/errorHandler';

const http = require('http');
const socketIo = require('socket.io');

const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);

const app = express();

// Listening for live record
const server = http.createServer(app);
const io = socketIo(server);

let connections = [];

io.on('connection', socket => {
  connections.push(socket);
  console.log('Conected: %s socktes connected', connections.length);

  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  socket.emit('FromAPI', 100);
  // socket.on('FromAPI', function() {
  //   io.emit('new message');
  // });
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization'
  );
  next();
});

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
    store: new redisStore({
      host: 'localhost',
      port: 6379,
      client: redisClient,
      ttl: 10000,
    }),
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

server.listen(app.get('port'), () => {
  logger.log('info', `Server started at :${app.get('port')}`);
});

export default app;
