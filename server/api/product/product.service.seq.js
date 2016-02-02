(function () {
  'use strict';

  var models = require('../../models');
  var Product = models.Product;
  var q = require('q');
  var errorResponse = {}; // object to return for error handling in controller

  /**
   * Get all Products
   * @param query
   * @returns {deferred.promise|{then, always}}
   */
  function getAllProducts(query) {
    var deferred = q.defer();
    var where = _getDatesQuery(query); // get where query object
    Product.findAndCountAll({
      where: where,
      limit: query.limit,
      offset: query.offset,
      order: query.order
    })
      .then(function (products) {
        deferred.resolve(products);
      }, function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Get single Product by ID
   * @param productId
   * @returns {deferred.promise|{then, always}}
   */
  function getProductById(productId) {
    var deferred = q.defer();
    Product.findById(productId)
      .then(function (product) {
        deferred.resolve(product);
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
  }

  /**
   * Get single Product by SKU
   * @param productSku
   * @returns {deferred.promise|{then, always}}
   */
  function getProductBySku(productSku) {
    var deferred = q.defer();
    Product.findOne({ where: {sku: productSku} })
      .then(function (product) {
        deferred.resolve(product);
      }, function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Create a Product
   * @param newProductData
   * @returns {deferred.promise|{then, always}}
   */
  function createProduct(newProductData) {
    var deferred = q.defer();
    if (newProductData.id) delete newProductData.id;
    // Search by unique SKU to check if already exists:
    Product.findOne({
      where: {sku: newProductData.sku},
      attributes: ['id', 'deletedAt'],
      paranoid: false
    })
      .then(function (product) {
        // Check if a Product with same SKU was found:
        if (!product) {
          var newProductInstance = Product.build(newProductData);
          newProductInstance.save()
            .then(function (newProduct) {
              deferred.resolve(newProduct);
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
        // In case that Product has been soft deleted; undo deletion and update:
        } else if (product.deletedAt !== null) {
          product.setDataValue('deletedAt', null);
          newProductData.deletedAt = null;
          product.update(newProductData)
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
   * Update a Product by ID
   * @param productId
   * @param newData
   * @returns {deferred.promise|{then, always}}
   */
  function editProduct(productId, newData) {
    var deferred = q.defer();
    if (newData.id) delete newData.id;
    if (newData.sku) delete newData.sku;
    Product.findOne({
      where: {id: productId},
      attributes: ['id']
    })
      .then(function (product) {
        if (!product) {
          errorResponse.message = 'Not Found';
          errorResponse.code = 404;
          deferred.reject(errorResponse);
        } else {
          product.update(newData)
            .then(function (updatedProduct) {
              deferred.resolve(updatedProduct);
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
   * Delete and Product by ID
   * @param productId
   * @returns {deferred.promise|{then, always}}
   */
  function deleteProduct(productId) {
    var deferred = q.defer();
    Product.findOne({
      where: {id: productId},
      attributes: ['id']
    })
      .then(function (product) {
        if (!product) {
          errorResponse.message = 'Not Found';
          errorResponse.code = 404;
          deferred.reject(errorResponse);
        } else {
          product.destroy()
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
      if (query.sku) {
        where.sku = {$like :query.sku + '%'};
      } else if (query.name) {
        where.name = {$like :query.name + '%'};
      } else if (query.brand) {
        where.brand = {$like :query.brand + '%'};
      }
    } else { // if it's an "=" search
      if (query.sku) {
        where.sku = query.sku;
      } else if (query.name) {
        where.name = query.name;
      } else if (query.brand) {
        where.brand = query.brand;
      }
    }

    return where;
  }

  exports.getAll = getAllProducts;
  exports.getById = getProductById;
  exports.getBySku = getProductBySku;
  exports.create = createProduct;
  exports.edit = editProduct;
  exports.delete = deleteProduct;

})();