const authUtils = require('../authentication/utils');
const db = require('../connections/commonDBConnection');
const em = require('../subscribers/');
const events = require('../subscribers/events');

module.exports = {
  createUser: async (username, password, type) => {
    const passwordHash = await authUtils.hashPassword(password);
    const { rows } = await db.query(
      'INSERT INTO users (username, password, type) VALUES ($1, $2, $3) RETURNING id, username, type',
      [username, passwordHash, type]
    );

    //console.log({ rows });
    em.emit(events.user.signUp, { ...rows[0] });
    return rows;
  }
};
