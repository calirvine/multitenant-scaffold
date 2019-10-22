const events = require('./events');
const db = require('../connections/commonDBConnection');

const initSchema = async (tenant, em) => {
  const schemaId = `tenant_${tenant.id.substr(0, 8)}_${tenant.id.substr(
    24,
    12
  )}`;
  let query = `CREATE SCHEMA ${schemaId} `;
  query += 'CREATE TABLE user_roles (id UUID PRIMARY KEY, role INTEGER) ';
  query += 'CREATE TABLE roles (id INTEGER PRIMARY KEY, role TEXT) ';
  query +=
    'CREATE TABLE preferences(id UUID DEFAULT uuid_generate_v4(), category TEXT, options JSON);';
  console.log(query);
  db.query(query);
};

module.exports = em => {
  em.on(events.tenant.createSchema, tenant => initSchema(tenant, em));
};
