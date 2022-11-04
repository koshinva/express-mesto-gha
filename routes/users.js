const router = require('express').Router();
const { getUsers, getUserById, addUser } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:userId', getUserById);

module.exports = router;
