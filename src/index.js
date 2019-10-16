import express from 'express';
const app = express();
const initApp = require('./init');
import Config from './config/config';
const config = Config();

import { connectAllDb } from './connections/connectionManager';

async function startApplication() {
  const routes = require('./routes');
  const PORT = config.port || 8080;

  initApp.attachMiddleware(app);
  connectAllDb();

  app.use('/', routes);

  app.listen(PORT, () => {
    console.log(`${config.appName} started at port: ${PORT}`);
  });
}

console.log('Attempting to start application...');

startApplication();
