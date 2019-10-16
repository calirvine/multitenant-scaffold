const router = require('express').Router();
const tenantService = require('../../services/tenantService');

router.get('/:limit/:page', async (req, res) => {
  try {
    const { limit, page } = req.params;
    const tenants = await tenantService.getAllTenants(limit, page);
    return res.status(200).send({ tenants });
  } catch (err) {
    return res.status(500).send({ success: false, error: err });
  }
});

router.get('/', async (req, res) => {
  try {
    const tenants = await tenantService.getAllTenants();
    return res.status(200).send({ tenants });
  } catch (err) {
    return res.status(500).send({ success: false, error: err });
  }
});

router.post('/', async (req, res) => {
  const { user, domain, tenantName } = req.body;
  if (!user || !domain || !tenantName) {
    return res
      .status(400)
      .send({
        error: { message: 'Information about tenant missing from request.' }
      });
  }
  try {
    const tenant = await tenantService.postTenant(user, domain, tenantName);
    res.status(201).send(tenant);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
