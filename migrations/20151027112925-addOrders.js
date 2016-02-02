(function () {
  'use strict';

  module.exports = {
    up: function (queryInterface, Sequelize) {
      console.log('Creating OrderDetails table...');
      return queryInterface.createTable('OrderDetails',
        {
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
      )
        .then(function () {
          console.log('Creating OrderStatuses table...');
          return queryInterface.createTable('OrderStatuses',
            {
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
          )
        })
        .then(function () {
          console.log('Creating Orders table...');
          return queryInterface.createTable('Orders',
            {
              id: {
                type: Sequelize.INTEGER,
                unique: true,
                primaryKey: true,
                autoIncrement: true
              },
              date: {
                type: Sequelize.DATEONLY,
                defaultValue: Sequelize.NOW
              },
              notes: {
                type: Sequelize.TEXT
              },
              status: {
                type: Sequelize.INTEGER,
                references: {
                  model: 'OrderStatus',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
                defaultValue: 0
              },
              invoiced: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
              },
              client: {
                type: Sequelize.INTEGER,
                //references: {
                //  model: 'Client',
                //  key: 'id'
                //},
                allowNull: false
              },
              PromoterId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                  model: 'Promoters',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
              },
              address: {
                type: Sequelize.INTEGER,
                //references: {
                //  model: 'Address',
                //  key: 'id'
                //},
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
          )
        });
    },

    down: function (queryInterface) {
      console.log('Removing Orders table...');
      return queryInterface.dropTable('OrderStatuses')
        .then(function () {
          console.log('Removing OrderDetails table...');
          return queryInterface.dropTable('OrderDetails');
        })
        .then(function () {
          console.log('Removing OrderStatus table...');
          return queryInterface.dropTable('Orders');
        });

    }
  }
})();