(function () {
  'use strict';

  var PromotersServiceSeq = require('./promoter.service.seq');

  // Get list of Promoters
  exports.index = function(req, res) {
    PromotersServiceSeq.getAll(req.query)
      .then(function(products) {
        return res.status(200).json(products);
      }, function(err) {
        return handleError(res, err);
      });
    //Promoter.find(function (err, promoters) {
    //  if(err) { return handleError(res, err); }
    //  return res.status(200).json(promoters);
    //});
  };

  // Get a single Promoter
  exports.show = function(req, res) {
    PromotersServiceSeq.getById(req.params.id)
      .then(function(product) {
        if (!product) return res.status(404).send('Not Found');
        return res.status(200).json(product);
      }, function(err) {
        return handleError(res, err);
      });
    //Promoter.findById(req.params.id, function (err, promoter) {
    //  if(err) { return handleError(res, err); }
    //  if(!promoter) { return res.status(404).send('Not Found'); }
    //  return res.json(promoter);
    //});
  };

  // Creates a new Promoter in the DB.
  exports.create = function(req, res) {
    PromotersServiceSeq.create(req.body)
      .then(function(createdProduct) {
        return res.status(200).json(createdProduct);
      }, function(err) {
        if (err.code === 400) return res.status(400).send('Bad Request');
        if (err.code === 404) return res.status(404).send('Not Found');
        if (err.code === 409) return res.status(409).send('Already Exists');
        return handleError(res, err);
      });
    //Promoter.create(req.body, function(err, promoter) {
    //  if(err) { return handleError(res, err); }
    //  return res.status(201).json(promoter);
    //});
  };

  // Updates an existing Promoter in the DB.
  exports.update = function(req, res) {
    PromotersServiceSeq.edit(req.params.id, req.body)
      .then(function(updatedProduct) {
        return res.status(200).json(updatedProduct);
      }, function(err) {
        if (err.code === 400) return res.status(400).send('Bad Request');
        if (err.code === 404) return res.status(404).send('Not Found');
        return handleError(res, err);
      });
    //if(req.body._id) { delete req.body._id; }
    //Promoter.findById(req.params.id, function (err, promoter) {
    //  if (err) { return handleError(res, err); }
    //  if(!promoter) { return res.status(404).send('Not Found'); }
    //  var updated = _.merge(promoter, req.body);
    //  updated.save(function (err) {
    //    if (err) { return handleError(res, err); }
    //    return res.status(200).json(promoter);
    //  });
    //});
  };

  // Deletes a Promoter from the DB.
  exports.destroy = function(req, res) {
    PromotersServiceSeq.delete(req.params.id)
      .then(function(success) {
        return res.status(204).send('Removed');
      }, function(err) {
        if (err.code === 404) return res.status(404).send('Not Found');
        return handleError(res, err);
      });
    //Promoter.findById(req.params.id, function (err, promoter) {
    //  if(err) { return handleError(res, err); }
    //  if(!promoter) { return res.status(404).send('Not Found'); }
    //  promoter.remove(function(err) {
    //    if(err) { return handleError(res, err); }
    //    return res.status(204).send('No Content');
    //  });
    //});
  };

  function handleError(res, err) {
    return res.status(500).send(err);
  }
})();