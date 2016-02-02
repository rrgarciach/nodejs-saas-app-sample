(function () {
  'use strict';

  var Sequelize = require('sequelize');

  module.exports = function(sequelize) {
    var Order = sequelize.define('Order', {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
        validate: {
          isDate: {msg:'Bad date format'}
        },
        set: function (date) {
          if (date.length !== 10 || date.indexOf('-') !== 4 || date.indexOf('-', 5) !== 7) {
            var now = new Date();
            this.setDataValue('date', now);
          } else {
            this.setDataValue('date', date);
          }
        }
      },
      notes: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OrderStatus',
          key: 'id'
        }
      },
      invoiced: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        validate: {
          min: {args:[0], msg:'Bad invoice status'},
          max: {args:[1], msg:'Bad invoice status'}
        }
      },
      client: {
        type: Sequelize.INTEGER,
        //references: {
        //  model: 'Client',
        //  key: 'id'
        //},
        validate: {
          isInt: {msg:'Bad client id'}
        },
        allowNull: false
      },
      PromoterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Promoters',
          key: 'id'
        },
        validate: {
          isInt: {msg:'Bad promoter id'}
        }
      },
      address: {
        type: Sequelize.INTEGER,
        //references: {
        //  model: 'Address',
        //  key: 'id'
        //},
        validate: {
          isNumeric: {msg:'Bad address id'}
        },
        allowNull: false
      }
    }, {
      timestamps: true,
      paranoid: true,
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          //Order.hasOne(models.Client, {as: 'Client', foreignKey: 'id'});
          Order.hasOne(models.Promoter, {as: 'Promoter', foreignKey: 'id'});
          Order.hasOne(models.OrderStatus, {as: 'OrderStatus', foreignKey: 'id'});
          //Order.hasOne(models.Address, {foreignKey: 'idAddress'});
          Order.hasMany(models.OrderDetail, {as: 'Products', foreignKey: 'id'});
        }
      }
    });

    return Order;
  }

})();