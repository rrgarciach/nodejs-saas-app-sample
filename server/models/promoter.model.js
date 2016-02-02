(function () {
  'use strict';

  var Sequelize = require('sequelize');

  module.exports = function(sequelize) {
    var Promoter = sequelize.define('Promoter', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          primaryKey: true,
          autoIncrement: true,
          //validate: {
          //  isInt: true
          //}
        },
        UserId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            isInt: true
          },
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        AddressId: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isInt: true
          }
        }
      },
      {
        timestamps: true,
        paranoid: true,
        classMethods: {
          associate: function (models) {
            // associations can be defined here
            Promoter.hasOne(models.User, {foreignKey: 'id'});
            //Promoter.belongsTo(models.Order, {foreignKey: 'PromoterId'});
            //Promoter.belongsTo(models.Address, {foreignKey: 'AddressId'});
          }
        }
      });

    return Promoter;
  }

})();