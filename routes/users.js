const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getInfoAboutCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getInfoAboutCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
