const events = require('./events');
const db = require('../connections/postgresConnection');
const redis = require('../connections/redisConnection');

const initSchema = async (tenant, em) => {
  const schemaId = `t_${tenant.id.replace(/-/g, '')}`;
  let query = `CREATE SCHEMA ${schemaId} `;
  query += 'CREATE TABLE user_roles (id UUID PRIMARY KEY, role INTEGER) ';
  query += 'CREATE TABLE roles (id INTEGER PRIMARY KEY, role TEXT) ';
  query +=
    'CREATE TABLE preferences(id UUID DEFAULT uuid_generate_v4(), category TEXT, options JSON);';
  db.query(query);
};

module.exports = em => {
  em.on(events.tenant.createSchema, tenant => initSchema(tenant, em));
};
