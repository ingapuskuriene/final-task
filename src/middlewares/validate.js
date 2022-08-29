const userModel = require('../models/userModel');

module.exports = {
  validateRegister: (req, res, next) => {
    const { username, passOne, passTwo, age, city, gender } = req.body;

    if (username.length < 5) {
      return res.send({ success: false, error: 'Bad username format' });
    }

    if (passOne !== passTwo) {
      return res.send({ success: false, error: 'Bad password' });
    }

    if (passOne === passTwo && passOne.length < 5) {
      return res.send({ success: false, error: 'Password too short' });
    }
    if (age.length === 0) {
      return res.send({ success: false, error: 'Invalid age' });
    }
    if (gender.length === 0) {
      return res.send({ success: false, error: 'Invalid gender' });
    }
    if (city.length === 0) {
      return res.send({ success: false, error: 'Invalid city' });
    }
    next();
  },
  validateUserExist: async (req, res, next) => {
    const { username } = req.body;
    const userExists = await userModel.findOne({ username });

    if (userExists) {
      return res.send({
        success: false,
        error: 'User name already registered',
      });
    }

    next();
  },
};
