const UserService = require('../../services/userService');

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    await UserService.createUser(username, password, 'user');

    return res
      .status(201)
      .send({ succes: true, message: `User ${username} has been created.` });
  } catch (err) {
    res.status(500).send({ success: false, err });
  }
};

module.exports = register;
