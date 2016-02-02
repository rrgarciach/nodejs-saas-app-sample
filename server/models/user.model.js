(function () {
  'use strict';

  var Sequelize = require('sequelize');
  var crypto = require('crypto');
  var authTypes = ['github', 'twitter', 'facebook', 'google'];

  module.exports = function (sequelize) {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    var authenticate = function(plainText) {
      return this.encryptPassword(plainText) === this.hashedPassword;
    };
    ///**
    // * Make salt
    // *
    // * @return {String}
    // * @api public
    // */
    //var makeSalt = function() {
    //  return crypto.randomBytes(16).toString('base64');
    //};
    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    var encryptPassword = function(password) {
      //if (!password || !this.salt) return '';
      //var salt = new Buffer(this.salt, 'base64');
      //var salt = makeSalt();
      //return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
      return crypto.createHash('sha256').update(password).digest('hex');
    };
    var getProfile = function () {
      var profile = {
        name: this.email,
        Role: this.Role
      };
      return profile;
    };
    var User = sequelize.define('User', {
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
          isEmail: {msg: 'email format is invalid'}
        }
      },
      rfc: {
        type: Sequelize.STRING(16),
        defaultValue: 'XAXX010101000',
        validate: {
          isAlphanumeric: true
        }
      },
      RoleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      hashedPassword: {
        type: Sequelize.STRING,
        allowNull: false,
        set: function(password){
          this.setDataValue('hashedPassword', encryptPassword(password, this.salt));
        }
      },
      //salt: {
      //  type: Sequelize.STRING,
      //  allowNull: false,
      //  set: function(password){
      //    this.setDataValue('salt', makeSalt());
      //  }
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
      }
    }, {
      timestamps: true,
      paranoid: true,
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          // this works:
          //User.belongsTo(models.Role, {as: 'Role', foreignKey: 'RoleId'});
          // and it's the same as:
          User.hasOne(models.Role, {as: 'Role', foreignKey: 'id'});
        },
        authenticate: authenticate,
        //makeSalt: makeSalt,
        encryptPassword: encryptPassword,
        getProfile: getProfile
      },
      instanceMethods: {
        authenticate: authenticate,
        //makeSalt: makeSalt,
        encryptPassword: encryptPassword,
        getProfile: getProfile
      }
    });

    return User;
  }

})();