'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var ContactSchema = Schema({
    title: {type: String, required: true},
    email: {type: String, required: true},
    name: {type: String, required: true},
    message: {type: String, required: true},
    created: {type: Date, required: true},
    seen: {type: Boolean, required: true, default: false}
});

ContactSchema.plugin(uniqueValidator)

ContactSchema.set('toJSON', {
    transform: (document, returnedOBJ) => {
        delete returnedOBJ.__v;
    }
})

module.exports = mongoose.model('Contact', ContactSchema)