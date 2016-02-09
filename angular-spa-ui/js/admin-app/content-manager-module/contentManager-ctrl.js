"use strict";

module.exports = function ($scope, $state, promises, $stateParams, cmService, configService, contentStorage, rlService) {

    var vm = this;

    vm.viewApi = {
        isActive: function (tabs) {
            // Set active tab
            return cmService.isActiveTab(tabs, contentStorage.params.searchIn);
        },
        changeTab: function (place) {
            // Tab click go to state
            if (contentStorage.params.searchIn == place)
                return false;

            $state.go(
                'content', {
                    searchIn: place
                }, {
                    reload: true,
                    inherit: false
                }
            );

        }
    }

    vm.model = {
        sections: configService.getData('contentManagerConfig', 'sections'),
        simpleSearchPath: configService.getData('appConfig', 'paths.simpleSearchPath'),
        recordsListHeaderConfig: configService.getData('recordsListConfig', 'header'),
        recordsListItemConfig: configService.getData('recordsListConfig', 'itemConfig'),
    }

    var privateApi = {
        updateFilter: function (param, value) {
            contentStorage.params[param] = value;
            contentStorage.data = {};
            $state.go(
                'content',
                contentStorage.params, {
                    reload: true
                }
            );
        },
        setData: function (data, section) {
            data.perPage = contentStorage.params.limit;
            contentStorage.data = data;
            contentStorage.data.searchIn = contentStorage.params.searchIn;
            vm.model.headerConfig = rlService.setHeaderConfig(data, vm.model.recordsListHeaderConfig, $stateParams);
            vm.model.itemConfig = vm.model.recordsListItemConfig;
            vm.model.itemsList = data.items;
        }
    }

    $scope.$on('goToPage', function (event, data) {
        data = data * contentStorage.params.limit - contentStorage.params.limit;
        privateApi.updateFilter('offset', data);
    });

    $scope.$on('setSortBy', function (event, data) {
        privateApi.updateFilter('sortBy', data);
    });

    $scope.$on('setLimit', function (event, data) {
        privateApi.updateFilter('limit', data);
    });

    $scope.$on('goToDetails', function (event, data) {
        console.log('Lets go to the details!', data);
        contentStorage.params = data;
        $state.go(
            'editDetails', {
                searchIn : 'publication',
                id : data._id
            }, {
                reload: true,
                inherit: false
            }
        );
    })

    if (_.isEmpty(contentStorage.params) || !_.isEqual(contentStorage.params, $stateParams)) {
        contentStorage.params = $stateParams;
    }
    
    vm.model.currentSection = contentStorage.params.searchIn;
    vm.model.sections = vm.viewApi.isActive(vm.model.sections);

    var url = cmService.generateQueryParams(vm.model.simpleSearchPath, contentStorage.params);

    if (!_.isEmpty(contentStorage.data) && contentStorage.params.searchIn === contentStorage.data.searchIn) {
        privateApi.setData(contentStorage.data, vm.model.currentSection);
    } else {
        promises.getAsyncData('GET', url)
            .then(
                function (responce) {
                    privateApi.setData(responce.data[vm.model.currentSection], vm.model.currentSection);
                }
            )
    }

};
