"use strict";

module.exports = function (angular) {

    var advancedSearch = angular.module('app.search.advanced',[]);
    
    var advancedSearchCtrl = require('./advanced-search-ctrl')(advancedSearch);
    var advancedSearchDir = require('./advanced-search-dir')(advancedSearch);
    var advancedSearchSrv = require('./advanced-search-srv')(advancedSearch);
    
    advancedSearch.config(configCb);
    
    function configCb($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('search.advanced', {
                url: '/advanced',
                onEnter: showModal,
                views:{
                    "content": {
                        templateUrl: '/search.html',
                        controller: 'searchCtrl',
                        controllerAs: 'search'
                    }
                }
            
            })
            .state('search.advancedQuery', {
                url: '/advanced/?limit&searchIn&sortBy&offset&orderBy',
                params: {
                    query: '',
                    searchIn : {squash: true},
                    limit : {squash: true},
                    sortBy : {squash: true},
                    offset : {squash: true},
                    orderBy : {squash: true},
                },
                views:{
                    "content": {
                        templateUrl: '/search.html',
                        controller : 'searchCtrl',
                        controllerAs: 'search'
                    }
                }
            });

    };
    
    function showModal($uibModal) {
        var modalInstance = $uibModal.open({
            templateUrl: 'modalAdvancedSearch.html',
            controller: 'advancedSearchCtrl',
            controllerAs: 'advanced',
            size: 'lg'
        });
    };
    
}
