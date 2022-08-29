const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getAllUsers,
  addPhoto,
  updateLikes,
} = require('../controllers/userController');

const {
  validateUserExist,
  validateRegister,
} = require('../middlewares/validate');

router.post('/register', [validateUserExist, validateRegister], register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/add-photo', addPhoto);
router.post('/update-likes', updateLikes);
router.get('/all-users', getAllUsers);

module.exports = router;
