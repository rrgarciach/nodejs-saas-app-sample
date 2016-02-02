(function () {
  'use strict';

  var express = require('express');
  var controller = require('./product.controller');
  var router = express.Router();
  //var auth = require('../../auth/auth.service');
  var RBAC = require('../../components/RBAC');
  var multer  = require('multer');
  var path = require('path');
  var upload = multer({ dest: path.join( __dirname, '../../uploads/') });


  router.get('/', RBAC.canRetrieveAnyProduct(), controller.index);
  router.get('/:id', RBAC.canRetrieveAnyProduct(), controller.show);
  router.get('/sku/:sku', RBAC.canRetrieveAnyProduct(), controller.findBySku);
  router.post('/', RBAC.canCreateProduct(), controller.create);
  router.put('/:id', RBAC.canEditAnyProduct(), controller.update);
  router.delete('/:id', RBAC.canDeleteAnyProduct(), controller.destroy);
  //router.get('/download', RBAC.canDownloadAllProducts(), controller.download);
  //router.post('/upload', RBAC.canUploadAllProducts(), upload.single('csv'), controller.upload);

  module.exports = router;
})();