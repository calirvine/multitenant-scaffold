const userServices = require('../../services/userService');

const logout = (req, res, next) => {
  req.logout();
  req.session.destroy(err => {
    if (err) {
      console.log('Failed to destroy session');
      return next(err);
    }
    res.status(200).send({ message: 'Logged out', success: true });
  });
};

module.exports = logout;
