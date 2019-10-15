const router = require('express').Router();
const tenantsRoutes = require('./tenant');

router.use('/tenants', tenantsRoutes);

router.get('/', (req, res) => {
  res.status(200).send({ message: 'You are in an admin endpoint' });
});

module.exports = router;
