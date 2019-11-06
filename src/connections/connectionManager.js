const commonDb = require('./commonDBConnection');
const redis = require('./redisConnection');

/**
 *  create a map of database schema names for each domain in the tenants database
 **/
export async function connectAllDb() {
  try {
    const { rows: tenants } = await commonDb.query(
      'SELECT * FROM tenants;',
      []
    );

    tenants.map(tenant => {
      const schema = `t_${tenant.id.replace(/-/g, '')}`;
      updateRedisConnections('ADD DOMAIN', {
        domain: tenant.domain,
        value: schema
      });
      return tenant;
    });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 *  Get the schema name for the given tenant's domain.
 **/
export async function getTenantSchemaByDomain(domain) {
  const connectionSchema = await redis.hget('domains', domain);
  if (connectionSchema) return connectionSchema;
  else {
    console.log('Checking db');
    const { rows } = await commonDb.query(
      'SELECT * FROM tenants WHERE domain=$1',
      [domain]
    );
    if (rows.length > 0) {
      const schema = `t_${rows[0].id.replace(/-/g, '')}`;
      updateRedisConnections('ADD DOMAIN', { domain: domain, value: schema });
      return { domain, schema };
    }
  }
  return null;
}

export function updateRedisConnections(
  action,
  payload = { domain: null, replaceDomain: null, value: null }
) {
  switch (action) {
    case 'DELETE': {
      redis.hdel('domains', payload.domain);
      break;
    }
    case 'UPDATE DOMAIN': {
      redis.hupdate('domains', payload.domain, payload.replaceDomain);
      break;
    }
    case 'ADD DOMAIN': {
      redis.hset('domains', payload.domain, payload.value);
      break;
    }
    default:
      return;
  }
}
