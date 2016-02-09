"use strict";

module.exports = function (angular) {

    require('./advanced-search')(angular);

    var search = angular.module('app.search', ['app.search.advanced']);

    var searchCtrl = require('./search-ctrl');
    var validateDetailsRowsFilter = require('./validateDetails-filter');
    var searchDetailsCtrl = require('./searchDetails-ctrl');
    var searchService = require('./searchService-srv');
    var searchObserver = require('./searchObserver-srv');

    search
        .config(configCb)
        .constant('searchConfig', require('./search-config'))
        .controller('searchCtrl', searchCtrl)
        .controller('searchDetailsCtrl', searchDetailsCtrl)
        .service('searchService', searchService)
        .service('searchObserver', searchObserver)
        .filter('validateDetailsRows', validateDetailsRowsFilter)


    function configCb($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('search', {
                abstract: true,
                url: '/search',
                views: {
                    "module-content": {
                        template: '<div ui-view="content"></div>'
                    }
                }
            })
            .state('search.simple', {
                url: '/simple',
                name: 'simple',
                views: {
                    "content": {
                        templateUrl: '/search.html',
                        controller: 'searchCtrl',
                        controllerAs: 'search'
                    }
                }
            })
            .state('search.simpleQuery', {
                url: '/simple/?query&limit&searchIn&sortBy&offset&orderBy',
                params: {
                    searchIn: {
                        squash: true
                    },
                    limit: {
                        squash: true
                    },
                    sortBy: {
                        squash: true
                    },
                    offset: {
                        squash: true
                    },
                    orderBy: {
                        squash: true
                    }
                },
                views: {
                    "content": {
                        templateUrl: '/search.html',
                        controller: 'searchCtrl',
                        controllerAs: 'search'
                    }
                }
            })
            .state('search.details', {
                url: '/details/:type/:id/:backUrl',
                views: {
                    "content": {
                        templateUrl: '/details.html',
                        controller: 'searchDetailsCtrl',
                        controllerAs: 'details'
                    }
                }
            });
    };

};
