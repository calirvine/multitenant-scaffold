const express = require('express');
const router = express.Router();

router.use('/', (req, res) =>
  res.status(200).send({ message: 'In a public route.' })
);

module.exports = router;
