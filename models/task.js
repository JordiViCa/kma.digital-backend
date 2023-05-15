'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var TaskSchema = Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    difficulty: {type: String},
    deleted: {type: Boolean, default: false},
    date: {type: Date, required: true},
    created: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Project"},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    tracking: [{type: mongoose.Schema.Types.ObjectId, ref: "Tracking"}],
});

TaskSchema.plugin(uniqueValidator)

TaskSchema.set('toJSON', {
    transform: (document, returnedOBJ) => {
        delete returnedOBJ.__v;
    }
})

module.exports = mongoose.model('Task', TaskSchema)