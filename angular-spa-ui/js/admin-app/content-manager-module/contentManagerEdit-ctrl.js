"use strict";

module.exports = function ($scope, contentStorage, $stateParams, promises) {

    var vm = this;

    vm.model = {
        rowsList: {}
    };

    var privateApi = {
        convertDetails: function (details) {
            var data = [];
            for (var x in details) {
                data.push({
                    title: x,
                    value: details[x]
                })
            }
            return data;
        }
    };

    if (_.isEmpty(contentStorage.params)) {
        var url = '/service/' + $stateParams.searchIn + '/' + $stateParams.id;
        promises.getAsyncData('GET', url)
            .then(
                function (response) {
                    vm.model.rowsList = privateApi.convertDetails(response.data);
                }
            )
    } else {
        vm.model.rowsList = privateApi.convertDetails(contentStorage.params);
    }
};
