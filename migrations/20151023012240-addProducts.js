(function () {
  'use strict';

  module.exports = {
    up: function (queryInterface, Sequelize) {
      console.log('Creating Products table...');
      return queryInterface.createTable('Products',
        {
          id: {
            type: Sequelize.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true
          },
          sku: {
            type: Sequelize.STRING(8),
            unique: true,
            allowNull: false
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
            allowNull: false
          },
          hasIVA: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          ean: {
            type: Sequelize.BIGINT.UNSIGNED
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
            allowNull: false
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
      console.log('Removing Products table...');
      return queryInterface.dropTable('Products');

    }
  }
})();