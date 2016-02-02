'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductRowSchema = new Schema({
  sku: {type: String, required: true},
  quantity: {type: Number, default: 1},
  price: {type: Number, required: true},
  discountPercentage: {type: Number, default: 0},
  promo: {type: Schema.ObjectId, ref: 'PromoSchema'},
  iva: {type: String, default: 0},
  subtotal: {type: String, default: 0}
});

var OrderSchema = new Schema({
  folio: {type: Number, required: true, unique: true},
  date: {type: Date, default: Date.now},
  client: {type: Schema.ObjectId, ref: 'ClientSchema', required: true},
  promoter: {type: Schema.ObjectId, ref: 'PromoterSchema'},
  products: [{type: Schema.ObjectId, ref: 'ProductRowSchema', required: true}],
  address: {type: Schema.ObjectId, ref: 'AddressSchema', required: true},
  notes: {type: String, default: ''},
  status: {type: Number, default: 0},
  totals: {type: Number, default: 0}
});

module.exports = mongoose.model('Order', OrderSchema);