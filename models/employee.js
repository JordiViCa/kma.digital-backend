'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var EmployeeSchema = Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    nif: {type: String, required: true}
});

EmployeeSchema.plugin(uniqueValidator)

EmployeeSchema.set('toJSON', {
    transform: (document, returnedOBJ) => {
        delete returnedOBJ.__v;
    }
})

module.exports = mongoose.model('Employee', EmployeeSchema)