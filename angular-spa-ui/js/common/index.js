"use strict";

module.exports = function (app) {

    // Page preload actions realized in mainCtrl
    var bootstrap = require('./bootstrap');
    var promisesSrv = require('./promises-srv');
    var getTemplateSrv = require('./getTemplate-srv');
    var configServiceSrv = require('./configService-srv');
    var appStorageSrv = require('./appStorage-srv');
    var commonServiceSrv = require('./commonService-srv');


    require('./recordsListDir')(app);
    require('./recordsEditDir')(app);

    var appLocalStorage = require('./localStorage-srv');

    app
        .service('appLocalStorage', appLocalStorage)
        .service('promises', promisesSrv)
        .service('getTemplate', getTemplateSrv)
        .service('configService', configServiceSrv)
        .service('appStorage', appStorageSrv)
        .service('commonService', commonServiceSrv)
        .service('bootstrap', bootstrap)
        .constant('appConfig', require('./app-config'));

};
