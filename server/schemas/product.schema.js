(function () {
  'use strict';

  var mongoose = require('mongoose'),
      Schema = mongoose.Schema;

  var VendorSchema = new Schema({
    id: Number,
    name: String
  });

  var ProductSchema = new Schema({
    sku: String,
    name: String,
    description: String,
    price: Number,
    hasIVA: Boolean,
    ean: String,
    unit: String,
    idVendor: {type: Schema.ObjectId, ref: 'VendorSchema'},
    active: Boolean
  });

  module.exports = mongoose.model('Product', ProductSchema);
})();