(function () {
  'use strict';

  var Sequelize = require('sequelize');

  module.exports = function(sequelize) {
    var OrderDetail = sequelize.define('OrderDetail', {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sku: {
        type: Sequelize.STRING(8),
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT.UNSIGNED,
        allowNull: false
      },
      discountPercentage: {
        type: Sequelize.FLOAT.UNSIGNED,
        defaultValue: 0
      },
      PromoId: {
        type: Sequelize.INTEGER
      },
      OrderDetailStatusId: {
        type: Sequelize.INTEGER
      }
    }, {
      timestamps: true,
      paranoid: true,
      associate: function(models) {
        // associations can be defined here
        //OrderDetail.hasOne(models.Product, {as: 'Product', foreignKey: 'sku'});
        //OrderDetail.hasOne(models.Order, {foreignKey: 'OrderId'});
      }
    });

    return OrderDetail;
  }

})();