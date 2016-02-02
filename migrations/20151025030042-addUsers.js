(function () {
  'use strict';

  module.exports = {
    up: function (queryInterface, Sequelize) {
      console.log('Creating Users table...');
      return queryInterface.createTable('Users',
        {
          id: {
            type: Sequelize.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true
          },
          firstName: {
            type: Sequelize.STRING(64),
            allowNull: false
          },
          lastName: {
            type: Sequelize.STRING(64),
            allowNull: false
          },
          email: {
            type: Sequelize.STRING(32),
            unique: true,
            validate: {
              isEmail: true
            }
          },
          rfc: {
            type: Sequelize.STRING(16),
            defaultValue: "XAXX010101000",
            validate: {
              isAlphanumeric: true
            }
          },
          RoleId: {
            type: Sequelize.INTEGER,
            //allowNull: false,
            references: {
              model: 'Roles',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
          },
          status: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          hashedPassword: {
            type: Sequelize.STRING,
            allowNull: false
          },
          //salt: {
          //  type: Sequelize.STRING,
          //  allowNull: false
          //},
          provider: {
            type: Sequelize.STRING
          },
          facebook: {
            type: Sequelize.STRING
          },
          twitter: {
            type: Sequelize.STRING
          },
          google: {
            type: Sequelize.STRING
          },
          github: {
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
      console.log('Removing Users table...');
      return queryInterface.dropTable('Users');

    }
  }
})();