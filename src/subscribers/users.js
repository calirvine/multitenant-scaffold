const events = require('./events');

const signUp = (user = {}) => {
  console.log(`User ${user.id} created.`);
};

module.exports = em => {
  em.on(events.user.signUp, signUp);
};
