(function () {
  'use strict';

  var models = require('../../models');
  var Promoter = models.Promoter;
  var User = models.User;
  var q = require('q');
  var errorResponse = {}; // object to return for error handling in controller

  /**
   * Get all Promoters
   * @param query
   * @returns {deferred.promise|{then, always}}
   */
  function getAllPromoters(query) {
    var deferred = q.defer();
    var where = _getDatesQuery(query); // get where query object
    Promoter.findAndCountAll({
      where: where,
      limit: query.limit,
      offset: query.offset,
      order: query.order,
      include: [{
        model: User,
        attributes: ['email', 'firstName', 'lastName', 'rfc', 'status']
      }]
    })
      .then(function (products) {
        deferred.resolve(products);
      }, function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Get single Promoter by ID
   * @param productId
   * @returns {deferred.promise|{then, always}}
   */
  function getPromoterById(productId) {
    var deferred = q.defer();
    Promoter.findById(productId, {
      include: [{
        model: User,
        attributes: ['email', 'firstName', 'lastName', 'rfc', 'status']
      }]
    })
      .then(function (product) {
        deferred.resolve(product);
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
  }

  /**
   * Create a Promoter
   * @param newPromoterData
   * @returns {deferred.promise|{then, always}}
   */
  function createPromoter(newPromoterData) {
    var deferred = q.defer();
    // Search by unique ID to check if already exists:
    Promoter.findOne({
      where: {UserId: newPromoterData.UserId},
      attributes: ['UserId', 'deletedAt'],
      paranoid: false
    })
      .then(function (promoter) {
        if (newPromoterData.id) delete newPromoterData.id; // Remove ID to avoid modifying it
        // Check if a Promoter with same ID was found:
        if (!promoter) {
          var newPromoterInstance = Promoter.build(newPromoterData);
          newPromoterInstance.save()
            .then(function (newPromoter) {
              deferred.resolve(newPromoter);
            })
            .catch(function (err) {
              //if (err.message.indexOf('409') > -1) { // indexOf because message is sent as a string
              //  errorResponse.message = 'Already Exists';
              //  errorResponse.code = 409;
              //  deferred.reject(errorResponse);
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
        // In case that Promoter has been soft deleted; undo deletion and update:
        } else if (promoter.deletedAt !== null) {
          promoter.setDataValue('deletedAt', null);
          newPromoterData.deletedAt = null;
          promoter.update(newPromoterData)
            .then(function (updatedOrder) {
              deferred.resolve(updatedOrder);
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
      },
      function (err) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

  /**
   * Update a Promoter by ID
   * @param promoterId
   * @param newData
   * @returns {deferred.promise|{then, always}}
   */
  function editPromoter(promoterId, newData) {
    var deferred = q.defer();
    Promoter.findOne({
      where: {id: promoterId},
      attributes: ['id']
    })
      .then(function (promoter) {
        if (newData.UserId) delete newData.UserId; // Remove UserId to avoid modifying it
        if (!promoter) {
          errorResponse.message = 'Not Found';
          errorResponse.code = 404;
          deferred.reject(errorResponse);
        } else {
          promoter.update(newData)
            .then(function (updatedPromoter) {
              deferred.resolve(updatedPromoter);
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
   * Delete and Promoter by ID
   * @param promoterId
   * @returns {deferred.promise|{then, always}}
   */
  function deletePromoter(promoterId) {
    var deferred = q.defer();
    Promoter.findOne({
      where: {id: promoterId},
      attributes: ['id']
    })
      .then(function (promoter) {
        if (!promoter) {
          errorResponse.message = 'Not Found';
          errorResponse.code = 404;
          deferred.reject(errorResponse);
        } else {
          promoter.destroy()
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
   * Prepares "where" object to be injected in searches
   * @param query
   * @returns {{}}
   * @private
   */
  function _getDatesQuery(query) {
    var where = {}; // "where" query object

    // If the target field has been set (ID is default):
    if (query.like) { // if it's a "like" search
      if (query.id) {
        where.id = {$like :query.id + '%'};
      } else if (query.name) {
        where.name = {$like :query.name + '%'};
      } else if (query.brand) {
        where.brand = {$like :query.brand + '%'};
      }
    } else { // if it's an "=" search
      if (query.id) {
        where.id = query.id;
      } else if (query.name) {
        where.name = query.name;
      } else if (query.brand) {
        where.brand = query.brand;
      }
    }

    return where;
  }

  exports.getAll = getAllPromoters;
  exports.getById = getPromoterById;
  exports.create = createPromoter;
  exports.edit = editPromoter;
  exports.delete = deletePromoter;

})();