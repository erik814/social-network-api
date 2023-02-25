const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
    getThoughts (req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .populate('reactions')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // createThought(req, res) {
    //     Thought.create(req.body)
    //         .then((dbThoughtData) => res.json(dbThoughtData))
    //         .catch((err) => res.status(500).json(err));
    // },

    // createThought(req, res) {
    //     Thought.create(req.body)
    //         .then((thought) =>
    //             !thought
    //                 ? res.status(404).json({message: 'Thought does not exist'})
    //                 : User.findOneAndUpdate(
    //                     { users: req.body.username },
    //                     { $set: {thoughts: req.params.thoughtId}},
    //                     { new: true }
    //                 )
    //         )
    //         .then((user) =>
    //         !user
    //         ? res.status(404).json({
    //             message: 'Thought created, but no user found',
    //             })
    //         : res.json(user)
    //     )
    //     .catch((err) => {
    //         console.log(err);
    //         res.status(500).json(err);
    //     });
    // },

    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) =>
                User.findOneAndUpdate(
                    { users: thought.username },
                    { $set: {thoughts: thought}},
                    { new: true }
                )
            )
            .then((user) =>
            !user
            ? res.status(404).json({
                message: 'Thought created, but no user found',
                })
            : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },


    updateThought(req, res) {
        Thought.findByIdAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({message: 'Thought does not exist'})
                    : res.json(thought)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })
    },

    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                ? res.status(404).json({ message: 'Thought does not exist' })
                : User.findOneAndUpdate(
                    { users: req.params.thoughtId },
                    { $pull: { users: req.params.thoughtId } },
                    { new: true }
                    )
            )
            .then((user) =>
                !user
                ? res.status(404).json({
                    message: 'User deleted, but no thoughts found',
                    })
                : res.json({ message: 'Thought deleted' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // reactions

    addReaction(req, res) {
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true }
        )
            .then((thought) =>
            !thought
                ? res
                    .status(404)
                    .json({ message: 'No thought found with that ID' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                ? res.status(404).json({ message: 'No thought found with that ID :(' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};