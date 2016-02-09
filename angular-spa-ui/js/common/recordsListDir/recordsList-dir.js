"use strict";

module.exports = function (rlService) {
    return {
        restrict: "E",
        scope: {
            items: '=itemslist',
            header: '=headerSettings',
            itemsConfig: '=itemsSettings',
        },
        templateUrl: '/results.html',
        controller: 'recordsListCtrl',
        controllerAs: 'recordsList',
        link: function (scope, element, attrs, vm) {
            scope.$watchCollection('header', function (newValue, oldValue) {
                if (newValue !== undefined) {
                    vm.model = rlService.setModelValues(newValue, vm.model);
                }
            })

        }
    }
};
