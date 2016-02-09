"use strict";

module.exports = function ($scope, rlService) {

    var vm = this;

    vm.viewApi = {
        goToPage: function () {
            $scope.$emit('goToPage', vm.model.currentPage);
        },
        sortChange: function () {
            $scope.$emit('setSortBy', vm.model.sortBy.value);
        },
        limitChange: function () {
            $scope.$emit('setLimit', vm.model.limit.value);
        },
        goToDetails: function (data) {
            $scope.$emit('goToDetails', data);
        }
    }

    vm.model = rlService.setDefaultModel();

};
