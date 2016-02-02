'use strict';

var express = require('express');
var controller = require('./user.controller');
var router = express.Router();
//var config = require('../../config/environment');
var RBAC = require('../../components/RBAC');

router.get('/', RBAC.canRetrieveAnyUser(), controller.index);
router.get('/:id(\\d+)', RBAC.canRetrieveAnyUser(), controller.show);
router.get('/me', RBAC.canRetrieveMe(), controller.me);
router.post('/', RBAC.canCreateUser(), controller.create);
//router.put('/', RBAC.canEditAnyUser(), controller.update);
//router.put('/me', RBAC.canEditMe(), controller.updateMe);
router.put('/password', RBAC.canChangeMyPassword(), controller.changePassword);
//router.put('/recover', controller.recoverPassword);
router.delete('/:id', RBAC.canDeleteAnyUser(), controller.destroy);

module.exports = router;
