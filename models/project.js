'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var ProjectSchema = Schema({
    name: {type: String, required: true},
    domain: {type: String, required: true},
    client: {type: mongoose.Schema.Types.ObjectId, ref: "Client"},
    created: {type: Date},
    public: {type: Boolean, default: false},
    image: {type: String}
});

ProjectSchema.plugin(uniqueValidator)

ProjectSchema.set('toJSON', {
    transform: (document, returnedOBJ) => {
        delete returnedOBJ.__v;
    }
})

module.exports = mongoose.model('Project', ProjectSchema)