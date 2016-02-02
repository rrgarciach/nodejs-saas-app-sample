(function () {
  'use strict';

  var Sequelize = require('sequelize');

  module.exports = function(sequelize) {
    var Product = sequelize.define('Product', {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          isInt: true
        }
      },
      sku: {
        type: Sequelize.STRING(8),
        //unique: true,
        allowNull: false,
        //validate: {
        //  isUnique: function(value, next) { // this validation only runs when creating
        //    Product.findOne({
        //      where: {sku: value},
        //      paranoid: false,
        //      attributes: ['id']
        //    })
        //      .then(function(product) {
        //        // We found a Product with this SKU
        //
        //        // If it was soft deleted, then undo deletion:
        //        if (product.deletedAt !== null) return next(product);
        //
        //        // Otherwise pass the error to the next method.
        //        if (product.deletedAt === null) return next('409 Already Exists');
        //
        //        // If we got this far, the Product SKU hasn't been used yet.
        //        // Call next with no arguments when validation is successful.
        //        next();
        //      })
        //      .catch(function (err) {
        //        // Some unexpected error occurred with the find method.
        //        if (err) return next(err);
        //      });
        //
        //  }
        //}
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.FLOAT.UNSIGNED,
        allowNull: false,
        validate: {
          isFloat: true
        }
      },
      hasIVA: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        validate: {
          min: 0,
          max: 1
        }
      },
      ean: {
        type: Sequelize.BIGINT.UNSIGNED,
        validate: {
          isNumeric: true
        }
      },
      unit: {
        type: Sequelize.STRING(16),
        defaultValue: 'unit'
      },
      brand: {
        type: Sequelize.STRING(16)
      },
      vendor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: true
        }
      }
    }, {
      timestamps: true,
      paranoid: true
    });

    return Product;
  }

})();