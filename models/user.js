'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var UserSchema = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    client: {type: mongoose.Schema.Types.ObjectId, ref: "Client"},
    type: {type: Number},
    employee: {type: mongoose.Schema.Types.ObjectId, ref: "Employee"}
});

UserSchema.plugin(uniqueValidator)

UserSchema.set('toJSON', {
    transform: (document, returnedOBJ) => {
        delete returnedOBJ.password;
        delete returnedOBJ.__v;
    }
})

module.exports = mongoose.model('User', UserSchema)