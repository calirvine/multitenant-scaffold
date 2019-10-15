const passport = require('../../authentication/passportConfig');

const login = (req, res, next) => {
  const { username, password } = req.body;
  const responseJSON = { authenticated: false };
  const errors = [];
  if (!username) errors.push('No username provided');
  if (!password) errors.push('No password provided');
  if (errors.length > 0) {
    return res
      .status(401)
      .json({ auth: false, ...responseJSON, errors: errors });
  }
  passport.authenticate('local', (err, user, info) => {
    if (info) {
      return res.send({ auth: false, error: info.message });
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).send({ auth: false, message: 'no user' });
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }

      return res.status(200).send({ auth: true });
    });
  })(req, res, next);
};

module.exports = login;
