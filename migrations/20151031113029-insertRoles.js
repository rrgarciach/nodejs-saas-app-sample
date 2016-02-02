(function () {
  'use strict';

  var q = require('q');
  var roleNames = [
    'Super Admin',
    'Shop Admin',
    'Shop Manager',
    'Operative User',
    'Promoter User',
    'Client User',
    'Guest User'
  ];

  module.exports = {
    up: function (queryInterface) {
      console.log('Inserting roles in table Roles...');
      var insertRolePromise = function (roleName) {
        return queryInterface.sequelize.query(
          'INSERT INTO `Roles` (`id`, `name`) VALUES (NULL, "' + roleName + '")',
          {type: queryInterface.sequelize.QueryTypes.INSERT}
        );
      };

      var getPromises = function () {
        var retPromises = [];
        roleNames.forEach(function (roleName) {
          retPromises.push(insertRolePromise(roleName));
        });
        return retPromises;
      };

      return q.all(getPromises())
        .then(function () {
          console.log('Inserting Admin user as "Super Admin"...');
          return queryInterface.sequelize.query(
            'INSERT INTO `Users` VALUES (NULL, "Admin", "User", "admin@email.com", "XAXX010101000", 1, 1, "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", "local", NULL, NULL, NULL, NULL, NULL, NULL, NULL)',
            {type: queryInterface.sequelize.QueryTypes.INSERT}
          );
        });
    },

    down: function (queryInterface) {
      var insertRolePromise = function (roleName) {
        return queryInterface.sequelize.query(
          'DELETE FROM `Roles` WHERE `name` = "' + roleName + '"',
          {type: queryInterface.sequelize.QueryTypes.DELETE}
        );
      };

      var getPromises = function () {
        var retPromises = [];
        roleNames.forEach(function (roleName) {
          retPromises.push(insertRolePromise(roleName));
        });
        return retPromises;
      };

      console.log('Removing Admin user as "Super Admin"...');
      return queryInterface.sequelize.query(
        'DELETE FROM `Users` WHERE `email` = "admin@email.com"',
        {type: queryInterface.sequelize.QueryTypes.DELETE}
      ).then(function () {
          console.log('Removing Roles table...');
          return q.all(getPromises())
        });
    }
  }
})();