(function () {
  'use strict';

  module.exports = {
    up: function (queryInterface, Sequelize) {
      console.log('Creating Roles table...');
      return queryInterface.createTable('Roles',
        {
          id: {
            type: Sequelize.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: Sequelize.STRING
          },
          // These fields has to be added always in migrations
          // when paranoid and timestamps are required:
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          },
          deletedAt: {
            type: Sequelize.DATE
          }
        }, {
          timestamps: true,
          paranoid: true,
          charset: 'utf8' // default: null
        }
      );
    },

    down: function (queryInterface) {
      console.log('Removing Roles table...');
      return queryInterface.dropTable('Roles');

    }
  }
})();