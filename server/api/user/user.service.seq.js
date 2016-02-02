(function () {
  'use strict';

  var models = require('../../models');
  var User = models.User;
  var Role = models.Role;
  var q = require('q');
  var crypto = require('crypto');
  var errorResponse = {}; // object to return for error handling in controller

  /**
   * Get all Users
   * @param query
   * @returns {deferred.promise|{then, always}}
   */
  function getAllUsers(query) {
    var deferred = q.defer();
    var where = _getDatesQuery(query); // get where query object
    User.findAndCountAll({
      where: where,
      limit: query.limit,
      offset: query.offset,
      order: query.order,
      attributes: ['id', 'firstName', 'lastName', 'email', 'rfc', 'status'],
      include: [{
        model: Role,
        attributes: ['id', 'name'],
        as: 'Role'
      }]
    })
      .then(function (users) {
        deferred.resolve(users);
      }, function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Get single User by ID
   * @param userId
   * @returns {deferred.promise|{then, always}}
   */
  function getUserById(userId) {
    var deferred = q.defer();
    User.findOne({
      where: {id: userId},
      attributes: {
        exclude: ['hashedPassword'] // don't ever give out the password or salt
      },
      include: [{
        model: Role,
        attributes: ['id', 'name'],
        as: 'Role'
      }]
    })
      .then(function (user) {
        deferred.resolve(user);
      }, function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Get single User by email
   * @param userEmail
   * @returns {deferred.promise|{then, always}}
   */
  function getUserByEmail(userEmail) {
    var deferred = q.defer();
    User.findOne({
      where: {email: userEmail},
      attributes: {
        exclude: ['hashedPassword'] // don't ever give out the password or salt
      },
      include: [{
        model: Role,
        attributes: ['id', 'name'],
        as: 'Role'
      }
      ]
    })
      .then(function (user) {
        deferred.resolve(user);
      }, function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Get User's email and password by email
   * (this is exclusively for authentication proposes)
   * @param userEmail
   * @returns {deferred.promise|{then, always}}
   */
  function getUserCredentials(userEmail) {
    var deferred = q.defer();
    User.findOne({
      where: {email: userEmail},
      attributes: ['id', 'email', 'hashedPassword']
    })
      .then(function (user) {
        deferred.resolve(user);
      }, function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Get User's profile by ID
   * @param userId
   * @returns {deferred.promise|{then, always}}
   */
  function getUserProfile(userId) {
    var deferred = q.defer();
    User.findOne({
      where: {id: userId},
      attributes: ['email'],
      include: [{
        model: Role,
        attributes: ['id', 'name'],
        as: 'Role'
      }]
    })
      .then(function(user) {
        deferred.resolve(user);
      }, function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Create a User
   * @param newUserData
   * @returns {deferred.promise|{then, always}}
   */
  function createUser(newUserData) {
    var deferred = q.defer();
    if (newUserData.id) delete newUserData.id;
    newUserData.provider = 'local';
    _getRole('Client User')
      .then(function (roleIdFound) {
        if (!roleIdFound) throw('Role not found.');
        newUserData.RoleId = roleIdFound;
        newUserData.status = false;
        // @TODO Send email notification with password to new User's email
        newUserData.hashedPassword = Math.random().toString(36).substring(7);
        console.log('password generated is: ' + newUserData.hashedPassword);
        //newUserData.hashedPassword = crypto.randomBytes(4).toString('base64');
        //newUserData.salt = crypto.randomBytes(4).toString('base64');
        // Search by unique email to check if already exists:
        // @TODO Refactor uniqueness validation:
        // This is not the desired validation but the one from documentation doesn't seems to work
        User.findOne({
          where: {email: newUserData.email},
          attributes: ['id', 'deletedAt'],
          paranoid: false
        })
          .then(function(user) {
            // Check if a User with same email was found:
            if (!user) { // If new User does not exists yet
              var newUserInstance = User.build(newUserData);
              newUserInstance.save()
                .then(function (createdUser) {
                  delete createdUser.dataValues.hashedPassword; // don't ever give out the password or salt
                  deferred.resolve(createdUser);
                })
                .catch(function (err) {
                  if (err.message.indexOf('Validation error') > -1) { // indexOf because message is sent as a string
                    errorResponse.message = 'Bad Request';
                    errorResponse.code = 400;
                    deferred.reject(errorResponse);
                    throw new Error('Bad Request'); // got to catch this way because validations are not async =(
                  } else {
                    deferred.reject(err);
                  }
                  return deferred.promise;
                });

              // In case that User has been soft deleted; undo deletion and update:
            } else if (user.deletedAt !== null) {
              user.setDataValue('deletedAt', null);
              newUserData.deletedAt = null;
              user.update(newUserData)
                .then(function (user) {
                  delete user.dataValues.hashedPassword; // don't ever give out the password or salt
                  deferred.resolve(user);
                }, function (err) {
                  deferred.reject(err);
                  return deferred.promise;
                });

            } else {
              errorResponse.message = 'Already Exists';
              errorResponse.code = 409;
              deferred.reject(errorResponse);
              return deferred.promise;
            }

          }, function(err) {
            deferred.reject(err);
          });

      });
        return deferred.promise;
  }

  /**
   * Update a User by ID
   * @param userId
   * @param newData
   * @returns {deferred.promise|{then, always}}
   */
  function editUser(userId, newData) {
    var deferred = q.defer();
    if (newData.id) delete newData.id;
    if (newData.email) delete newData.email;
    User.findOne({
      where: {id: userId},
      attributes: ['id']
    })
      .then(function (user) {
        if (!user) {
          errorResponse.message = 'Not Found';
          errorResponse.code = 404;
          deferred.reject(errorResponse);
        } else {
          user.update(newData)
            .then(function (updatedUser) {
              delete user.hashedPassword; // don't ever give out the password or salt
              deferred.resolve(updatedUser);
            }, function (err) {
              // Catch validation Error throws:
              if (err.message.indexOf('Validation error') > -1) { // indexOf because message is sent as a string
                errorResponse.message = err.message;
                errorResponse.code = 400;
                deferred.reject(errorResponse);
                throw new Error('Bad Request'); // got to catch this way because validations are not async =(
              } else {
                deferred.reject(err);
              }
              return deferred.promise;
            });
        }
      }, function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Get current User by ID
   * @param userId
   * @returns {deferred.promise|{then, always}}
   */
  function getMe(userId) {
    var deferred = q.defer();
    User.findOne({
      where: {id: userId},
      attributes: ['id', 'firstName', 'lastName', 'email', 'rfc', 'status'],
      include: [{
        model: Role,
        attributes: ['id', 'name'],
        as: 'Role'
      }
      ]
    })
      .then(function (user) {
        deferred.resolve(user);
      }, function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  // @TODO create editMe function

  /**
   * Delete a User by ID
   * @param userId
   * @returns {deferred.promise|{then, always}}
   */
  function deleteUser(userId) {
    var deferred = q.defer();
    User.findOne({
      where: {id: userId},
      attributes: ['id']
    })
      .then(function (user) {
        if (!user) {
          errorResponse.message = 'Not Found';
          errorResponse.code = 404;
          deferred.reject(errorResponse);
        } else {
          user.destroy()
          .then(function () {
            deferred.resolve(true);
          }, function (err) {
            deferred.reject(err);
            return deferred.promise;
          });
        }
      }, function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Change User's password by ID
   * @param userId
   * @param oldPassword
   * @param newPassword
   * @returns {deferred.promise|{then, always}}
   */
  function changePassword(userId, oldPassword, newPassword) {
    var deferred = q.defer();
    User.findOne({
      where: {id: userId},
      attributes: ['id', 'hashedPassword']
    })
      .then(function(user) {
        if (!user) { // If User is not found
          errorResponse.message = 'Not Found';
          errorResponse.code = 404;
          deferred.reject(errorResponse);

        } else if (user.authenticate(oldPassword)) { // If password matches
          var updatedUser = user;
          updatedUser.id = userId;
          updatedUser.hashedPassword = newPassword;
          updatedUser.save()
            .then(function (user) {
              delete user.hashedPassword; // don't ever give out the password or salt
              deferred.resolve(true);

            }, function (err) {
              deferred.reject(err);
              return deferred.promise;
            });

        } else { // If password does not match
          errorResponse.message = 'Forbidden';
          errorResponse.code = 403;
          deferred.reject(errorResponse);
        }
      }, function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Get Role by name
   * @param roleName
   * @returns {Query|*}
   * @private
   */
  function _getRole(roleName){
    var deferred = q.defer();
    Role.findOne({
      where: {
        name : roleName,
      },
      attributes: ['id']
    })
      .then(function(roleFound) {
        if (!roleFound) {
          deferred.reject(false);
          return deferred.promise;
        }
        deferred.resolve(roleFound.id);
      }, function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Prepares "where" object to be injected in searches
   * @param query
   * @returns {{}}
   * @private
   */
  function _getDatesQuery(query) {
    var where = {}; // "where" query object

    // If the target field has been set (ID is default):
    if (query.like) { // if it's a "like" search
      if (query.firstName) {
        where.firstName = {$like :query.firstName + '%'};
      } else if (query.lastName) {
        where.lastName = {$like :query.lastName + '%'};
      } else if (query.email) {
        where.email = {$like :query.email + '%'};
      }
    } else { // if it's an "=" search
      if (query.firstName) {
        where.firstName = query.firstName;
      } else if (query.lastName) {
        where.lastName = query.lastName;
      } else if (query.email) {
        where.email = query.email;
      }
    }

    return where;
  }

  exports.getAll = getAllUsers;
  exports.getById = getUserById;
  exports.getMe = getMe;
  exports.getByEmail = getUserByEmail;
  exports.getCredentials = getUserCredentials;
  exports.getProfile = getUserProfile;
  exports.create = createUser;
  exports.edit = editUser;
  exports.delete = deleteUser;
  exports.changePassword = changePassword;

})();