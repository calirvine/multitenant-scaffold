import { createNamespace } from 'continuation-local-storage';

import { getTenantSchemaByDomain } from './connectionManager';
const config = require('../config/config');
// Create a namespace for the application.
let nameSpace = createNamespace(`${config.appName} context`);

/**
 * Get the connection instance for the given tenant's domain and set it to the current context.
 **/
export function resolve(req, res, next) {
  let domain = req.hostname;
  if (domain === 'localhost') {
    req.localhost = true;
    domain = req.query.domain || '127.0.0.1';
  }
  if (!domain) {
    res.status(404).json({
      error: { message: `404 no website found under the specified domain.` }
    });
    return;
  }

  req.domain = {
    domain,
    nameSpace: nameSpace.get('connection')
  };

  // Run the application in the defined namespace. It will contextualize every underlying function calls.
  nameSpace.run(() => {
    nameSpace.set('connection', getTenantSchemaByDomain(domain)); // Sets current schema to the tenant's schema
    req.domain = {
      domain,
      nameSpace: nameSpace.get('connection')
    };
    next();
  });
}
