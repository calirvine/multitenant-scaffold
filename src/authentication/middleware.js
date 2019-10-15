const utils = require('./utils');

const authenticationMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({ authenticated: false });
};

const adminAuthenticationMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    const { user } = req;
    if (utils.adminTypes.includes(user.type)) return next();
  }
  res.status(401).send({ authenticated: false });
};

module.exports = {
  auth: authenticationMiddleware,
  admin: adminAuthenticationMiddleware
};
