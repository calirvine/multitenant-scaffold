const commonDB = require('../connections/postgresConnection');
const authUtils = require('../authentication/utils');

async function checkForTables() {
  const response = {};
  const query = 'SELECT to_regclass($1);';
  const tenants = await commonDB.query(query, ['tenants']);
  response.tenants = tenants.rows[0].to_regclass;
  const users = await commonDB.query(query, ['users']);
  response.users = users.rows[0].to_regclass;

  return response;
}

async function makeTable(tableName) {
  return new Promise((resolve, reject) => {
    console.log(`Creating and populating table: ${tableName}`);
    if (tableName === 'users') {
      const query =
        'CREATE TABLE users(id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), username TEXT UNIQUE, password TEXT, type TEXT)';
      const tempPassword = authUtils.hashPassword('password');
      commonDB.query(query, []).then(async res => {
        const insertQuery =
          'INSERT INTO users ( username, password, type) VALUES ($1, $2, $3);';
        commonDB
          .query(insertQuery, ['admin', await tempPassword, 'admin'])
          .then(resolve());
      });
    } else if (tableName === 'tenants') {
      const query =
        'CREATE TABLE tenants(id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), domain TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ, tenant_name TEXT, primary_user uuid)';
      commonDB.query(query, []).then(res => {
        const query =
          'INSERT INTO tenants(domain, tenant_name) VALUES ($1, $2)';
        commonDB.query(query, ['127.0.0.1', 'defaultDomain']).then(resolve());
      });
    }
  });
}

module.exports = {
  initCommonDb: async () => {
    return new Promise(async (resolve, reject) => {
      const whichTables = await checkForTables();
      const uninitializedTable = [];
      for (let table in whichTables) {
        if (!whichTables[table]) await makeTable(table);
      }
      resolve();
    });
  }
};
