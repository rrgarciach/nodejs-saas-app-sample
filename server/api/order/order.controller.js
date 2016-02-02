(function () {
  'use strict';

  var _ = require('lodash');
  var ordersService = require('./order.service.seq');

  // Get list of Orders
  exports.index = function (req, res) {
    ordersService.getAll(req.query)
      .then(function (orders) {
        return res.status(200).json(orders);
      }, function (err) {
        return handleError(res, err);
      });
  };

  // Get a single Order
  exports.show = function (req, res) {
    ordersService.getById(req.params.id)
      .then(function (order) {
        if (!order) return res.status(404).send('Not Found');
        return res.status(200).json(order);
      }, function (err) {
        return handleError(res, err);
      });
  };

  // Creates a new Order in the DB
  exports.create = function (req, res) {
    ordersService.create(req.body)
      .then(function (createdOrder) {
        return res.status(200).json(createdOrder);
      }, function (err) {
        if (err.code === 400) return res.status(400).send('Bad Request');
        if (err.code === 404) return res.status(404).send('Not Found');
        if (err.code === 409) return res.status(409).send('Already Exists');
        return handleError(res, err);
      });
  };

  // Updates an existing Order in the DB
  exports.update = function(req, res) {
    ordersService.edit(req.params.id, req.body)
      .then(function (updatedOrder) {
        return res.status(200).json(updatedOrder);
      }, function (err) {
        if (err.code === 400) return res.status(400).send('Bad Request');
        if (err.code === 404) return res.status(404).send('Not Found');
        return handleError(res, err);
      });
  };

  // Deletes an Order from the DB
  exports.destroy = function(req, res) {
    ordersService.delete(req.params.id)
      .then(function () {
        return res.status(204).send('Removed');
      }, function (err) {
        if (err.code === 404) { return res.status(404).send('Not Found'); }
        return handleError(res, err);
      });
  };

  // Handles error responses
  function handleError(res, err) {
    console.log(err);
    var errorResponse = {
      err: err,
      message: 'Internal Error'
    };
    return res.status(500).send(errorResponse);
  }
})();