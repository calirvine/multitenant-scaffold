const commonDb = require('./commonDBConnection');
let connectionMap;

/**
 *  create a map of database schema names for each domain in the tenants database
 **/
export async function connectAllDb() {
  try {
    const { rows: tenants } = await commonDb.query(
      'SELECT * FROM tenants;',
      []
    );

    connectionMap = tenants
      .map(tenant => {
        return {
          [tenant.domain]: tenant.tenant_name
        };
      })
      .reduce((prev, next) => {
        return Object.assign({}, prev, next);
      }, {});
  } catch (e) {
    console.log('error', e);
    return;
  }
}

import { getNamespace } from 'continuation-local-storage';
/**
 *  Get the schema name for the given tenant's domain.
 **/
export function getTenantSchemaByDomain(domain) {
  if (connectionMap) {
    return connectionMap[domain];
  }
  return null;
}

import Config from '../config/config';
const config = Config();

/**
 *  Get the connection information (knex instance) for current context.
 **/
export function getConnection() {
  const nameSpace = getNamespace(`${config.appName} context`);
  const conn = nameSpace.get('connection');
  if (!conn) {
    throw 'Connection is not set for any tenant database.';
  }

  return conn;
}
