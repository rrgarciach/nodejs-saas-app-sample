(function () {
  'use strict';

  var roles = {
    superAdmin    : 'Super Admin',
    shopAdmin     : 'Shop Admin',
    shopManager   : 'Shop Manager',
    operativeUser : 'Operative User',
    promoterUser  : 'Promoter User',
    clientUser    : 'Client User',
    guestUser     : 'Guest User'
  };
  module.exports = {

    // User Routes Permissions:
    RetrieveAnyUser: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager
    ],
    RetrieveMe: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.operativeUser,
      roles.promoterUser,
      roles.clientUser,
      roles.guestUser
    ],
    CreateUser: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.promoterUser
    ],
    EditAnyUser: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager
    ],
    EditMe: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.operativeUser,
      roles.promoterUser,
      roles.clientUser,
      roles.guestUser
    ],
    ChangeMyPassword: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.operativeUser,
      roles.promoterUser,
      roles.clientUser,
      roles.guestUser
    ],
    DeleteAnyUser: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager
    ],

    // Order Routes Permissions:
    RetrieveAnyOrder: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.operativeUser,
    ],
    RetrieveAnyMyOrder: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.operativeUser,
      roles.promoterUser,
      roles.clientUser
    ],
    CreateOrder: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.operativeUser,
      roles.promoterUser,
      roles.clientUser
    ],
    EditAnyOrder: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.operativeUser,
      roles.promoterUser,
      roles.clientUser
    ],
    EditAnyMyOrder: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.operativeUser,
      roles.promoterUser,
      roles.clientUser
    ],
    CancelAnyOrder: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager
    ],
    CancelAnyMyOrder: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.promoterUser,
      roles.clientUser
    ],
    DeleteAnyOrder: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager
    ],
    DownloadAllOrders: [
      roles.superAdmin,
      roles.shopAdmin
    ],
    UploadAllOrders: [
      roles.superAdmin,
      roles.shopAdmin
    ],

    // Product Routes Permissions:
    RetrieveAnyProduct: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager,
      roles.operativeUser,
      roles.promoterUser,
      roles.clientUser
    ],
    CreateProduct: [
      roles.superAdmin,
      roles.shopAdmin
    ],
    EditAnyProduct: [
      roles.superAdmin,
      roles.shopAdmin
    ],
    DeleteAnyProduct: [
      roles.superAdmin,
      roles.shopAdmin
    ],
    DownloadAllProducts: [
      roles.superAdmin,
      roles.shopAdmin
    ],
    UploadAllProducts: [
      roles.superAdmin,
      roles.shopAdmin
    ],

    // Promoters Routes Permissions:
    RetrieveAnyPromoter: [
      roles.superAdmin,
      roles.shopAdmin,
      roles.shopManager
    ],
    CreatePromoter: [
      roles.superAdmin,
      roles.shopAdmin
    ],
    EditAnyPromoter: [
      roles.superAdmin,
      roles.shopAdmin
    ],
    DeleteAnyPromoter: [
      roles.superAdmin,
      roles.shopAdmin
    ],
    DownloadAllPromoters: [
      roles.superAdmin,
      roles.shopAdmin
    ],
    UploadAllPromoters: [
      roles.superAdmin,
      roles.shopAdmin
    ],

  };

})();