const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports = {
  register: async (req, res) => {
    const { username, passOne, gender, age, city } = req.body;

    const user = new userModel();

    user.username = username;
    user.password = await bcrypt.hash(passOne, 10);
    user.gender = gender;
    user.age = age;
    user.city = city;
    user.photos = [];
    user.liked_profiles = [];

    try {
      user.save((err, result) => {
        res.send({
          success: true,
          user: {
            username,
            gender,
            age,
            city,
            photos: [],
            liked_profiles: [],
            userId: result._doc._id,
          },
        });
      });
    } catch (error) {
      res.send({ success: false, error });
    }
  },
  login: async (req, res) => {
    const { username, password, stayLoggedIn } = req.body;

    const sessionUserId = req.session.userId;
    const filter = sessionUserId ? { _id: sessionUserId } : { username };
    const user = await userModel.findOne(filter);

    if (user) {
      const result = {
        success: true,
        userId: user._id,
        username: user.username,
        photos: user.photos,
        gender: user.gender,
        age: user.age,
        city: user.city,
        liked_profiles: [...new Set(user.liked_profiles)],
        autoLogin: stayLoggedIn,
      };

      if (sessionUserId) {
        return res.send(result);
      }

      const passMatch = await bcrypt.compare(password, user.password);

      if (passMatch) {
        if (stayLoggedIn === true) {
          req.session.userId = user._id;
        }

        return res.send(result);
      } else {
        return res.send({ success: false, error: 'Incorrect credentials' });
      }
    }

    res.send({ success: false, error: 'User does not exist' });
  },
  logout: async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        }
      });

      res.send({ success: true });
      res.end();
    } catch (err) {
      res.send({ success: false, err });
    }
  },
  addPhoto: async (req, res) => {
    const { userId, photos } = req.body;

    const userData = await userModel.findOne({ _id: userId });

    if (!userData) {
      return res.send({
        success: false,
        error: 'User does not exist',
      });
    }

    try {
      await userModel.findOneAndUpdate({ _id: userId }, { $set: { photos } });
      return res.send({ success: true });
    } catch (error) {
      return res.send({ success: false, error: 'Database error' });
    }
  },
  updateLikes: async (req, res) => {
    const { userId, single_profile, liked_profiles, shouldNotify, users } =
      req.body;

    if (shouldNotify) {
      const io = req.app.get('socketio');
      io.emit('message', { receiver: single_profile, sender: userId });
      io.emit('users', users);
    }

    const userData = await userModel.findOne({ _id: userId });

    if (!userData) {
      return res.send({
        success: false,
        error: 'User does not exist',
      });
    }

    try {
      await userModel.findOneAndUpdate(
        { _id: userId },
        { $set: { liked_profiles } }
      );
      return res.send({ success: true });
    } catch (error) {
      return res.send({ success: false, error: 'Database error' });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.find({});
      const showUsers = users.map((user) => ({
        success: true,
        userId: user.id,
        username: user.username,
        photos: user.photos,
        gender: user.gender,
        age: user.age,
        city: user.city,
        liked_profiles: user.liked_profiles,
      }));
      return res.send({ success: true, users: showUsers });
    } catch (error) {
      return res.send({ success: false, error: 'Database error' });
    }
  },
};
