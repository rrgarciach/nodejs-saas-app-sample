'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

var ClientSchema = new Schema({
  id: Number,
  user: ObjectId,
  mainAddress: ObjectId,
  addresses: [ObjectId],
  billingAddress: ObjectId,
  active: Boolean
});

module.exports = mongoose.model('Client', ClientSchema);