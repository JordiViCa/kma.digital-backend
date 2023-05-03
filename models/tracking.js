'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var TrackingSchema = Schema({
    employee: {type: mongoose.Schema.Types.ObjectId, ref: "Employee"},
    description: {type: String},
    startTrack: {type: Date, required: true},
    endTrack: {type: Date},
});

TrackingSchema.plugin(uniqueValidator)

TrackingSchema.set('toJSON', {
    transform: (document, returnedOBJ) => {
        delete returnedOBJ.__v;
    }
})

module.exports = mongoose.model('Tracking', TrackingSchema)