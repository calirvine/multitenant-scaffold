const router = require('express').Router();

const login = require('./login');
const register = require('./register');
const logout = require('./logout');

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.use('/', (req, res) => {
  res.status(404).send({ message: 'endpoint not implemented' });
});

module.exports = router;
