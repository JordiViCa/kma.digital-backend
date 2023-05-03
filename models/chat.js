'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var ChatSchema = Schema({
    titol: {type: String, required: true},
    horaSolicitud: {type: Date, required: true},
    resolt: {type: Boolean, required: true, default: false},
    client: {type: mongoose.Schema.Types.ObjectId, ref: "Client"},
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Project"},
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
});

ChatSchema.plugin(uniqueValidator)

ChatSchema.set('toJSON', {
    transform: (document, returnedOBJ) => {
        delete returnedOBJ.__v;
    }
})

module.exports = mongoose.model('Chat', ChatSchema)