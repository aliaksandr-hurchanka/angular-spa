"use strict";

// Dependency
var angular = require('angular');
var uiRouter = require('angular-ui-router');
var uiBs = require('angular-ui-bootstrap');

var common = require('../common');
var searchAppSrv = require('./search-app-srv');

var cartModule = require('./cart-module');
var searchModule = require('./search-module');
var tagsModule = require('./tags-module');
var accountModule = require('./manage-account-module');
var ngResource = require('angular-resource');

var searchApp = angular.module('app', [
    uiRouter,
    ngResource,
    uiBs,
    'app.search',
    'app.cart',
    'app.tags',
    'app.account'
]);

common(searchApp);
searchAppSrv(searchApp);

cartModule(angular);
searchModule(angular);
tagsModule(angular);
accountModule(angular);

searchApp
    .config(configCb)
    .run(bootstrap);

angular.bootstrap(document, [searchApp.name]);

function configCb($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
        .otherwise('search/simple');
};

function bootstrap($rootScope, bootstrap, commonService) {

    bootstrap.checkRegistration()
        .then(function (responce) {
            commonService.successValidationAction(responce.userData, responce.scope);
        })
        .catch(function (error) {
            $rootScope.inited = false;
            var errorObj = $rootScope.$new(true);
            errorObj.err = {
                code: error.code,
                data: error.data
            };
            commonService.userDataCheckError(errorObj);
        });
}
