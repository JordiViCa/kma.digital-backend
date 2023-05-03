'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var ClientSchema = Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    company: {type: String, required: true},
    phone: {type: String, required: true},
    cif: {type: String, required: true},
    interests: {type: String, required: true},
    description: {type: String, required: true},
    projects: [{type: mongoose.Schema.Types.ObjectId, ref: "Project"}],
});

ClientSchema.plugin(uniqueValidator)

ClientSchema.set('toJSON', {
    transform: (document, returnedOBJ) => {
        delete returnedOBJ.__v;
    }
})

module.exports = mongoose.model('Client', ClientSchema)