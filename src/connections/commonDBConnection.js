import { Pool } from 'pg';

import Config from '../config/config';
const { appName, dbHost, dbUser, dbPort, dbPassword, NODE_ENV } = Config();

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

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  }
};
