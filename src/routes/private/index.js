const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).send({ message: 'In a private route' });
});

module.exports = router;
