const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../connections/postgresConnection');
const utils = require('./utils');

passport.use(
  new LocalStrategy(async (username, password, callback) => {
    try {
      const { rows } = await db.query('SELECT * FROM users WHERE username=$1', [
        username
      ]);
      if (rows.length > 0) {
        const user = rows[0];
        const passwordMatch = await utils.comparePassword(
          password,
          user.password
        );
        if (passwordMatch) {
          delete user.password;
          callback(null, user);
        } else callback(null, false);
      }
    } catch (err) {
      console.log(`Caught an error in passport-local strategy`);
      callback(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, callback) => {
  try {
    const { rows: user } = await db.query(
      'SELECT id, username, type FROM users WHERE id=$1',
      [id]
    );
    callback(null, user[0]);
  } catch (err) {
    callback(err);
  }
});
module.exports = passport;
