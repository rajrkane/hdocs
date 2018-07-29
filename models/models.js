/**
 * @file Sets up user and document mongoose models.
 */

'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing')
mongoose.connect(process.env.MONGODB_URI)

var userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    docList: {
        type: Array,
        default: []
    }
});

var documentSchema = new Schema({
    content: {
        type: String
    },
    title: {
        type: String,
        default: 'Untitled'
    },
    owner: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    collaborators: {
        type: [{
            type: ObjectId,
            ref: 'User'
        }],
        default: []
    },
    timeOfCreation: {
        type: Date
    },
},
    {minimize: false}
);

module.exports = {
    User: mongoose.model('User', userSchema),
    Document: mongoose.model('Document', documentSchema)
  };
