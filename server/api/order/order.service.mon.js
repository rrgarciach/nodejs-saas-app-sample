(function () {
  'use strict';

  var _ = require('lodash');
  var Order = require('../../schemas/order.schema');
  var q = require('q');

  /**
   * Get all Orders
   *
   * @returns {deferred.promise|{then, always}}
   */
  function getAllOrders() {
    var deferred = q.defer();
    Order.find(function (err, orders) {
      if(err) { return deferred.reject(err); }
      deferred.resolve(orders);
    });
    return deferred.promise;
  }

  /**
   * Get single Order by ID
   *
   * @param orderId
   * @returns {deferred.promise|{then, always}}
   */
  function getOrderById(orderId) {
    var deferred = q.defer();
    Order.findById(orderId, function (err, order) {
      if(err) { return deferred.reject(err); }
      deferred.resolve(order);
    });
    return deferred.promise;
  }

  /**
   * Get single Order by Folio
   *
   * @param orderId
   * @returns {deferred.promise|{then, always}}
   */
  function getOrderByFolio(orderFolio) {
    var deferred = q.defer();
    Order.findOne(orderFolio, function (err, order) {
      if(err) { return deferred.reject(err); }
      deferred.resolve(order);
    });
    return deferred.promise;
  }

  /**
   * Get list of Orders by Client ID
   *
   * @param clientId
   * @returns {deferred.promise|{then, always}}
   */
  function getOrdersByClientId(clientId) {
    var deferred = q.defer();
    Order.findOne(clientId, function (err, orders) {
      if(err) { return deferred.reject(err); }
      deferred.resolve(orders);
    });
    return deferred.promise;
  }

  /**
   * Create an Order
   *
   * @param newOrder
   * @returns {deferred.promise|{then, always}}
   */
  function createOrder(newOrder) {
    var deferred = q.defer();
    if (newOrder.folio) { delete newOrder.folio; }
    _getNewFolio().then(function (newFolio) {
      newOrder.folio = newFolio;
      Order.create(newOrder, function(err, order) {
        if(err && err.name === 'ValidationError') { return deferred.reject( _validationErrors(err) ); }
        if(err) { return deferred.reject(err); }
        deferred.resolve(order);
      });
    });

    return deferred.promise;
  }

  /**
   * Update an Order by ID
   *
   * @param orderId
   * @param newData
   * @returns {deferred.promise|{then, always}}
   */
  function editOrder(orderId, newData) {
    var deferred = q.defer();
    if(newData._id) { delete newData._id; }
    getOrderById(orderId)
      .then(function (order) {
        if (!order) { return deferred.reject(404); }
        var updated = _.merge(order, newData);
        updated.save(function (err, editedOrder) {
          if (err) { return deferred.reject(err); }
          deferred.resolve(editedOrder);
        });
      },
      function (err) {
        if (err) { return deferred.reject(err); };
      });
      return deferred.promise;
  }

  /**
   * Delete and Order by ID
   *
   * @param orderId
   * @returns {deferred.promise|{then, always}}
   */
  function deleteOrder(orderId) {
    var deferred = q.defer();
    getOrderById(orderId)
      .then(function (order) {
        if (!order) { return deferred.reject(404); }
        order.remove(function (err) {
          if (err) { return deferred.reject(err); }
          deferred.resolve();
        });
      },
      function (err) {
        if (err) { deferred.reject(err); }
      });
    return deferred.promise;
  }

  /**
   * Private method to parse validation error messages from MongoDB
   *
   * @param err
   * @returns {Array}
   * @private
   */
  function _validationErrors(err) {
    var errorsMessages = [];
    _(err.errors).forEach(function (n) {
      errorsMessages.push(n.message);
    });
    return errorsMessages;
  }

  /**
   * Gets the new/next Order's folio number
   *
   * @returns {deferred.promise|{then, always}}
   * @private
   */
  function _getNewFolio() {
    var deferred = q.defer();
    Order.findOne('folio').sort({folio: -1})
      .then(function (lastOrder) {
        if(!lastOrder) { return deferred.resolve(1); }
        deferred.resolve(++lastOrder.folio);
      });
    return deferred.promise;
  }

  exports.getAllOrders = getAllOrders;
  exports.getOrderById = getOrderById;
  exports.getOrderByFolio = getOrderByFolio;
  exports.getOrdersByClientId = getOrdersByClientId;
  exports.createOrder = createOrder;
  exports.editOrder = editOrder;
  exports.deleteOrder = deleteOrder;

})();