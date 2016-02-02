(function() {
  'use strict';

  var should = require('should');
  var app = require('../../app');
  var request = require('supertest');

  describe('GET /api/products', function() {
    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/products')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err,res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('GET /api/products', function() {
    it('shoudl retrieve a single product with SKU = 22606', function(done) {
      request(app)
        .get('/api/products/', '22606')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err,res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });

})();