const events = require('./events');
const db = require('../connections/commonDBConnection');

const initSchema = async (tenant, em) => {
  const schemaId = `${tenant.id.substr(0, 8)}_${tenant.tenant_name}`;
  let query = `CREATE SCHEMA ${tenant.id} `;
  query += 'CREATE TABLE user_roles ';
  query += 'CREATE TABLE preferences';
  console.log(query);
  db.query(query);
};

module.exports = em => {
  em.on(events.tenant.createSchema, tenant => initSchema(tenant, em));
};
