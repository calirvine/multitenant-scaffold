const db = require('../connections/commonDBConnection');
const em = require('../subscribers/');
const events = require('../subscribers/events');

module.exports = {
  getOneTenant: async id => {
    try {
      const { rows: tenant } = await db.query(
        'SELECT * FROM tenants WHERE id=$1',
        [id]
      );
      return tenant;
    } catch (err) {
      return err;
    }
  },

  getAllTenants: async (limit = null, page = null) => {
    try {
      const offset = limit * page;
      const { rows: tenant } = await db.query(
        'SELECT * FROM tenants ORDER BY created_at asc LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return tenant;
    } catch (err) {
      return err;
    }
  },

  postTenant: async (user, domain, tenantName) => {
    try {
      const { rows: tenant } = await db.query(
        'INSERT INTO tenants (domain, tenant_name, primary_user, updated_at, status) VALUES ($1, $2, $3, NOW(), 1) RETURNING *',
        [domain, tenantName, user]
      );
      em.emit(events.tenant.createSchema, tenant[0]);
      return tenant[0];
    } catch (err) {
      return err;
    }
  },

  deleteTenant: async tenantId => {
    try {
      await db.query('DELETE FROM tenants WHERE id=$1', [tenantId]);
      return true;
    } catch (err) {
      return err;
    }
  },

  archiveTenant: async tenantId => {
    try {
      const { rows: tenant } = await db.query(
        'UPDATE tenants SET status=$1 WHERE id=$2 RETURNING *;',
        [-1, id]
      );
      return tenant[0];
    } catch (err) {
      return err;
    }
  },

  updateTenantById: async tenant => {
    try {
      const { id, domain, tenantName, primaryUser } = tenant;
      const { rows: tenant } = await db.query(
        'UPDATE tenants SET domain=$1, tenant_name=$2, primary_user=$3 WHERE id=$4 RETURNING *;',
        [domain, tenantName, primaryUser, id]
      );
      return tenant[0];
    } catch (err) {
      return err;
    }
  }
};
