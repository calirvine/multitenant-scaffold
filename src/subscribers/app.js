const events = require('./events');
const init = require('../init');
const { connectAllDb } = require('../connections/connectionManager');

const initApp = em => {
  console.log(`Initializing app tables...`);
  init.initCommonDb().then(res => em.emit(events.app.initComplete));
};

const initComplete = async () => {
  console.log(
    'Initializing tables complete... \nResolving tenant connections.'
  );
  await connectAllDb();
  console.log(`App is ready.`);
};

module.exports = em => {
  em.on(events.app.initDb, () => initApp(em));
  em.on(events.app.initComplete, initComplete);
};
