'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var MessageSchema = Schema({
    text: {type: String, required: true},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    sentDate: {type: Date, required: true},
    seenDate: {type: Date},
});

MessageSchema.plugin(uniqueValidator)

MessageSchema.set('toJSON', {
    transform: (document, returnedOBJ) => {
        delete returnedOBJ.__v;
    }
})

module.exports = mongoose.model('Message', MessageSchema)