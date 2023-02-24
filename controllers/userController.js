const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
    getUsers (req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts', 'friends')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {
        User.findByIdAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({message: 'User does not exist'})
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })
    },

    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                ? res.status(404).json({ message: 'User does not exist' })
                : Thought.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                    )
            )
            .then((thought) =>
                !thought
                ? res.status(404).json({
                    message: 'User deleted, but no thoughts found',
                    })
                : res.json({ message: 'User and thoughts deleted' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },


    // friends

    addFriend(req, res) {
        console.log('Adding a friend');
        console.log(req.body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
            !user
                ? res
                    .status(404)
                    .json({ message: 'No user found with that ID' })
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { friendId: req.params.friendId } } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                ? res.status(404).json({ message: 'No user found with that ID' })
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
}