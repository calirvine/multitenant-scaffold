const UserService = require('../../services/userService');

const register = async (req, res, next) => {
  const { username, password } = req.body;
  await UserService.createUser(username, password, 'user');

  return res
    .status(201)
    .send({ succes: true, message: `User ${username} has been created.` });
};

module.exports = register;
