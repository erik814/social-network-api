const router = require('express').Router();
const {
    getThoughts,
    getSingleThought,
    createThought

} = require('../../controllers/thoughtController');

// /api/users
router.route('/').get(getThoughts).post(createThought);

// /api/users/:userId
router.route('/:userId').get(getSingleThought)
//.put(updateUser).delete(deleteUser);

// router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;