'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var CategorySchema = Schema({
    name: {type: String, required: true},
    color: {type: String, required: true},
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Project"},
    order: {type: Number, default: 0}
});

CategorySchema.plugin(uniqueValidator)

CategorySchema.set('toJSON', {
    transform: (document, returnedOBJ) => {
        delete returnedOBJ.__v;
    }
})

module.exports = mongoose.model('Category', CategorySchema)