(function () {
  'use strict';

  var express = require('express');
  var controller = require('./order.controller');
  var router = express.Router();
//var config = require('../../config/environment');
  var RBAC = require('../../components/RBAC');

  router.get('/', RBAC.canRetrieveAnyOrder(), controller.index);
  router.get('/:id', RBAC.canRetrieveAnyOrder(), controller.show);
  //router.get('/mine', RBAC.canRetrieveAnyMyOrder(), controller.indexMine);
  //router.get('/mine/:id', RBAC.canRetrieveAnyMyOrder(), controller.showMine);
  router.post('/', RBAC.canCreateOrder(), controller.create);
  router.put('/:id', RBAC.canEditAnyOrder(), controller.update);
  //router.put('/mine/:id', RBAC.canEditAnyMyOrder(), controller.updateMine);
  //router.put('/cancel/:id', RBAC.canCancelAnyOrder(), controller.cancel);
  //router.put('/cancel/mine/:id', RBAC.canCancelAnyMyOrder(), controller.cancelMine);
  router.delete('/:id', RBAC.canDeleteAnyOrder(), controller.destroy);
  //router.get('/download', RBAC.canDownloadAllOrders(), controller.download);
  //router.post('/upload', RBAC.canUploadAllOrders(), upload.single('csv'), controller.upload);

  module.exports = router;
})();