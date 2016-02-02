(function () {
  'use strict';

  var express = require('express');
  var controller = require('./promoter.controller');
  var router = express.Router();
  var RBAC = require('../../components/RBAC');

  router.get('/', RBAC.canRetrieveAnyPromoter(), controller.index);
  router.get('/:id', RBAC.canRetrieveAnyPromoter(), controller.show);
  router.post('/', RBAC.canCreatePromoter(), controller.create);
  router.put('/:id', RBAC.canEditAnyPromoter(), controller.update);
  router.delete('/:id', RBAC.canDeleteAnyPromoter(), controller.destroy);

  module.exports = router;
})();