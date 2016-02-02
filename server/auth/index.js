'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var UsersServiceSeq = require('../api/user/user.service.seq');

// Passport Configuration
require('./local/passport').setup(UsersServiceSeq, config);
require('./facebook/passport').setup(UsersServiceSeq, config);
require('./google/passport').setup(UsersServiceSeq, config);
require('./twitter/passport').setup(UsersServiceSeq, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/twitter', require('./twitter'));
router.use('/google', require('./google'));

module.exports = router;