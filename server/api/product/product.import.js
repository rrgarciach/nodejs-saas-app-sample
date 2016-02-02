(function () {
  'use strict';

  var q = require('q');
  var fs = require('fs');
  var path = require('path');
  var parse = require('csv-parse');
  var transform = require('stream-transform');
  var Product = require( path.join( __dirname, '../../schemas/product.schema') );

  exports.upload = function (filePath) {
    var output = [];
    var parser = parse({
      delimiter: ',',
      columns: ['sku', 'name', 'description', 'price', 'hasIVA', 'ean', 'unit', 'active']
    });
    // @TODO: create a service with the next lines to decouple:
    var input = fs.createReadStream(filePath);
    var transformer = transform(function(record) {
      setImmediate(function() {
        var product = {
          sku: record['sku'],
          name: record['name'],
          description: record['description'],
          price: record['price'],
          hasIVA: record['hasIVA'],
          ean: record['ean'],
          unit: record['unit'],
          active: 1
        };
        output.push(product);
      }, 50);
    }, {parallel: 100});

    var deferred = q.defer();

    input.pipe(parser).pipe(transformer);

    input.on('error', function (err) {
      console.log("Caught", err);
      deferred.reject(err);
    });

    input.on('end',function () {

        Product.find({}).remove(function() {
          Product.create(
            output,
            function() {
              console.log('finished populating Products');
            }
          );
        });

      // Delete uploaded file due that is no necessary anymore
      fs.unlink(filePath, function(err) {
          if (err) { deferred.reject(err); }
          deferred.resolve(true);
        });

      });

      return deferred.promise;

  };

  //exports.download = function () {
  //  var stringify = require('csv-stringify');
  //
  //  var input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];
  //  stringify(input, function(err, output){
  //    //output.should.eql('1,2,3,4\na,b,c,d');
  //    return output;
  //  });
  //};

})();