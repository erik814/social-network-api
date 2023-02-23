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
                    { users: req.params.studentId },
                    { $pull: { users: req.params.userId } },
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
    
}