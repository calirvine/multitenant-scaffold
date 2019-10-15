import express from 'express';
const app = express();
import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import Config from './config/config';
const config = Config();

require('dotenv').config();
import { connectAllDb } from './connections/connectionManager';
import * as connectionResolver from './connections/connectionResolver';

async function startApplication() {
  const passport = require('./authentication/passportConfig');
  const session = require('express-session');
  const RedisStore = require('connect-redis')(session);
  const redis = require('redis');
  const redisClient = redis.createClient(process.env.REDIS_URL);
  const uuid = require('uuid/v4');

  const routes = require('./routes');

  app.use(bodyParser.json());
  app.use(morgan('tiny'));
  app.use(
    session({
      genid: req => uuid(),
      store: new RedisStore({ client: redisClient }),
      secret: config.redisStore.secret,
      resave: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const PORT = process.env.PORT || 8080;

  connectAllDb();

  app.use(connectionResolver.resolve);
  app.use('/', routes);

  app.listen(PORT, () => {
    console.log(`${config.appName} started at port: ${PORT}`);
  });
}

const initDb = require('./init');
console.log('Initializing application...');
initDb.initCommonDb().then(res => startApplication());
