(function () {
  'use strict';

  var UsersServiceSeq = require('./user.service.seq');
  var passport = require('passport');
  var config = require('../../config/environment');
  //var jwt = require('jsonwebtoken');

  /**
   * Get list of users
   * restriction: 'admin'
   */
  exports.index = function(req, res) {
    UsersServiceSeq.getAll(req.query)
      .then(function(users) {
        return res.status(200).json(users);
      }, function(err) {
        return handleError(res, err);
      });
  };

  /**
   * Creates a new user
   */
  exports.create = function (req, res, next) {
    UsersServiceSeq.create(req.body)
      .then(function(user) {
        //var token = jwt.sign({id: user.id }, config.secrets.session, { expiresInMinutes: 60*5 });
        //res.json({ token: token });
        res.status(200).send(user);
      }, function (err) {
        if (err.code === 400) return res.status(400).send('Bad Request');
        if (err.code === 409) return res.status(409).send('Already Exists');
        return handleError(res, err);
      });
  };

  /**
   * Get a single user
   */
  exports.show = function (req, res, next) {
    UsersServiceSeq.getProfile(req.params.id)
    //UsersServiceSeq.getById(req.params.id)
      .then(function(user) {
        if (!user) return res.status(404).send('Not Found');
        //if (!user) return res.status(401).send('Unauthorized');
        res.json(user.getProfile());
      }, function(err) {
        return handleError(res, err);
        //return next(err);
      });
  };

  // @TODO create editUser function
  // @TODO create editMe function

  /**
   * Deletes a user
   * restriction: 'admin'
   */
  exports.destroy = function(req, res) {
    UsersServiceSeq.delete(req.params.id)
      .then(function(success) {
        return res.status(204).send('Removed');
      }, function(err) {
        if (err.code === 404) { return res.status(404).send('Not Found'); }
        return handleError(err);
      });
  };

  /**
   * Change a users password
   */
  exports.changePassword = function(req, res, next) {
    var userId = req.user.id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    UsersServiceSeq.changePassword(userId, oldPass, newPass)
      .then(function(success) {
        return res.status(200).send('OK');
      }, function(err) {
        if (err.code === 404) return res.status(404).send('Not Found');
        if (err.code === 403) return res.status(403).send('Forbidden');
        return handleError(res, err);
      });
  };

  /**
   * Get my info
   */
  exports.me = function(req, res, next) {
    UsersServiceSeq.getMe(req.user.id)
      .then(function(user) {
        if (!user) return res.status(401).send('Unauthorized');
        res.json(user);
      }, function(err) {
        return handleError(res, err);
        //return next(err);
      });
  };

  /**
   * Authentication callback
   */
  exports.authCallback = function(req, res, next) {
    res.redirect('/');
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