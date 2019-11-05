import { getTenantSchemaByDomain } from './connectionManager';

/**
 * Get the connection instance for the given tenant's domain and set it to the current context.
 **/
export async function resolve(req, res, next) {
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

  const tenant = await getTenantSchemaByDomain(domain);
  if (tenant === null) {
    res.status(404).json({
      error: { message: `404 no website found under the specified domain.` }
    });
    return;
  }
  req.tenant = tenant;

  next();
}
