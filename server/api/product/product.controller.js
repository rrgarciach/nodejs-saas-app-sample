(function () {
  /**
   * Using Rails-like standard naming convention for endpoints.
   * GET     /things              ->  index
   * POST    /things              ->  create
   * GET     /things/:id          ->  show
   * PUT     /things/:id          ->  update
   * DELETE  /things/:id          ->  destroy
   */

  'use strict';

  var _ = require('lodash');
  var ProductsServiceSeq = require('./product.service.seq');

  // Get list of Products
  exports.index = function(req, res) {
    ProductsServiceSeq.getAll(req.query)
      .then(function(products) {
        return res.status(200).json(products);
      }, function(err) {
        return handleError(res, err);
      });

  };

  // Get a single Product
  exports.show = function(req, res) {
    ProductsServiceSeq.getById(req.params.id)
      .then(function(product) {
        if (!product) return res.status(404).send('Not Found');
        return res.status(200).json(product);
      }, function(err) {
        return handleError(res, err);
      });

  };

  // Find a single Product by SKU
  // @TODO maybe integrate this route in "show"
  exports.findBySku = function(req, res) {
    ProductsServiceSeq.getBySku(req.params.sku)
      .then(function(product) {
        if (!product) return res.status(404).send('Not Found');
        return res.status(200).json(product);
      }, function(err) {
        return handleError(res, err);
      });

  };

  // Create a new Product in the DB
  exports.create = function(req, res) {
    ProductsServiceSeq.create(req.body)
      .then(function(createdProduct) {
        return res.status(200).json(createdProduct);
      }, function(err) {
        if (err.code === 400) return res.status(400).send('Bad Request');
        if (err.code === 404) return res.status(404).send('Not Found');
        if (err.code === 409) return res.status(409).send('Already Exists');
        return handleError(res, err);
      });

  };

  // Update an existing Product in the DB
  exports.update = function (req, res) {
    ProductsServiceSeq.edit(req.params.id, req.body)
      .then(function(updatedProduct) {
        return res.status(200).json(updatedProduct);
      }, function(err) {
        if (err.code === 400) return res.status(400).send('Bad Request');
        if (err.code === 404) return res.status(404).send('Not Found');
        return handleError(res, err);
      });

  };

  // Soft-deletes a product from the DB.
  exports.destroy = function(req, res) {
    ProductsServiceSeq.delete(req.params.id)
      .then(function(success) {
        return res.status(204).send('Removed');
      }, function(err) {
        if (err.code === 404) return res.status(404).send('Not Found');
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