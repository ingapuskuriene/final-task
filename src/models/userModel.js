const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  photos: {
    type: Array,
    required: true,
  },
  liked_profiles: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model('users', userSchema);
