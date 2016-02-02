(function () {
  /**
   * Populate DB with sample data on server start
   * to disable, edit config/environment/index.js, and set `seedDB: false`
   */

  'use strict';

  var Thing = require('../schemas/thing.schema');
  var User = require('../schemas/user.schema');
  var Promoter = require('../schemas/promoter.schema');
  var Client = require('../schemas/client.schema');
  var Product = require('../schemas/product.schema');
  var Order = require('../schemas/order.schema');
  var ProductImporter = require('../api/product/product.import');

  Thing.find({}).remove(function() {
    Thing.create({
      name : 'Development Tools',
      info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
    }, {
      name : 'Server and Client integration',
      info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
    }, {
      name : 'Smart Build System',
      info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
    },  {
      name : 'Modular Structure',
      info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
    },  {
      name : 'Optimized Build',
      info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
    },{
      name : 'Deployment Ready',
      info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
    });
  });

  User.find({}).remove(function() {
    User.create({
        provider: 'local',
        firstName: 'User',
        lastName: 'Test',
        email: 'test@test.com',
        password: 'test'
      }, {
        provider: 'local',
        role: 'admin',
        firstName: 'User',
        lastName: 'Admin',
        email: 'admin@admin.com',
        password: 'admin'
      }, function(err, userTest, userAdmin) {
        console.log('finished populating Users');
        seedClients(userTest);
      }
    );
  });

  Promoter.find({}).remove(function() {
    Promoter.create({
      id: '080',
      user: '561ca6292e5dea192452e255',
      address: '561ca6292e5dea192452e255',
      active: 1,
    }, function() {
        console.log('finished populating Promoters');
      }
    );
  });

  //console.log( User.findOne({'firstName':'User'}).select('firstName') );
  //console.log( Client.findOne({'id':'135'}).select('id') );

  var seedClients = function (userTest) {
    Client.find({}).remove(function() {
      Client.create({
          id: '135',
          user: userTest._id,
          mainAddress: '561ca6292e5dea192452e255',
          addresses: ['561ca6292e5dea192452e255'],
          billingAddress: '561ca6292e5dea192452e255',
          active: 1,
        }, function(err, client) {
          console.log('finished populating Clients');
          seedOrders(client);
        }
      );
    });
  };

  //var products = ProductImporter.import();
  //Product.find({}).remove(function() {
  //  Product.create(
  //    {
  //    sku: '22606',
  //    name: 'Pinza para electricista',
  //    price: 9.99
  //    },{
  //    sku: '22609',
  //    name: 'Pinza para electricista',
  //    price: 16.99
  //    },
  //    function() {
  //      console.log('finished populating Products');
  //    }
  //  );
  //});

  var seedOrders = function (client) {
    Order.find({}).remove(function () {
      Order.create({
          folio: 12345,
          date: '2015-10-13',
          client: client._id,
          promoter: '561ca6292e5dea192452e255',
          products: ['561ca6292e5dea192452e255'],
          address: '561ca6292e5dea192452e255',
          notes: 'Sample note.',
          status: 1,
          totals: 999.99
        }, function (err, order) {
          console.log('finished populating Orders');
          console.log(err);
        }
      );
    });
  };

})();