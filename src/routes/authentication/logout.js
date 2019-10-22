const userServices = require('../../services/userService');

const logout = (req, res, next) => {
  req.logout();
  req.session.destroy(err => {
    if (err) {
      req.logger('Failed to destroy session', 'error');
      return next(err);
    }
    res.status(200).send({ message: 'Logged out', success: true });
  });
};

module.exports = logout;
