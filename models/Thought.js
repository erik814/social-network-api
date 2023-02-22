const mongoose = require('mongoose');


const reactionSchema = new mongoose.Schema(
    {
        reactionId: {
            type: mongoose.Schema.Types.ObjectId,
            default: function () {
                return new ObjectId()
            }
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function () {
                return this.toUTCString
            }
        }
    }
)

const thoughtSchema = new mongoose.Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function () {
                return this.toUTCString
            }
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    }
);

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought