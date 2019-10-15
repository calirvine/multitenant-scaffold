const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

function checkAdmin(req, res, next) {
  if (req.user)
    if (req.user.admin) next();
    else
      return res.status(403).send({
        error: { message: 'You are not authorized to read this data.' }
      });
}

module.exports = {
  hashPassword,
  comparePassword: (password, hash) => bcrypt.compare(password, hash),
  checkAdmin,
  adminTypes: ['admin', 'owner', 'staff']
};
