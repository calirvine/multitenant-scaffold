require('dotenv').config();

export default function Config() {
  const {
    NODE_ENV,
    DB_HOST,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    DB_CLIENT,
    APP_NAME,
    SECRET,
    PORT,
    REDIS_URL
  } = process.env;
  let config = { appName: APP_NAME, NODE_ENV: NODE_ENV || 'development' };

  return (config = {
    ...config,
    dbDatabase: DB_DATABASE,
    dbHost: DB_HOST,
    dbUser: DB_USER,
    dbPassword: DB_PASSWORD,
    dbPort: DB_PORT,
    dbClient: DB_CLIENT,
    secret: SECRET,
    port: PORT,
    redisStore: {
      url: REDIS_URL,
      secret: SECRET
    }
  });
}
