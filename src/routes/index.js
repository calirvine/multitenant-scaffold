const express = require('express');
const router = express.Router();
const authMiddleware = require('../authentication/middleware');
const authUtils = require('../authentication/utils');
import * as connectionResolver from '../connections/connectionResolver';
const authRoutes = require('./authentication');
const publicRoutes = require('./public');
const privateRoutes = require('./private');
const adminRoutes = require('./admin');

router.use('/auth', authRoutes);
router.get('/healthcheck', (req, res) => {
  if (req.localhost)
    return res
      .status(200)
      .send({ message: 'Localhost connection', user: req.session });
  res.status(200).send({ message: "I'm listening", user: req.user });
});
router.use('/internal', authMiddleware.admin, adminRoutes);
router.use(
  '/private',
  connectionResolver.resolve,
  authMiddleware.auth,
  privateRoutes
);
router.use('/', connectionResolver.resolve, publicRoutes);

module.exports = router;
