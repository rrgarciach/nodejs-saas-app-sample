'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

var PromoterSchema = new Schema({
  id: String,
  user: ObjectId,
  address: ObjectId,
  active: Boolean
});

module.exports = mongoose.model('Promoter', PromoterSchema);