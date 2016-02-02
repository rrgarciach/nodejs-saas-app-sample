(function () {
  'use strict';

  var models = require('../../models');
  var Order = models.Order;
  var OrderStatus = models.OrderStatus;
  var Promoter = models.Promoter;
  var User = models.User;
  var OrderDetail = models.OrderDetail;
  var q = require('q');
  var errorResponse = {}; // object to return for error handling in controller

  /**
   * Get all Orders
   * @param query
   * @returns {deferred.promise|{then, always}}
   */
  function getAllOrders(query) {
    var deferred = q.defer();
    var where = _getDatesQuery(query); // get where query object
    Order.findAndCountAll({
      where: where,
      limit: query.limit,
      offset: query.offset,
      order: query.order,
      include: [
        {
          model: OrderStatus,
          attributes: ['id'],
          as: 'OrderStatus'
        },
        //{
        //  model: Client,
        //  attributes: ['id', 'folio'],
        //  as: 'Client',
        //  include: [{
        //    model: User,
        //    attributes: ['firstName', 'lastName']
        //  }]
        //},
        {
          model: Promoter,
          attributes: ['id'],
          as: 'Promoter',
          include: [{
            model: User,
            attributes: ['firstName', 'lastName']
          }]
        },
        //{
        //  model: Address,
        //  attributes: ['id'],
        //  as: 'Address'
        //},
        {
          model: OrderDetail,
          attributes: ['sku', 'quantity'],
          as: 'Products'
        }
      ]
    })
      .then(function (orders) {
        deferred.resolve(orders);
      }, function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Get single Order by ID
   * @param orderId
   * @returns {deferred.promise|{then, always}}
   */
  function getOrderById(orderId) {
    var deferred = q.defer();
    Order.findOne({
      where: {id: orderId},
      include: [
        {
          model: OrderStatus,
          attributes: ['id'],
          as: 'OrderStatus'
        },
        //{
        //  model: Client,
        //  attributes: ['id', 'folio'],
        //  as: 'Client',
        //  include: [{
        //    model: User,
        //    attributes: ['firstName', 'lastName']
        //  }]
        //},
        {
          model: Promoter,
          attributes: ['id'],
          as: 'Promoter',
          include: [{
            model: User,
            attributes: ['firstName', 'lastName']
          }]
        },
        //{
        //  model: Address,
        //  attributes: ['id'],
        //  as: 'Address'
        //},
        {
          model: OrderDetail,
          attributes: ['sku', 'quantity'],
          as: 'Products'
        }
      ]
    })
      .then(function (order) {
        deferred.resolve(order);
      }, function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Create an Order
   * @param newOrderData
   * @returns {deferred.promise|{then, always}}
   */
  // @TODO add throw new Error when validations are added to model (as in ProductsService)
  function createOrder(newOrderData) {
    var deferred = q.defer();
    if (newOrderData.id) delete newOrderData.id;
    // @TODO: search current User as Promoter, validate and insert him in Order
    // (if not Promoter, search Promoter by Client, if not then assign default)
    var newOrderInstance = Order.build(newOrderData);
    newOrderInstance.save()
      .then(function (newOrder) {
        deferred.resolve(newOrder);
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

      return deferred.promise;
  }

  /**
   * Update an Order by ID
   *
   * @param orderId
   * @param newData
   * @returns {deferred.promise|{then, always}}
   */
  // @TODO add throw new Error when validations are added to model (as in ProductsService)
  function editOrder(orderId, newData) {
    var deferred = q.defer();
    if(newData.id) delete newData.id;
    Order.findOne({
      where: {id: orderId},
      attributes: ['id']
    })
      .then(function (order) {
        if (!order) {
          errorResponse.message = 'Not Found';
          errorResponse.code = 404;
          deferred.reject(errorResponse);
        } else {
          order.update(newData)
            .then(function (updatedOrder) {
              deferred.resolve(updatedOrder);
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
        return deferred.reject(err);
      });
      return deferred.promise;
  }

  /**
   * Changes the status of the Order
   * @param orderId
   * @param newStatus
   * @returns {deferred.promise|{then, always}}
   */
  function changeOrderStatus(orderId, newStatus) {
    var deferred = q.defer();
    Order.findOne({
      where: {id: orderId},
      attributes: ['id']
    })
      .then(function (order) {
        if (!order) {
          errorResponse.message = 'Not Found';
          errorResponse.code = 404;
          deferred.reject(errorResponse);
        } else {
          order.setDataValue('status',newStatus);
          order.update({status: newStatus})
            .then(function (updatedOrder) {
              deferred.resolve(updatedOrder);
            }, function (err) {
              deferred.reject(err);
              return deferred.promise;
            });
        }
      }, function (err) {
        return deferred.reject(err);
      });
      return deferred.promise;
  }

  /**
   * Delete and Order by ID
   * @param orderId
   * @returns {deferred.promise|{then, always}}
   */
  function deleteOrder(orderId) {
    var deferred = q.defer();
    Order.findOne({
      where: {id: orderId},
      attributes: ['id']
    })
      .then(function (order) {
        if (!order) {
          errorResponse.message = 'Not Found';
          errorResponse.code = 404;
          deferred.reject(errorResponse);
        } else {
          order.destroy()
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
   * @param query The request query (GET)
   * @returns {{}} The where object to inject to sequelize request method
   * @private
   */
  function _getDatesQuery(query) {
    var where = {}; // "where" query object

    // If the target field has been set (ID is default):
    if (query.like) { // if it's a "like" search
      if (query.client) {
        where.client = {$like :query.client + '%'};
      } else if (query.promoter) {
        where.PromoterId = {$like :query.promoter + '%'};
      }
    } else { // if it's an "=" search
      if (query.client) {
        where.client = query.client;
      } else if (query.promoter) {
        where.PromoterId = query.promoter;
      } else if (query.status) {
        where.status = query.status;
      }
    }

    // If a specific date has been set:
    if (query.date) {
      where.date = query.date;
    } else if (query.from && query.to) {
      where.date = {
        $gte: query.from,
        $lte: query.to
      };
    }

    return where;
  }

  exports.getAll = getAllOrders;
  exports.getById = getOrderById;
  exports.create = createOrder;
  exports.edit = editOrder;
  exports.changeStatus = changeOrderStatus;
  exports.delete = deleteOrder;

})();