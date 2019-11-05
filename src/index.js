const express = require('express');
const initApp = require('./init');
const config = require('./config/config');
const { connectAllDb } = require('./connections/connectionManager');
const routes = require('./routes');

//const config = Config();
const app = express();

async function startApplication() {
  const PORT = config.port || 8080;

  initApp.attachMiddleware(app);
  connectAllDb().then(res => {
    if (res === true) console.log('App is ready');
    else {
      console.log({ res });
      console.log("App isn't ready, please run build script.");
      process.exit(0);
    }
  });

  app.use('/', routes);

  app.listen(PORT, () => {
    console.log(`${config.appName} started at port: ${PORT}`);
  });
}

startApplication();
