const express = require('express');
const initApp = require('./init');
const config = require('./config/config');
const { connectAllDb } = require('./connections/connectionManager');
const routes = require('./routes');

//const config = Config();
const app = express();

async function startApplication() {
  const PORT = config.port || 8080;
  connectAllDb().then(res => {
    if (res === true) {
      initApp.attachMiddleware(app);
      app.use('/', routes);

      const server = app.listen(PORT, () => {
        console.log(`${config.appName} started at port: ${PORT}`);
      });

      process.on('SIGTERM', shutDown);
      process.on('SIGINT', shutDown);

      let connections = [];

      server.on('connection', connection => {
        connections.push(connection);
        connection.on(
          'close',
          () => (connections = connections.filter(curr => curr !== connection))
        );
      });

      function shutDown() {
        console.log('Received kill signal, shutting down gracefully');
        server.close(() => {
          console.log('Closed out remaining connections');
          process.exit(0);
        });

        setTimeout(() => {
          console.error(
            'Could not close connections in time, forcefully shutting down'
          );
          process.exit(1);
        }, 10000);

        connections.forEach(curr => curr.end());
        setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
      }
    } else {
      console.log({ res });
      console.log("App isn't ready, please run init script.");
      process.exit(0);
    }
  });
}

startApplication();
