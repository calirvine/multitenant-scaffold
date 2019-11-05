const passport = require('../authentication/passportConfig');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);
const uuid = require('uuid/v4');
import morgan from 'morgan';
import * as bodyParser from 'body-parser';
const config = require('../config/config');
const middlewares = require('../config/middleware');

module.exports = async app => {
  app.use(bodyParser.json());
  app.use(morgan('tiny'));
  app.use(middlewares.logger);

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
};
