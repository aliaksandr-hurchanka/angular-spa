"use strict";

module.exports = function (advancedSearch) {

    advancedSearch.controller('advancedSearchCtrl', function ($state, configService, searchService, $stateParams, $scope, $uibModalInstance, $controller, searchStorage, advancedSearchConfig, searchObserver) {

        var config = configService.getConfig('searchConfig');

        $controller('searchCtrl', {
            $scope: $scope
        });

        var vm = this;
        vm.moduleName = 'advanced';

        vm.model = {
            config: advancedSearchConfig.config,
            prevId: 1,
            queryParams: $stateParams,
            data: '',
            rows: [],
            query: [],
            searchInList: config.searchIn,
            searchIn: {}
        };
        searchStorage.objQuery = vm.model.config.tplQuery;

        if (!searchObserver.hasModule(vm.moduleName))
            searchObserver.initModule(vm.moduleName, {
                updateFilter: function (param, value) {
                    vm.model.queryParams[param] = value;
                    searchStorage.data = {};
                    $state.go(
                        'search.advancedQuery',
                        vm.model.queryParams, {
                            inherit: false,
                            reload: true
                        }
                    );
                    console.log('update filter');
                },
                setSearchIn: function (val) {
                    vm.model.searchIn = vm.model.searchInList[searchService.findValueId(val, vm.model.searchInList)];
                    vm.model.queryParams.searchIn = val;
                    vm.model.queryParams.offset = 0;
                    
                    angular.extend(
                        searchStorage.objQuery,
                        privateApi.buildRequest(vm.model.searchIn.value)
                    );
                    
                    if (vm.viewApi.hasQuery()) {
                        $state.go(
                            'search.advancedQuery',
                            vm.model.queryParams, {
                                inherit: false,
                                reload: true
                            }
                        );
                    }
                    console.log('set search in >>> ', vm.model.queryParams);
                }
            })

        vm.viewApi = {
            setSearchIn: function (val) {
                vm.model.searchIn = vm.model.searchInList[searchService.findValueId(val, vm.model.searchInList)];
                vm.model.queryParams.searchIn = vm.model.searchIn.value;
                vm.model.queryParams.offset = 0;
            },
            setTypeData: function (val) {
                vm.model.searchIn = vm.model.searchInList[
                    searchService.findValueId(val, vm.model.searchInList)
                    ];
                $stateParams.searchIn = vm.model.searchIn.value;
            },
            find: function () {
                searchStorage.searchState = 'search.advancedQuery';

                angular.extend(
                    searchStorage.objQuery,
                    privateApi.buildRequest(vm.model.searchIn.value)
                );

                if (vm.viewApi.hasQuery()) {
                    vm.model.showResults = false;
                    $uibModalInstance.close();
                    
                    searchObserver.setCurrentModule = vm.moduleName;
                    $state.go(
                        searchStorage.searchState,
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
            cancel: function () {
                searchStorage.searchState = 'search.simple';
                $uibModalInstance.close(
                    $state.go(
                        searchStorage.searchState,
                        vm.model.queryParams, {
                            inherit: false,
                            reload: true
                        }
                    )
                );
            },
            addNewRow: function (index) {
                var rowObj = angular.copy(vm.model.config.tplRow),
                    rowObjResult = angular.copy(vm.model.config.baseQuery);
                rowObj.id = vm.model.prevId;
                vm.model.rows.push(rowObj);
                vm.model.query.push(rowObjResult);
                vm.model.prevId++;
            },
            changeAdvanced: function (ids, val, param) {
                param == 'query' ? vm.model.query[ids][param] = val : vm.model.query[ids][param] = val.value;
            },
            deleteRow: function (index) {
                vm.model.rows.splice(index, 1);
                vm.model.query.splice(index, 1);
            },
            //get publication or article
            getTypeData: function (type) {
                if (!type) {
                    vm.model.searchIn.value = config.searchIn[0].value;
                } else {
                    vm.model.searchIn.value = type;
                }
            }

        };

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
            getCurrentRequestContext: function () {
                var obj = {
                    conditions: vm.model.query,
                    sortingOrder: "ASC",
                    sortingField: "title"
                };

                return obj;
            },

            buildRequest: function (dest) {
                var obj = {};
                obj[dest] = privateApi.getCurrentRequestContext();

                return {
                    context: obj
                }
            },
//            setCtrlData: function setCtrlData(publications) {
//                searchStorage.params = publications;
//                vm.model.headerConfig = rlService.setHeaderConfig(publications, recordsListHeaderConfig, vm.model.queryParams);
//                vm.model.itemConfig = recordsListItemConfig;
//                vm.model.itemsList = publications.items;
//                searchStorage.data = vm.model;
//                searchStorage.params = vm.model.queryParams;
//
//            }
        };


        vm.viewApi.getTypeData(searchStorage.params.searchIn);
        vm.model.data = vm.model.config.tplRow;
        vm.model.rows.push(angular.copy(vm.model.config.tplRow));
        vm.model.rows[0].selectFields.splice(0, 1);
        vm.model.query.push(angular.copy(vm.model.config.baseQuery));
        vm.model.query[0].condition_op = 'NONE';

    });

}
