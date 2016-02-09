"use strict";

module.exports = function ($scope, configService, $uibModal, $stateParams, $state, promises, searchStorage, searchService, rlService, searchObserver, $resource) {

    var vm = this;
    vm.moduleName = 'simple';

    if (!searchObserver.hasModule(vm.moduleName))
        searchObserver.initModule(vm.moduleName, {
            updateFilter: function (param, value) {
                vm.model.queryParams[param] = value;
                searchStorage.data = {};
                $state.go(
                    'search.simpleQuery',
                    vm.model.queryParams, {
                        inherit: false,
                        reload: true
                    }
                );
            },
            setSearchIn: function (val) {
                vm.model.searchIn = vm.model.searchInList[searchService.findValueId(val, vm.model.searchInList)];
                vm.model.queryParams.searchIn = vm.model.searchIn.value;
                vm.model.queryParams.offset = 0;
                if (vm.viewApi.hasQuery()) {
                    $state.go(
                        'search.simpleQuery',
                        vm.model.queryParams, {
                            inherit: false,
                            reload: true
                        }
                    );
                }
            }
        })

    var privateApi = {
        setDefaultParams: function () {
            var params = {};
            params.searchIn = vm.model.searchInList[0].value;
            params.limit = vm.model.resultsPerPages[0].value;
            params.sortBy = vm.model.sortParams[0].value;
            params.offset = '0';
            params.orderBy = 'title';
            params.query = '';
            return params;
        },
        setResultsTo: function (currentPage, pubPerPage, resultsCount) {
            var resultsTo = currentPage * pubPerPage;
            if (resultsTo > resultsCount) {
                resultsTo = resultsCount;
            }
            return resultsTo;
        },
        setCtrlData: function setCtrlData(publications) {
            searchStorage.params = publications;
            vm.model.headerConfig = rlService.setHeaderConfig(publications, recordsListHeaderConfig, vm.model.queryParams);
            vm.model.itemConfig = recordsListItemConfig;
            vm.model.itemsList = publications.items;
            searchStorage.data = vm.model;
            searchStorage.params = vm.model.queryParams;

        },
        updateFilter: searchObserver.getMethod(searchObserver.getCurrentModule(), 'updateFilter'),
        goToDetails: function (data) {
            searchStorage.details = {
                type: vm.model.searchIn.value,
                data: data
            };

            $state.go(
                'search.details', {
                    id: data._id,
                    type: vm.model.searchIn.value,
                    backUrl: location.hash
                }, {
                    inherit: true,
                    reload: true
                })
        }
    };

    vm.viewApi = {
        setSearchIn: searchObserver.getMethod(searchObserver.getCurrentModule(), 'setSearchIn'),
        find: function () {
            if (vm.viewApi.hasQuery()) {
                vm.model.queryParams.query = vm.model.query;
                vm.model.showResults = false;
                searchObserver.setCurrentModule = vm.moduleName;
                $state.go(
                    'search.simpleQuery',
                    vm.model.queryParams, {
                        inherit: false,
                        reload: true
                    }
                );
            }
        },
        hasQuery: function () {
            if (vm.model.query || !_.isEmpty(searchStorage.objQuery)) {
                return true;
            }
            return false;
        },
        enterKeyPressed: function (event) {
            event.which === 13 && vm.viewApi.find()
        }
    };

    $scope.$on('goToPage', function (event, data) {
        if (!_.isEmpty(searchStorage.objQuery))
            searchStorage.objQuery.limits.offset = $scope.currentPage * searchStorage.objQuery.limits.limit - searchStorage.objQuery.limits.limit;

        vm.model.queryParams.offset = data * vm.model.queryParams.limit - vm.model.queryParams.limit;
        if (vm.model.queryParams.offset > 0)
            vm.model.queryParams.offset -= 1;

        privateApi.updateFilter('offset', vm.model.queryParams.offset);
    });

    $scope.$on('setSortBy', function (event, data) {
        if (!_.isEmpty(searchStorage.objQuery))
            searchStorage
            .objQuery
            .context[vm.model.queryParams.searchIn]
            .sortingOrder = data;

        privateApi.updateFilter('sortBy', data);
        console.log('Sorting... > ', data);
    });

    $scope.$on('setLimit', function (event, data) {
        if (!_.isEmpty(searchStorage.objQuery))
            searchStorage
            .objQuery
            .limits
            .limit = data;
        
        vm.model.queryParams.offset = 0;
        privateApi.updateFilter('limit', data);
    });

    $scope.$on('goToDetails', function (event, data) {
        privateApi.goToDetails(data);
    })

    var config = configService.getConfig('searchConfig');
    var recordsListHeaderConfig = configService.getData('recordsListConfig', 'header');
    var recordsListItemConfig = configService.getData('recordsListConfig', 'itemConfig');
    var defaultSimpleParams = configService.getData('searchConfig', 'defaultSimpleParams');

    if (_.isEmpty($stateParams)) {
        angular.extend($stateParams, defaultSimpleParams);
    }

    vm.model = {
        queryResult: '',
        showResults: false,
        queryParams: $stateParams,
        sortParams: config.sortParams,
        resultsPerPages: config.resultsPerPage,
        searchInList: config.searchIn
    }

    // ngResourse query example
    //    var request = $resource('/service/search/?query=:query&limit=:limit&searchIn=:searchIn&sortBy=:sortBy&offset=:offset&orderBy=:orderBy', {
    //        query: '@query',
    //        limit: '@limit',
    //        searchIn: '@searchIn',
    //        sortBy: '@sortBy',
    //        offset: '@offset',
    //        orderBy: '@orderBy'
    //    });

    //delete vm.model.queryParams.limit;
    //console.log(vm.model.queryParams);
    //    var data = request.get(vm.model.queryParams);
    //    data.$promise.then(function (result) {
    //        console.log('Result of test query with ngResourse', result);
    //    });
    // end of ngResourse query example

    if (_.isEmpty(vm.model.queryParams) || vm.model.queryParams.query === undefined) {
        vm.model.queryParams = privateApi.setDefaultParams();
        vm.model.searchIn = vm.model.searchInList[searchService.findValueId(vm.model.queryParams.searchIn, vm.model.searchInList)];

        if (!_.isEmpty(searchStorage.data) && !_.isEmpty(searchStorage.params)) {
            vm.model.queryParams = searchStorage.params;
            vm.model.searchIn = vm.model.searchInList[searchService.findValueId(vm.model.queryParams.searchIn, vm.model.searchInList)];
            vm.model.query = searchStorage.params.query;
            privateApi.setCtrlData(searchStorage.data);
        }
    } else {

        if (_.isEmpty(searchStorage.objQuery)) {
            searchStorage.searchType = 'GET';
            //Do when we have params in $stateParams - means that it is search action
            var queryUrl = searchService.generateQueryParams(config.paths.simpleSearchPath, vm.model.queryParams);
            vm.model.query = $stateParams.query;
        } else {
            var queryUrl = config.paths.advancedSearchPath;
            searchStorage.searchType = 'POST';
        }

        //        promises.getAsyncData('GET', queryUrl)
        promises.getAsyncData(searchStorage.searchType, queryUrl, searchStorage.objQuery)
            .then(function (result) {
                vm.model.searchIn = vm.model.searchInList[searchService.findValueId(vm.model.queryParams.searchIn, vm.model.searchInList)];
                console.log('vm', vm.model.searchIn);
                var publications = result.data[vm.model.searchIn.value];
                console.log('p', publications);
                privateApi.setCtrlData(publications);

            })
            .catch(function (err) {
                console.error('Error - cant get data!' + err);
            });
    };

    $scope.modal = function () {
        $state.go('search.advanced', searchStorage.params, {
            // prevent the events onStart and onSuccess from firing
            notify: false,
            // prevent reload of the current state
            reload: false,
            // replace the last record when changing the params so you don't hit the back button and get old params
            location: 'replace',
            // inherit the current params on the url
            inherit: true
        });
    }

};
