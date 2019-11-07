import { Pool } from 'pg';
const config = require('../config/config');
try {
  const { appName, dbHost, dbUser, dbPort, dbPassword, NODE_ENV } = config;

  const versionString = `_${NODE_ENV}`;

  const commonDb = appName + versionString;

  const poolConfig = {
    user: dbUser,
    host: dbHost,
    port: dbPort,
    database: commonDb,
    password: dbPassword
  };

  const pool = new Pool(poolConfig);
  pool.on('connect', () => console.log('PG connected'));
  pool.on('error', () => console.log('Error connecting to PG'));
  module.exports = {
    query: (query, params) => {
      return pool.query(query, params);
    }
  };
} catch (err) {
  console.log(
    `App failed to connect to database, please ensure your environment variables are set up correctly and that your database is running.`
  );
  process.exit(0);
}
