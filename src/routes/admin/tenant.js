const router = require('express').Router();
const db = require('../../connections/commonDBConnection');

router.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM tenants;');
  if (rows) {
    return res.status(200).send({ success: true, data: rows });
  }
  return res.status(500).send({ success: false, data: [] });
});

router.post('/', async (req, res) => {
  const { user, domain, tenantName } = req.body;
  try {
    db.query(
      'INSERT INTO tenants (primary_user, domain, tenant_name) VALUES ($1, $2, $3)',
      [user, domain, tenantName]
    );
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
