(function () {
  'use strict';

  var Sequelize = require('sequelize');

  module.exports = function(sequelize) {
    var Role = sequelize.define('Role', {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      }
    }, {
      timestamps: true,
      paranoid: true,
      classMethods: {
      associate: function(models) {
        // associations can be defined here
        //Role.hasOne(models.User, {foreignKey: 'RoleId'});
        //Role.belongsToMany(models.User, {as: 'idRole', through: 'id'});
      }
      }
    });

    return Role;
  }

})();