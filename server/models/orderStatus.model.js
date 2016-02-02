(function () {
  'use strict';

  var Sequelize = require('sequelize');

  module.exports = function(sequelize) {
    var OrderStatus = sequelize.define('OrderStatus', {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      timestamps: true,
      paranoid: true,
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          //OrderStatus.hasOne(models.Order, {foreignKey: 'status'});
        }
      }
    });

    return OrderStatus;
  }

})();