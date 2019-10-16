const events = require('./events');
const db = require('../connections/commonDBConnection');

const initSchema = (tenant, em) => {
  console.log('Create schema for user');
  console.log({ tenant });
};

module.exports = em => {
  em.on(events.tenant.createSchema, tenant => initSchema(tenant, em));
};
