(function () {
  'use strict';

  module.exports = {
    up: function (queryInterface, Sequelize) {
      console.log('Creating Promoters table...');
      return queryInterface.createTable('Promoters',
        {
          id: {
            type: Sequelize.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
            validate: {
              isInt: true
            }
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
        //.then(function () {
        //  return queryInterface.changeColumn('Orders', 'promoter', {
        //    type: Sequelize.INTEGER,
        //    references: {
        //      model: 'Promoters',
        //      key: 'id',
        //      referenceKey: 'id'
        //    },
        //    onUpdate: 'CASCADE',
        //    onDelete: 'SET NULL'
        //  })
        //    .then(function () {
        //      return queryInterface.renameColumn('Orders', 'promoter', 'PromoterId');
        //    });
        //});
    },

    down: function (queryInterface) {
      console.log('Removing Promoters table...');
      return queryInterface.dropTable('Promoters');

    }
  }
})();